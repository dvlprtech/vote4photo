import { Buffer } from 'node:buffer';
import { getMimeType } from '@lib/common/mime';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, logVotes, user, userPhoto } from "@lib/domain/schema";
import { desc, eq, lte, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import { BodyData } from "hono/utils/body";
import { DateTime } from "luxon";

type ContestType = typeof contest.$inferSelect;
type UserPhotoType = typeof userPhoto.$inferSelect;
type ContestPhotoType = typeof contestPhoto.$inferSelect;

type UpdatableContestDataType = {
    title: string,
    description: string, 
    initTimestamp: string,
    duration: number
}

export const createContest = async (c: Context, initialData: UpdatableContestDataType) : Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const iniDate = DateTime.fromISO(initialData.initTimestamp).toJSDate();
    if (iniDate.getTime() < Date.now())  {
        throw new HTTPException(400, {message: 'Init date should be a future date'});
    }
    
    const contestData : Partial<ContestType> = {
        title: initialData.title,
        description: initialData.description,
        initTimestamp: iniDate,
        endTimestamp: new Date(iniDate.getTime() + initialData.duration),
        status: 'pending'
    }
    const result = await db.insert(contest).values(contestData as ContestType).returning({id: contest.id});
    return {...contestData, ...result[0]};
}


export const updateContest = async (c: Context, contestId: number, newData: UpdatableContestDataType) : Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, {message: 'Contest not found'});
    }
    if (curentContest[0].status !== 'pending') {
        throw new HTTPException(400, {message: 'Contest cannot be modified'});
    }
    const contestData : Partial<ContestType> = {}
    if (newData.initTimestamp) {
        const iniDate = DateTime.fromISO(newData.initTimestamp).toJSDate();
        if (iniDate.getTime() < Date.now())  {
            throw new HTTPException(400, {message: 'Init date should be a future date'});
        }
    }
    if (newData.duration) {
        const iniDate = DateTime.fromISO(newData.initTimestamp).toJSDate();
        contestData.endTimestamp = new Date(iniDate.getTime() + newData.duration);
    }
    newData.title && (contestData.title = newData.title);
    newData.description && (contestData.description = newData.description);

    const result = await db.update(contest).set(contestData).returning({initTimestamp: contest.initTimestamp, endTimestamp: contest.endTimestamp, title: contest.title, description: contest.description});
    return {...result[0]};
}

export const getContest = async (c: Context, contestId: number) : Promise<Partial<ContestType & {photos: any[]}>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, {message: 'Contest not found'});
    }
    //db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
    const contestPhotos = await db.select({
        photoId: contestPhoto.photoId,
        votes: contestPhoto.votes,
        userId: userPhoto.userId,
        photoKey: userPhoto.photoKey,
        title: userPhoto.title,
        size: userPhoto.size,
    }).from(contestPhoto).leftJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId)).where(eq(contestPhoto.contestId, contestId));
    
    return {...curentContest[0], photos: contestPhotos};
}

export const upLoadPhotoToBucket = async (c: Context, title: string, photo: File) : Promise<Partial<UserPhotoType>> => {
    const uuidPhoto = crypto.randomUUID();
    const extension = photo.name.split('.').pop();
    const r2PhotoName = `${uuidPhoto}.${extension}`;
    const mimeType = getMimeType(photo.name);

    const r = await c.env.PHOTO_BUCKET.put(r2PhotoName, photo, { 
      customMetadata: { title, originalName: photo.name },
      httpMetadata: {contentType: mimeType}
    });
    const photoMetadata = {
      title: r.customMetadata.title,    
      photoKey: r.key,
      md5: Buffer.from(r.checksums.md5 as ArrayBuffer).toString('hex'),
      size: r.size
    }
    const photoJson = {
      name: title,
      description: "Photo from Vote4Photo",
      image: `${c.env.BUCKET_URL}/${r2PhotoName}`,
      size: r.size,
      md5: photoMetadata.md5,
    }
    await c.env.PHOTO_BUCKET.put(`${uuidPhoto}.json`, JSON.stringify(photoJson, null, 2), { 
      customMetadata: { title },
      httpMetadata: {contentType: 'application/json'}
    });
    return photoMetadata;
}

export const upLoadPhoto = async (c: Context, contestId: number, userId: number, body: BodyData) : Promise<any> => {
    const photo = body['photo'] as File;
    const title = body['title'] as string;
    const salePrice = parseFloat(body['salePrice'] as string);
    
    const photoMetadata = await upLoadPhotoToBucket(c, title, photo);
    const db = getConnection(c.env.DB);
    const newPhoto = await db.insert(userPhoto).values({
        ...photoMetadata,
        userId,       
        // TODO: Access to block chain for the following fields
        tokenAddress: '',
        tokenId: 0,
        ownerSince: new Date(),
        mintTx: '',
        lastTransferTx: ''
    } as UserPhotoType).returning({id: userPhoto.id});

    const newPhotoContest = await db.insert(contestPhoto).values({
        photoId: newPhoto[0].id,
        contestId: contestId,
        votes: 0,
        salePrice
    } as ContestPhotoType).returning({id: contestPhoto.id});

    const photoUrl = `${c.env.BUCKET_URL}/${photoMetadata.photoKey}`;
    return {photoId: newPhoto[0].id, contestPhotoId: newPhotoContest[0].id, title, photoUrl};
}

export const votePhoto = async (c: Context, contestId: number, userId: number, photoId: number, votes: number) : Promise<any> => {

    const db = getConnection(c.env.DB);
    const userVotes = await db.select({remainingVotes: user.remainingVotes}).from(user).where(eq(user.id, userId));
    if (votes > userVotes[0].remainingVotes) {
        throw new HTTPException(400, {message: 'Not enough votes'});
    }
    const photoVotes = await db.update(contestPhoto).set({votes: sql`votes + ${votes}`}).where(eq(contestPhoto.id, photoId)).returning({votes: contestPhoto.votes});
    if (photoVotes.length === 0) {
        throw new HTTPException(404, {message: 'Photo not found'});
    }
    const rv = await db.update(user).set({remainingVotes: sql`remaining_votes - ${votes}`}).where(eq(user.id, userId)).returning({remainingVotes: user.remainingVotes});

    const logVote = await db.insert(logVotes).values({
        userId,
        contestPhotoId: photoId,
        votes
    }).returning({id: logVotes.id});
    return {votes, remainigVotes: rv[0].remainingVotes, logVoteId: logVote[0].id};
}


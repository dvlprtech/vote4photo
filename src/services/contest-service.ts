import { Buffer } from 'node:buffer';
import { getMimeType } from '@lib/common/mime';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, logVotes, user, userPhoto } from "@lib/domain/schema";
import { desc, eq, gte, isNotNull, lte, ne, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import { BodyData } from "hono/utils/body";
import { DateTime } from "luxon";
import { getDomain, getMessageToSignForNFTCreation, getNonce, sendMetatransaction } from './blockchain-services';
import { ForwardRequest, SignedForwardRequest } from '@lib/domain/blockchain';
import { getUrlBase } from '@lib/common/hono-utils';
import { Hex } from 'viem';

type ContestType = typeof contest.$inferSelect;
type UserPhotoType = typeof userPhoto.$inferSelect;
type ContestPhotoType = typeof contestPhoto.$inferSelect;

type UpdatableContestDataType = {
    title: string,
    description: string, 
    initTimestamp: string,
    endTimestamp: string
}

export const getContests = async (c: Context, includeFinished: boolean = false) : Promise<(Partial<ContestType> & {totalPhotos: number})[]> => {
    const db = getConnection(c.env.DB);
    const filter = includeFinished ? gte(contest.endTimestamp, new Date(Date.now() - 7*24*3600*1000)) : ne(contest.status, 'finished');
    const totalPhotos = db.select({
        contestId: contestPhoto.contestId,
        total: sql<number>`count(*)`.as('total')
    }).from(contestPhoto).groupBy(contestPhoto.contestId).as('totalPhotos');

    const contests = await db.select({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        initTimestamp: contest.initTimestamp,
        endTimestamp: contest.endTimestamp,
        status: contest.status,
        totalPhotos: sql<number>`COALESCE(${totalPhotos.total}, 0)`.as('totalPhotos')
    }).from(contest).leftJoin(totalPhotos, eq(totalPhotos.contestId, contest.id)).where(filter).orderBy(contest.endTimestamp);
    
    return [...contests];
}



export const createContest = async (c: Context, initialData: UpdatableContestDataType) : Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const iniDate = DateTime.fromISO(initialData.initTimestamp).toJSDate();
    if (iniDate.getTime() < Date.now())  {
        throw new HTTPException(400, {message: 'La fecha de inicio no puede ser en el pasado'});
    }
    const endDate = DateTime.fromISO(initialData.endTimestamp).toJSDate();
    if (iniDate.getTime() > endDate.getTime())  {
        throw new HTTPException(400, {message: 'La fecha de inicio no puede ser posterior a la fecha de fin'});
    }
    
    const contestData : Partial<ContestType> = {
        title: initialData.title,
        description: initialData.description,
        initTimestamp: iniDate,
        endTimestamp: endDate,
        status: 'pending'
    }
    const result = await db.insert(contest).values(contestData as ContestType).returning({id: contest.id});
    return {...contestData, ...result[0]};
}


export const updateContest = async (c: Context, contestId: number, newData: UpdatableContestDataType) : Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, {message: 'Concurso no encontrado'});
    }
    if (curentContest[0].status !== 'pending') {
        throw new HTTPException(400, {message: 'El concurso no puede modificarse'});
    }
    const contestData : Partial<ContestType> = {}
    if (newData.initTimestamp) {
        const iniDate = DateTime.fromISO(newData.initTimestamp).toJSDate();
        if (iniDate.getTime() < Date.now())  {
            throw new HTTPException(400, {message: 'La fecha de inicio no puede ser en el pasado'});
        }
        contestData.initTimestamp = iniDate;
    }
    if (newData.endTimestamp) {
        const endDate = DateTime.fromISO(newData.endTimestamp).toJSDate();
        const iniDate = contestData.initTimestamp || curentContest[0].initTimestamp;
        if (iniDate.getTime() > endDate.getTime())  {
            throw new HTTPException(400, {message: 'La fecha de inicio no puede ser posterior a la fecha de fin'});
        }
        contestData.endTimestamp = endDate;
    }
    newData.title && (contestData.title = newData.title);
    newData.description && (contestData.description = newData.description);

    const result = await db.update(contest).set(contestData).where(eq(contest.id, contestId)).returning({initTimestamp: contest.initTimestamp, endTimestamp: contest.endTimestamp, title: contest.title, description: contest.description});
    return {...result[0]};
}

export const initContest = async (c: Context, contestId: number) : Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, {message: 'Concurso no encontrado'});
    }
    if (curentContest[0].status !== 'pending') {
        throw new HTTPException(400, {message: 'El concurso no puede iniciarse'});
    }
    const contestData : Partial<ContestType> = {}
    contestData.initTimestamp = new Date();
    contestData.status = 'active';

    const result = await db.update(contest).set(contestData).where(eq(contest.id, contestId)).returning({initTimestamp: contest.initTimestamp, status: contest.status});
    return {...result[0]};
}


export const getContest = async (c: Context, contestId: number) : Promise<Partial<ContestType & {photos: any[]}>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, {message: 'Concurso no encontrado'});
    }
    //db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
    const contestPhotos = await db.select({
        photoId: contestPhoto.photoId,
        votes: contestPhoto.votes,
        userId: userPhoto.userId,
        photoKey: userPhoto.photoKey,
        title: userPhoto.title,
        size: userPhoto.size,
        price: contestPhoto.salePrice,
    }).from(contestPhoto).innerJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId)).where(eq(contestPhoto.contestId, contestId));
    
    return {...curentContest[0], photos: contestPhotos};
}

export const uploadPhotoToBucket = async (c: Context, title: string, photo: File) : Promise<Partial<UserPhotoType>> => {
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
      image: `${getUrlBase(c)}/api/photo/${r.key}`,
      size: r.size,
      md5: photoMetadata.md5,
    }
    await c.env.PHOTO_BUCKET.put(`${uuidPhoto}.json`, JSON.stringify(photoJson, null, 2), { 
      customMetadata: { title },
      httpMetadata: {contentType: 'application/json'}
    });
    return photoMetadata;
}

export const preparePhotoNFT = async (c: Context, contestId: number, userId: number, body: BodyData) : Promise<{
    messageToSign: ForwardRequest,
    photoKey: string,
    domain: object
}> => {
    const photo = body['photo'] as File;
    const title = body['title'] as string;
    if (!photo) {
        throw new HTTPException(400, {message: 'Falta la foto'});
    }
    const photoMetadata = await uploadPhotoToBucket(c, title, photo);
    const photoHash = photoMetadata.md5!;
    checkPhotoExists(c, photoHash);
    const { photoKey } = photoMetadata;
    const jsonKey = photoKey!.split('.').shift() + '.json';
    const userAccount = c.get('user').account;
    const contractAddress = c.env.V4P_CONTRACT;
    const jsonTokenUrl = `${getUrlBase(c)}/api/photo/${jsonKey}`;
    const nonce = await getNonce(c, userAccount);
    const rawMessageToSign = await getMessageToSignForNFTCreation(userAccount, contractAddress, nonce, jsonTokenUrl);
    const messageToSign = Object.keys(rawMessageToSign).reduce((acc: any, key: string) => {
        const value = rawMessageToSign[key as keyof ForwardRequest];
        if (typeof value === 'bigint') {
            acc[key] = parseInt(value.toString());
        } else {
            acc[key] = value;
        }
        return acc;    
    }, {} as Record<keyof ForwardRequest, unknown>);
    console.log('Message to sign:', rawMessageToSign);

    return {messageToSign, photoKey: photoKey!, domain: await getDomain(c) };
}

const checkPhotoExists = async (c: Context, photoHash: string) => {
    const db = getConnection(c.env.DB);
    const exists = await db.select({existe: sql`true`}).from(userPhoto).where(eq(userPhoto.md5, photoHash));
    if (exists.length > 0) {
        throw new HTTPException(400, {message: 'La foto ya existe'});
    }
}

export const createPhotoNFT = async (c: Context, contestId: number, userId: number, payload: {
    photoKey: string,
    salePrice: number,
    signedMessage: SignedForwardRequest
}) : Promise<any> => {
    const {signedMessage, photoKey,salePrice} = payload;
    const db = getConnection(c.env.DB);
    const meta = await c.env.PHOTO_BUCKET.head(payload.photoKey) as R2Object;
    if (!meta) {
        throw new HTTPException(404, {message: 'Imagen no encontrada en repositorio'});
    }

    const photoMetadata = {
        title: meta?.customMetadata?.title,    
        photoKey: payload.photoKey,
        md5: Buffer.from(meta.checksums.md5 as ArrayBuffer).toString('hex'),
        size: meta.size
      }

    const [tokenData] = await sendMetatransaction(c, signedMessage);
    if (!tokenData) {
        throw new HTTPException(500, {message: 'No se recuperaron datos del NFT'});
    }
    console.log('tokenData:', tokenData);
    const txData ={
        owner: (tokenData as any).args.owner,
        txHash: tokenData.transactionHash,
        tokenId: Number((tokenData as any).args.tokenId),
    }

    const newPhoto = await db.insert(userPhoto).values({
        ...photoMetadata,
        userId,               
        account: txData.owner,
        tokenId: txData.tokenId,
        ownerSince: new Date(),
        mintTx: txData.txHash,
        lastTransferTx: txData.txHash
    } as UserPhotoType).returning({id: userPhoto.id});

    const newPhotoContest = await db.insert(contestPhoto).values({
        photoId: newPhoto[0].id,
        contestId: contestId,
        votes: 0,
        salePrice
    } as ContestPhotoType).returning({id: contestPhoto.id});

    // const photoUrl = `${c.env.BUCKET_URL}/${photoMetadata.photoKey}`;
//    return {photoId: newPhoto[0].id, contestPhotoId: newPhotoContest[0].id, title, photoUrl};
    return {
        photoId: newPhoto[0].id, 
        contestPhotoId: newPhotoContest[0].id, 
        title: photoMetadata.title, 
        size: photoMetadata.size,
        photoKey
    };
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


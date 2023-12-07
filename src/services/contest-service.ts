import { Buffer } from 'node:buffer';
import { getMimeType } from '@lib/common/mime';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, logVotes, user, userPhoto } from "@lib/domain/schema";
import { desc, eq, gte, isNotNull, lte, ne, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import { BodyData } from "hono/utils/body";
import { DateTime } from "luxon";
import { sendMetatransaction } from './blockchain-services';
import { ForwardRequest, SignedForwardRequest } from '@lib/domain/blockchain';
import { getUrlBase } from '@lib/common/hono-utils';
import { Hex } from 'viem';
import { FEES } from '@lib/domain/params';
import { checkAndUseFunds } from './account-service';

type ContestType = typeof contest.$inferSelect;
type UserPhotoType = typeof userPhoto.$inferSelect;
type ContestPhotoType = typeof contestPhoto.$inferSelect;

type UpdatableContestDataType = {
    title: string,
    description: string, 
    initTimestamp: string,
    endTimestamp: string
}
type PhotoNFTData = {
    photoId: number,
    contestPhotoId: number,
    title: string,
    size: number,
    photoKey: string
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


export const createPhotoNFT = async (c: Context, contestId: number, userId: number, payload: {
    photoKey: string,
    salePrice: number,
    signedMessage: SignedForwardRequest
}) : Promise<PhotoNFTData> => {
    const {signedMessage, photoKey,salePrice} = payload;
    const db = getConnection(c.env.DB);
    const meta = await c.env.PHOTO_BUCKET.head(payload.photoKey) as R2Object;
    if (!meta) {
        throw new HTTPException(404, {message: 'Imagen no encontrada en repositorio'});
    }
    const [existingPhoto] = await db.select({exists: sql`1`}).from(userPhoto).where(eq(userPhoto.photoKey, photoKey));
    const contestFee = existingPhoto ? FEES.CONTEST : FEES.CONTEST_NEW_PHOTO;
    checkAndUseFunds(c, contestFee);
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

    return {
        photoId: newPhoto[0].id, 
        contestPhotoId: newPhotoContest[0].id, 
        title: photoMetadata.title!, 
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


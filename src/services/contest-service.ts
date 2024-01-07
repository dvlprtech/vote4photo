import { Buffer } from 'node:buffer';
import { getMimeType } from '@lib/common/mime';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, logVotes, user, userPhoto, userVotes } from "@lib/domain/schema";
import { and, desc, eq, gt, gte, isNotNull, lte, ne, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import { BodyData } from "hono/utils/body";
import { DateTime } from "luxon";
import { sendMetatransaction } from './blockchain-services';
import { ForwardRequest, SignedForwardRequest } from '@lib/domain/blockchain';
import { getUrlBase } from '@lib/common/hono-utils';
import { Address, Hex } from 'viem';
import { FEES } from '@lib/domain/params';
import { checkAndUseFunds } from './account-service';
import { Bindings } from '@lib/domain/env';
import { createOperation } from './operation-service';
import { ZERO_ADDRESS } from '@lib/common/wallet-utils';

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
    price?: number,
    photoKey: string
}

type ResultContestType = {
    contestId: number,
    winnerContestPhotoId: number,
    winnerPhotoId: number,
    ownerId: number,
    winnerVoterId: number
}


export const getContests = async (c: Context, includeFinished: boolean = true): Promise<(Partial<ContestType> & { totalPhotos: number })[]> => {
    const db = getConnection(c.env.DB);
    const filter = includeFinished ? gte(contest.endTimestamp, new Date(Date.now() - 7 * 24 * 3600 * 1000)) : ne(contest.status, 'finished');
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
        winnerPhotoId: contest.winningPhotoId,
        totalPhotos: sql<number>`COALESCE(${totalPhotos.total}, 0)`.as('totalPhotos')
    }).from(contest).leftJoin(totalPhotos, eq(totalPhotos.contestId, contest.id)).where(filter).orderBy(contest.endTimestamp);

    return [...contests];
}



export const createContest = async (c: Context, initialData: UpdatableContestDataType): Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const initNow = !initialData.initTimestamp;
    const iniDate = initNow ? new Date() : DateTime.fromISO(initialData.initTimestamp).toJSDate();
    if (!initNow && iniDate.getTime() < Date.now()) {
        throw new HTTPException(400, { message: 'La fecha de inicio no puede ser en el pasado' });
    }
    const endDate = DateTime.fromISO(initialData.endTimestamp).toJSDate();
    if (iniDate.getTime() > endDate.getTime()) {
        throw new HTTPException(400, { message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
    }

    const contestData: Partial<ContestType> = {
        title: initialData.title,
        description: initialData.description,
        initTimestamp: iniDate,
        endTimestamp: endDate,
        status: initNow ? 'active' : 'pending'
    }
    const result = await db.insert(contest).values(contestData as ContestType).returning({ id: contest.id });
    return { ...contestData, ...result[0] };
}


export const updateContest = async (c: Context, contestId: number, newData: UpdatableContestDataType): Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, { message: 'Concurso no encontrado' });
    }
    if (curentContest[0].status !== 'pending') {
        throw new HTTPException(400, { message: 'El concurso no puede modificarse' });
    }
    const contestData: Partial<ContestType> = {}
    if (newData.initTimestamp) {
        const iniDate = DateTime.fromISO(newData.initTimestamp).toJSDate();
        if (iniDate.getTime() < Date.now()) {
            throw new HTTPException(400, { message: 'La fecha de inicio no puede ser en el pasado' });
        }
        contestData.initTimestamp = iniDate;
    }
    if (newData.endTimestamp) {
        const endDate = DateTime.fromISO(newData.endTimestamp).toJSDate();
        const iniDate = contestData.initTimestamp || curentContest[0].initTimestamp;
        if (iniDate.getTime() > endDate.getTime()) {
            throw new HTTPException(400, { message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
        }
        contestData.endTimestamp = endDate;
    }
    contestData.title = newData.title ?? contestData.title;
    contestData.description = newData.description ?? contestData.description;

    const [updatedData] = await db.update(contest).set(contestData).where(eq(contest.id, contestId)).returning({ initTimestamp: contest.initTimestamp, endTimestamp: contest.endTimestamp, title: contest.title, description: contest.description });
    return { ...updatedData, id: contestId };
}

export const initContest = async (c: Context, contestId: number): Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const curentContest = await db.select().from(contest).where(eq(contest.id, contestId));
    if (curentContest.length === 0) {
        throw new HTTPException(404, { message: 'Concurso no encontrado' });
    }
    if (curentContest[0].status !== 'pending') {
        throw new HTTPException(400, { message: 'El concurso no puede iniciarse' });
    }
    const contestData: Partial<ContestType> = {}
    contestData.initTimestamp = new Date();
    contestData.status = 'active';

    const [result] = await db.update(contest).set(contestData).where(eq(contest.id, contestId)).returning({ initTimestamp: contest.initTimestamp, status: contest.status });
    return { ...result };
}


export const getContest = async (c: Context, contestId: number): Promise<Partial<ContestType & { photos: any[] }>> => {
    const userId = c.get('user').id;
    const db = getConnection(c.env.DB);
    const [currentContest] = await db.select().from(contest).where(eq(contest.id, contestId));
    if (!currentContest) {
        throw new HTTPException(404, { message: 'Concurso no encontrado' });
    }
    //db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
    const ownVotesQuery = sql<number>`(select ${userVotes.votes} 
                                        from ${userVotes} 
                                        where ${userVotes.userId} = ${userId} and
                                        ${userVotes.contestPhotoId} = ${contestPhoto.id})`.as('ownVotes')
    const contestPhotos = await db.select({
        contestPhotoId: contestPhoto.id,
        photoKey: userPhoto.photoKey,
        title: userPhoto.title,
        size: userPhoto.size,
        price: contestPhoto.salePrice,
        photoId: contestPhoto.photoId,
        ownVotes: ownVotesQuery,
    }).from(contestPhoto).innerJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId)).where(eq(contestPhoto.contestId, contestId));

    return { ...currentContest, photos: contestPhotos };
}


export const participateInContestWithNFT = async (c: Context, contestId: number, userId: number, payload: {
    photoKey: string,
    salePrice: number,
    signedMessage: SignedForwardRequest
}): Promise<PhotoNFTData> => {
    const { signedMessage, photoKey, salePrice } = payload;
    const db = getConnection(c.env.DB);
    const meta = await c.env.PHOTO_BUCKET.head(payload.photoKey) as R2Object;
    if (!meta) {
        throw new HTTPException(404, { message: 'Imagen no encontrada en repositorio' });
    }
    const [existingPhoto] = await db.select({
        id: userPhoto.id,
        account: userPhoto.account
    }).from(userPhoto).where(eq(userPhoto.photoKey, photoKey));
    const contestFee = existingPhoto ? FEES.CONTEST : FEES.CONTEST_NEW_PHOTO;
    if (existingPhoto && existingPhoto.account !== c.get('user').account) {
        throw new HTTPException(400, { message: 'La foto pertenece a un cuenta distinta de la conectada' });
    }
    checkAndUseFunds(c, contestFee);
    const photoMetadata = {
        title: meta?.customMetadata?.title,
        photoKey: payload.photoKey,
        md5: Buffer.from(meta.checksums.md5 as ArrayBuffer).toString('hex'),
        size: meta.size
    }

    let photoId;

    if (!existingPhoto) {
        const [tokenData] = await sendMetatransaction(c, signedMessage, 'mint');
        if (!tokenData) {
            throw new HTTPException(500, { message: 'No se recuperaron datos del NFT' });
        }
        console.log('tokenData:', tokenData);
        const txData = {
            owner: (tokenData as any).args.owner,
            txHash: tokenData.transactionHash,
            tokenId: Number((tokenData as any).args.tokenId),
        }
        const [newPhoto] = await db.insert(userPhoto).values({
            ...photoMetadata,
            userId,
            account: txData.owner,
            tokenId: txData.tokenId,
            ownerSince: new Date(),
            mintTx: txData.txHash,
            lastTransferTx: txData.txHash
        } as UserPhotoType).returning({ id: userPhoto.id });
        photoId = newPhoto.id;
    } else {
        photoId = existingPhoto.id;
    }

    const newPhotoContest = await db.insert(contestPhoto).values({
        photoId: photoId,
        contestId: contestId,
        votes: 0,
        salePrice
    } as ContestPhotoType).returning({ id: contestPhoto.id });

    return {
        photoId: photoId,
        contestPhotoId: newPhotoContest[0].id,
        title: photoMetadata.title!,
        size: photoMetadata.size,
        price: salePrice,
        photoKey
    };
}

export const votePhoto = async (c: Context, contestId: number, userId: number, contestPhotoId: number, votes: number, wantBuy: boolean): Promise<any> => {
    const db = getConnection(c.env.DB);
    const [{ userRemainingVotes }] = await db.select({ userRemainingVotes: user.remainingVotes }).from(user).where(eq(user.id, userId));
    if (votes > userRemainingVotes) {
        throw new HTTPException(400, { message: 'No tienes suficientes votos' });
    }
    const [photoVotes] = await db.update(contestPhoto)
        .set({ votes: sql`votes + ${votes}` })
        .where(and(eq(contestPhoto.id, contestPhotoId), eq(contestPhoto.contestId, contestId))).returning({ votes: contestPhoto.votes });
    if (!photoVotes) {
        throw new HTTPException(404, { message: 'Foto no encontrada' });
    }
    const [rv] = await db.update(user).set({ remainingVotes: sql`remaining_votes - ${votes}` }).where(eq(user.id, userId)).returning({ remainingVotes: user.remainingVotes });

    const logVote = await db.insert(logVotes).values({
        userId,
        contestPhotoId,
        votes
    }).returning({ id: logVotes.id });
    const [existingVote] = await db.select({
        id: userVotes.id,
    }).from(userVotes).where(and(
        eq(userVotes.userId, userId),
        eq(userVotes.contestPhotoId, contestPhotoId)
    ));
    
    if (existingVote) {
        await db.update(userVotes).set({ votes: sql`votes + ${votes}`, wantBuy }).where(eq(userVotes.id, existingVote.id));
    } else {
        await db.insert(userVotes).values({
            userId,
            contestPhotoId,
            votes,
            wantBuy
        });
    }
    return { contestPhotoId, votes, remainingVotes: rv.remainingVotes, logVoteId: logVote[0].id };

}

/**
 * Elige para la foto ganadora de un concurso a uno de sus votantes como próximo propietario. La elección es podenrada en función de los votos.
 * @param env Variables de entorno
 * @param contestId Id del concurso
 */
export const drawPhotoWinner = async (env: Bindings, contestId: number): Promise<ResultContestType | null> => {
    const db = getConnection(env.DB);
    const [{ maxVotes }] = await db.select({
        maxVotes: sql<number>`max(votes)`.as('maxVotes')
    }).from(contestPhoto).where(eq(contestPhoto.contestId, contestId));
    if (!maxVotes) {
        return null;
    }
    const winnerPhotos = await db.select({
        contestPhotoId: contestPhoto.id,
        photoId: contestPhoto.photoId,
        votes: contestPhoto.votes
    }).from(contestPhoto).where(and(
        eq(contestPhoto.contestId, contestId),
        eq(contestPhoto.votes, maxVotes)));
    let winnerPhoto = winnerPhotos[0];
    if (winnerPhotos.length > 1) {
        // En caso de empate, la foto más antígua gana
        winnerPhotos.forEach(wp => {
            if (wp.photoId! < winnerPhoto.photoId!) {
                winnerPhoto = wp;
            }
        });
    }
    const [{ ownerId, title }] = await db.select({
        ownerId: userPhoto.userId,
        title: userPhoto.title
    }).from(userPhoto).where(eq(userPhoto.id, winnerPhoto.photoId!));

    const totalVotes = winnerPhoto.votes!;
    const winningVote = Math.floor(Math.random() * totalVotes);
    const voters = await db.select({
        userId: userVotes.userId,
        account: user.lastUsedAccount,
        votes: userVotes.votes
    }).from(userVotes)
        .innerJoin(user, eq(user.id, userVotes.userId))
        .where(eq(userVotes.contestPhotoId, winnerPhoto.contestPhotoId));

    let winnerVoterId = 0;
    let currentVote = 0;
    let destinationAccount = ZERO_ADDRESS;
    for (const v of voters) {
        currentVote += v.votes;
        if (currentVote > winningVote) {
            winnerVoterId = v.userId!;
            destinationAccount = v.account! as Address;
            break;
        }
    }
    if (winnerVoterId === 0) {
        return null;
    }
    const prize = totalVotes * env.MONEY_PER_VOTE;
    await db.update(contest).set({
        winningPhotoId: winnerPhoto.photoId!,
        totalPrize: prize,
        userDrawWinningId: winnerVoterId
    }).where(eq(contest.id, contestId));
    if (winnerVoterId === ownerId) {
        // Puede pasar que si alguien vota por su foto acabe ganándola
        createOperation(env, {
            userId: ownerId!,
            destinationUserId: winnerVoterId,
            destinationAccount,
            contestPhotoId: winnerPhoto.contestPhotoId!,
            type: 'notification',
            message: `¡Enhorabuena! Tu foto '${title}' ha ganado el concurso con un premio de: ${prize.toFixed(2)} €.`,
        });
        await db.update(user).set({
            funds: sql`funds + ${prize}`
        }).where(eq(user.id, ownerId));
    } else {
        createOperation(env, {
            userId: ownerId!,
            destinationUserId: winnerVoterId,
            destinationAccount,
            contestPhotoId: winnerPhoto.contestPhotoId!,
            type: 'accept_prize',
            message: `¡Enhorabuena! Tu foto '${title}' ha ganado el concurso con un premio de: ${prize.toFixed(2)} €. Para recibirlo, debes aceptar la transferencia de la foto.`,
        });
    }
    return {
        contestId,
        winnerContestPhotoId: winnerPhoto.contestPhotoId!,
        winnerPhotoId: winnerPhoto.photoId!,
        ownerId: ownerId!,
        winnerVoterId: winnerVoterId
    };
}


/**
 * Crea operaciones de compra para las fotos de un concurso (exceptuando la foto ganadora)
 * 
 * @param env 
 * @param contestId 
 * @param winnerPhotoId 
 */
export const createBuyOperations = async (env: Bindings, resultContest: ResultContestType): Promise<void> => {
    const db = getConnection(env.DB);
    const otherVotedPhotos = await db.select({
        contestPhotoId: contestPhoto.id,
        photoId: contestPhoto.photoId,
        ownerId: userPhoto.userId,
        price: contestPhoto.salePrice,
        title: userPhoto.title,
        salePrice: contestPhoto.salePrice,
        votes: contestPhoto.votes
    }).from(contestPhoto)
        .innerJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId))
        .where(and(
            eq(contestPhoto.contestId, resultContest.contestId),
            gt(contestPhoto.votes, 0),
            ne(contestPhoto.id, resultContest.winnerContestPhotoId)));
    otherVotedPhotos.forEach(async (votedPhoto) => {
        const totalVotes = votedPhoto.votes!;
        const winningVote = Math.floor(Math.random() * totalVotes);
        const voters = await db.select({
            userId: userVotes.userId,
            votes: userVotes.votes
        }).from(userVotes).where(and(
            eq(userVotes.contestPhotoId, votedPhoto.contestPhotoId),
            eq(userVotes.wantBuy, true)));

        let winnerVoterId = 0;
        let currentVote = 0;
        for (const v of voters) {
            currentVote += v.votes;
            if (currentVote > winningVote) {
                winnerVoterId = v.userId!;
                break;
            }
        }
        if (winnerVoterId === 0) {
            return;
        }
        createOperation(env, {
            userId: winnerVoterId!,
            destinationUserId: votedPhoto.ownerId!,
            contestPhotoId: votedPhoto.contestPhotoId!,
            type: 'buy',
            message: `¿Deseas comprar la foto '${votedPhoto.title}' por: ${votedPhoto.salePrice} €?. Debes tener suficientes fondos en tu cuenta.`,
        });
    });



}


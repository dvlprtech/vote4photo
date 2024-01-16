import { ForwardRequest, SignedForwardRequest } from '@lib/domain/blockchain';
import { getConnection } from "@lib/domain/db-conn";
import { Bindings } from '@lib/domain/env';
import { OperationStatusType, OperationTypeType, contest, contestPhoto, operations, user, userPhoto, userVotes } from "@lib/domain/schema";
import { and, desc, eq, gt, gte, or, sql } from "drizzle-orm";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { Address, Hex } from 'viem';
import { DomainType, getDomain, getMessageSeralizable, getMessageToSignForNFTTransfer, getNonce, sendMetatransaction } from './blockchain-services';
import { SvelteComponent_1 } from 'svelte';

const EXPIRATION_BY_TYPE : Record<OperationTypeType, number> = {
    accept_prize: 7*24*3600*1000,
    notification: 7*24*3600*1000,
    buy: 2*24*3600*1000,
    sell: 7*24*3600*1000,
}

const SIGNATURE_REQUIRED_BY_TYPE : Record<OperationTypeType, boolean> = {
    accept_prize: true,
    sell: true,
    notification: false,
    buy: false
}

type OperationType = typeof operations.$inferSelect;

export type OperationCreationData = {
    userId: number
    destinationUserId?: number,
    destinationAccount?: Address,
    contestPhotoId: number,
    message: string,
    type: OperationTypeType
}

type OperationBasicData = {
    id: number,
    type: OperationTypeType,
    status: OperationStatusType,
    message: string,
    expirationTimestamp?: string | Date,
    executionTimestamp?: string | Date | null,
    rejectionTimestamp?: string | Date | null,
    rejectionReason: string | null,
    photoId: number,
    salePrice: number,
    title: string,
    photoKey: string,
}

type OperationDetailData = {
    id: number,
    userId: number,
    type: OperationTypeType,
    status: OperationStatusType,
    contestPhotoId: number,
    expirationTimestamp?: string | Date,
    executionTimestamp?: string | Date,
    message: string,
    photo?: {
        id: number,
        title: string,
        tokenId: number,
        photoKey: string,
        salePrice: number
    }
}

type DataToSign = {
    messageToSign: ForwardRequest, 
    domain: DomainType
}

export const listOwnOperations = async (c: Context, userId: number) : Promise<OperationBasicData[]> => {
    const db = getConnection(c.env.DB);
    const dateLimit = new Date(Date.now() - 7*24*3600*1000);

    const results = await db.select({
        operationId: sql<number>`(${operations.id} + 0)`,
        type: operations.type,
        status: operations.status,
        message: operations.message,
        expirationTimestamp: operations.expirationTimestamp,
        executionTimestamp: operations.executionTimestamp,
        rejectionTimestamp: operations.rejectionTimestamp,
        rejectionReason: operations.rejectionReason,
        photoId: userPhoto.id,
        salePrice: contestPhoto.salePrice,
        title: userPhoto.title,
        photoKey: userPhoto.photoKey,
    }).from(operations)
    .innerJoin(contestPhoto, eq(contestPhoto.id, operations.contestPhotoId))
    .innerJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId))
    .where(and(
        eq(operations.userId, userId),
        or(
            eq(operations.status, 'pending'),
            and(eq(operations.status, 'executed'), gt(operations.executionTimestamp, dateLimit)),
            and(eq(operations.status, 'rejected'), gt(operations.rejectionTimestamp, dateLimit)),
        )
    )).orderBy(desc(operations.id));
    const ownOperations = results.map<OperationBasicData>(o => {
        const id = o.operationId!;
        delete (o as any)['operationId'];
        return {...o, id};
    });
    // Esto es un workaround por un bug con los doble inner join y drizzle-orm
    // for (const o of ownOperations as OperationBasicData[]) {
    //     const [photo] = await db.select({
    //         salePrice: contestPhoto.salePrice,
    //         photoId: userPhoto.id,
    //         title: userPhoto.title,
    //         photoKey: userPhoto.photoKey
    //     }).from(contestPhoto)
    //     .leftJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId))
    //     .where(eq(contestPhoto.id, o.id));
    //     console.log('photo:', photo);
    //     o.salePrice = photo.salePrice;
    //     o.photoId = photo.photoId!;
    //     o.title = photo.title!;
    //     o.photoKey = photo.photoKey!;    
    // }
    console.log('ownOperations:', ownOperations);
    return ownOperations;
}


export const createOperation = async (env: Bindings, data: OperationCreationData) : Promise<{
    id: number,
    type: OperationTypeType,
    expirationTimestamp: string
}> => {
    const db = getConnection(env.DB);
    //data: Partial<OperationType>
    const expirationTimestamp = new Date(Date.now() + EXPIRATION_BY_TYPE[data.type]);
    const [result] = await db.insert(operations).values({
        ...data,
        status: 'pending',
        expirationTimestamp
    }).returning({
        id: operations.id,
    });
    return {id: result.id, type: data.type, expirationTimestamp: expirationTimestamp.toISOString()};
}

/**
 * Recupera los datos de la operación y de la foto asociada (si existe)
 * 
 * @param c 
 * @param operationId 
 * @param userId 
 * @returns 
 */
export const getOperation = async (c: Context, operationId: number) : Promise<OperationDetailData> => {
    const db = getConnection(c.env.DB);
    
    const [operation] = await db.select({
        id: operations.id,
        type: operations.type,
        status: operations.status,
        contestPhotoId: operations.contestPhotoId,
        executionTimestamp: operations.expirationTimestamp,
        message: operations.message,
        userId: operations.userId,
        expirationTimestamp: operations.expirationTimestamp
    }).from(operations).where(eq(operations.id, operationId)) as OperationDetailData[];
    if (!operation) {
        throw new HTTPException(404, {message: 'Operación no encontrada'});
    }
    const userId = c.get('user').id;
    if (operation.userId !== userId && c.get('role') !== 'admin') {
        throw new HTTPException(503, {message: 'Acceso denegado'});
    }
    const [photo] = await db.select({
        id: userPhoto.id,
        title: userPhoto.title,
        tokenId: userPhoto.tokenId,
        photoKey: userPhoto.photoKey,
        salePrice: contestPhoto.salePrice,
    }).from(userPhoto)
    .innerJoin(contestPhoto, eq(contestPhoto.photoId, userPhoto.id))
    .where(eq(contestPhoto.id, operation.contestPhotoId!))
    operation.photo = photo;
    return operation;
}

export const getDataToSign = async (c: Context, operationId: number) : Promise<DataToSign> => {
    const db = getConnection(c.env.DB);
    const userId = c.get('user').id;
    const [operation] = await db.select().from(operations).where(eq(operations.id, operationId));
    if (operation.userId !== userId) {
        throw new HTTPException(503, {message: 'Acceso denegado'});
    }
    if (!operation) {
        throw new HTTPException(404, {message: 'Operación no encontrada'});
    }
    if (!SIGNATURE_REQUIRED_BY_TYPE[operation.type!]) {
        throw new HTTPException(400, {message: 'Operación incompatible con firma'});
    }

    const [photoData] = await db.select({
        photoKey: userPhoto.photoKey,
        title: userPhoto.title,
        account: userPhoto.account,
        tokenId: userPhoto.tokenId,
    }).from(contestPhoto).innerJoin(userPhoto, eq(userPhoto.id, contestPhoto.photoId))
        .where(eq(contestPhoto.id, operation.contestPhotoId!));
    if (!photoData) {
        console.error('Contest photo not found:', operation.contestPhotoId);
        throw new HTTPException(404, {message: 'Foto no encontrada'});
    }
    const userAccount = c.get('user').account;
    const nonce = await getNonce(c, userAccount);
    const contractAddress = c.env.V4P_CONTRACT;
    if (!operation.destinationAccount) {
        throw new HTTPException(400, {message: 'No se registró cuenta destino para transferencia'});
    }
    const destinationAccount = operation.destinationAccount as Address;
    const rawMessageToSign = await getMessageToSignForNFTTransfer(userAccount, contractAddress, destinationAccount, 
        BigInt(photoData.tokenId), nonce);
    const messageToSign = getMessageSeralizable(rawMessageToSign);
    const domain = await getDomain(c);
    return {messageToSign, domain};
}

export const executeWithSignature = async (c: Context, operationId: number, signedMessage: SignedForwardRequest) : Promise<Partial<OperationType>> => {
    const db = getConnection(c.env.DB);
    const userId = c.get('user').id;
    const [operation] = await db.select().from(operations).where(eq(operations.id, operationId));
    if (!operation) {
        throw new HTTPException(404, {message: 'Operación no encontrada'});
    }
    if (!SIGNATURE_REQUIRED_BY_TYPE[operation.type!]) {
        throw new HTTPException(400, {message: 'Operación incompatible con firma'});
    }
    if (operation.userId !== userId) {
        throw new HTTPException(503, {message: 'Acceso denegado'});
    }
    if (operation.expirationTimestamp && operation.expirationTimestamp.getTime() < Date.now()) {
        throw new HTTPException(400, {message: 'Operación caducada'});
    }
    const [{photoId, salePrice}] = await db.select({
        photoId: contestPhoto.photoId,
        salePrice: contestPhoto.salePrice
    }).from(contestPhoto).where(eq(contestPhoto.id, operation.contestPhotoId!));
    if (!photoId) {
        throw new HTTPException(404, {message: 'Foto no encontrada'});
    }

    if (operation.type === 'accept_prize') {
        // Si el propietario acepta el premio, actualizamos los fondos de su cuenta
        const [{prize}] = await db.select({prize: contest.totalPrize}).from(contest)
                                    .innerJoin(contestPhoto, eq(contestPhoto.contestId, contest.id))
                                    .where(eq(contestPhoto.id, operation.contestPhotoId!));
        await db.update(user).set({
            funds: sql`${user.funds} + ${prize}`
        }).where(eq(user.id, operation.userId!));
    } else if (operation.type === 'sell') {
        // Si el propietario vende la foto, movemos fondos según el precio de venta
        const [{id}] = await db.update(user).set({
            funds: sql`${user.funds} - ${salePrice}`
        }).where(and(eq(user.id, operation.destinationUserId!), 
                gte(user.funds, salePrice!)))
        .returning({id: user.id});
        if (!id) {
            throw new HTTPException(400, {message: `Fondos insuficientes. Se necesitan: ${salePrice} €`});
        }
        await db.update(user).set({
            funds: sql`${user.funds} + ${salePrice}`
        }).where(eq(user.id, operation.userId!));        
    }

    // Enviamos la transacción y esperamos los datos del evento 'Transfer' https://github.com/OpenZeppelin/openzeppelin-contracts/blob/a72c9561b9c200bac87f14ffd43a8c719fd6fa5a/contracts/token/ERC721/IERC721.sol#L15
    const [eventData] = await sendMetatransaction(c, signedMessage, 'transfer');
    const txData ={
        from: (eventData as any).args.from,
        to: (eventData as any).args.to,
        txHash: eventData.transactionHash,
        tokenId: Number((eventData as any).args.tokenId),
    }
    // Actualizamos la operación a 'executed'
    const [executedOperation] = await db.update(operations).set({
        status: 'executed',
        executionTimestamp: sql`CURRENT_TIMESTAMP`        
    }).where(eq(operations.id, operationId)).returning({
        id: operations.id,
        type: operations.type,
        status: operations.status,
        executionTimestamp: operations.executionTimestamp,        
    });
    // Actualizamos la foto con los datos del nuevo propietario
    await db.update(userPhoto).set({
        account: txData.to,
        lastTransferTx: txData.txHash,
        userId: operation.destinationUserId,
        ownerSince: sql`CURRENT_TIMESTAMP`,
    }).where(eq(userPhoto.id, photoId));
    operation.status = executedOperation.status;
    operation.executionTimestamp = executedOperation.executionTimestamp;
    await _prepareNextOperations(c, operation);
    return executedOperation;
}

const _prepareNextOperations = async (c: Context, operation: OperationType) => {
    if(['accept_prize', 'sell', 'buy'].includes(operation.type!)) {
        await _prepareNotificationOperations(c, operation);
        if (operation.type === 'buy') {
            await _prepareSellOperation(c, operation);
        }
    }
}

export const executeOperation = async (c: Context, operationId: number, userId: number) : Promise<{id: number, status: string}> => {
    const db = getConnection(c.env.DB);
    
    const [operation] = await db.select().from(operations).where(eq(operations.id, operationId));
    if (!operation) {
        throw new HTTPException(404, {message: 'Operación no encontrada'});
    }
    if (operation.userId !== userId) {
        throw new HTTPException(503, {message: 'Acceso denegado'});
    }
    if (SIGNATURE_REQUIRED_BY_TYPE[operation.type!]) {
        throw new HTTPException(400, {message: 'Operación requiere firma'});
    }
    if (operation.status !== 'pending') {
        throw new HTTPException(400, {message: 'Operación no puede ejecutarse'});
    }
    if (operation.expirationTimestamp && operation.expirationTimestamp.getTime() < Date.now()) {
        throw new HTTPException(400, {message: 'Operación caducada'});
    }

    const [executedOperation] = await db.update(operations).set({
        status: 'executed',
        executionTimestamp: sql`CURRENT_TIMESTAMP`
    }).where(eq(operations.id, operationId)).returning({status: operations.status, executionTimestamp: operations.executionTimestamp});    
    operation.status = executedOperation.status;
    operation.executionTimestamp = executedOperation.executionTimestamp;
    await _prepareNextOperations(c, operation);
    return {
        id: operationId,
        status: executedOperation.status!
    };
}

export const rejectOperation = async (c: Context, operationId: number, rejectionReason: string, userId: number) : Promise<{id: number, status: string}> => {
    const db = getConnection(c.env.DB);
    
    const [operation] = await db.select().from(operations).where(eq(operations.id, operationId));
    if (!operation) {
        throw new HTTPException(404, {message: 'Operación no encontrada'});
    }
    if (operation.userId !== userId) {
        throw new HTTPException(503, {message: 'Acceso denegado'});
    }
    if (operation.status !== 'pending') {
        throw new HTTPException(400, {message: 'Operación no puede rechazarse'});
    }

    const [execution] = await db.update(operations).set({
        status: 'rejected',
        rejectionTimestamp: sql`CURRENT_TIMESTAMP`,        
        rejectionReason
    }).where(eq(operations.id, operationId)).returning({status: operations.status});    
    prepareActionsForRejectedOperation(c.env, operation);
    return {
        id: operationId,
        status: execution.status!
    };
}

export const prepareActionsForRejectedOperation = async (env: Bindings, operation: OperationType) => {
    if (operation.status === 'rejected' && ['accept_prize', 'sell'].includes(operation.type)) {
        const db = getConnection(env.DB);
        const [photo] = await db.select({
            title: userPhoto.title,
            totalPrize: contest.totalPrize,
            salePrice: contestPhoto.salePrice
        }).from(userPhoto)
        .innerJoin(contestPhoto, eq(contestPhoto.photoId, userPhoto.id))
        .innerJoin(contest, eq(contest.id, contestPhoto.contestId))
        .where(eq(contestPhoto.id, operation.contestPhotoId!));
        let message;
        switch(operation.type) {
            case 'accept_prize':
                await db.update(user).set({
                    remainingVotes: sql`${user.remainingVotes} + ${photo.totalPrize}`
                }).where(eq(userVotes.userId, operation.destinationUserId!));
                message = `El propietario de la foto '${photo.title}' ha rechazado el premio, en su lugar recibiras ${photo.totalPrize} € en los fondos de tu cuenta`;
                break;
            case 'sell':
                const [{votes}] = await db.select({votes: userVotes.votes}).from(userVotes)
                    .where(and(eq(userVotes.userId, operation.destinationUserId!), eq(userVotes.contestPhotoId, operation.contestPhotoId!)));
                await db.update(user).set({
                    remainingVotes: sql`${user.remainingVotes} + ${votes}`
                }).where(eq(userVotes.userId, operation.destinationUserId!));
                message = `Lo sentimos, el propietario de la foto '${photo.title}' ha rechazado la venta, recuperarás los ${votes} voto/s utilizado/s en el concurso`;
                break;
        }
        const opData = {
            userId: operation.destinationUserId!,
            contestPhotoId: operation.contestPhotoId!,
            type: 'notification',
            message
        } as OperationCreationData;
    
        await createOperation(env, opData);
    }
}

async function _prepareNotificationOperations(c: Context, operation: OperationType) {
    if (operation.status === 'executed') {
        const db = getConnection(c.env.DB);
        const [photo] = await db.select({
            title: userPhoto.title,
            tokenId: userPhoto.tokenId,
            salePrice: contestPhoto.salePrice,
            totalPrize: contest.totalPrize,
        }).from(userPhoto)
        .innerJoin(contestPhoto, eq(contestPhoto.photoId, userPhoto.id))
        .innerJoin(contest, eq(contest.id, contestPhoto.contestId))
        .where(eq(contestPhoto.id, operation.contestPhotoId!));
        if (operation.type === 'accept_prize') {
            // Si el propietario acepta el premio, enviamos una notificación al usuario que lo compró
            // para que sepa que ya dispone de la foto en su Wallet y perfil
            await createOperation(c.env, {
                userId: operation.destinationUserId!,
                contestPhotoId: operation.contestPhotoId!,
                type: 'notification',
                message: `Enhorabuena!!! Has conseguido la foto ganadora del concurso '${photo.title}' (Token ID: ${photo.tokenId})`
            });
            // También notificamos al propietario que ya dispone del premio en los fondos en su cuenta
            await createOperation(c.env, {
                userId: operation.userId!,
                contestPhotoId: operation.contestPhotoId!,
                type: 'notification',
                message: `Ya tienes disponible el premio del concurso (${photo.totalPrize} €) en los fondos de tu cuenta!!`
            });            
        } else if (operation.type === 'sell') {
            // Si el propietario vende la foto, enviamos una notificación al usuario que la compró
            // para que sepa que ya dispone de la foto en su Wallet y perfil
            await createOperation(c.env, {
                userId: operation.destinationUserId!,
                contestPhotoId: operation.contestPhotoId!,
                type: 'notification',
                message: `Enhorabuena!!! Has comprado la foto '${photo.title}' (Token ID: ${operation.contestPhotoId}) por ${photo.salePrice} €`
            });
            // También notificamos al propietario que ya ingresamos el dinero de la venta en los fondos en su cuenta
            await createOperation(c.env, {
                userId: operation.userId!,
                contestPhotoId: operation.contestPhotoId!,
                type: 'notification',
                message: `Has vendido la foto '${photo.title}' por ${photo.salePrice} € que ya están disponibles en los fondos de tu cuenta`
            });
        } else if (operation.type === 'buy') {
            // Si el usuario decide comprar la foto le notificamos que la venta está en proceso
            await createOperation(c.env, {
                userId: operation.userId!,
                contestPhotoId: operation.contestPhotoId!,
                type: 'notification',
                message: `Has aceptado la compra de la foto: '${photo.title}' por ${photo.salePrice} €. Recibirás la foto cuando el propietario acepte la venta.`
            });
        }
    }
}
 
async function _prepareSellOperation(c: Context, operation: OperationType) {
    if (operation.type === 'buy' && operation.status === 'executed') {
        const db = getConnection(c.env.DB);
        const [photo] = await db.select({
            userId: userPhoto.userId,
            title: userPhoto.title,
            tokenId: userPhoto.tokenId,
            salePrice: contestPhoto.salePrice
        }).from(userPhoto)
        .innerJoin(contestPhoto, eq(contestPhoto.photoId, userPhoto.id))
        .where(eq(contestPhoto.id, operation.contestPhotoId!));

        // Creamos una operación de venta para que el propietario pueda vender la foto
        await createOperation(c.env, {
            userId: photo.userId!,
            destinationUserId: operation.userId!,
            destinationAccount: c.get('user').account,
            contestPhotoId: operation.contestPhotoId!,
            type: 'sell',
            message: `Tienes una oferta de compra para la foto: '${photo.title}' por ${photo.salePrice} €.`
        });

    }

}
 
import { Buffer } from 'node:buffer';
import { getMimeType } from '@lib/common/mime';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, logVotes, operations, user, userPhoto } from "@lib/domain/schema";
import { desc, eq, lte, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import { BodyData } from "hono/utils/body";
import { DateTime } from "luxon";
import { dateIsoConversor } from '@lib/common/drizzle-utils';
import { Address } from 'viem';

type OperationType = typeof operations.$inferSelect;

type OperationBasicData = {
    id: number
    type: string,
    status: string,
    contestPhotoId: number,
    expirationDate?: string
}

type DataToSign = {
    from: Address,
    to: Address,
    value: number, // always 0
    gas: number
    deadline: number, // Timeout para ejecutar la transacción.
    data: string, // Datos en hexadecimal    
    nonce: number
}

type DataWithSignature = DataToSign & {
    signature: string
}

export const listOwnOperations = async (c: Context, userId: number) : Promise<OperationBasicData[]> => {
    const db = getConnection(c.env.DB);
    
    const result = await db.select({
        id: operations.id,
        type: operations.type,
        contestPhotoId: operations.contestPhotoId,
        status: operations.status,
        expirationDate: sql`${operations.expirationTimestamp}`.mapWith(dateIsoConversor)        
    }).from(operations).where(eq(operations.userId, userId));
    return result.map((r) => ({...r} as OperationBasicData));
}


export const getOperation = async (c: Context, operationId: number, userId: number | null) : Promise<OperationType> => {
    const db = getConnection(c.env.DB);
    
    const result = await db.select(
        // {
        // id: operations.id,
        // userId: operations.userId,        
        // type: operations.type,
        // contestPhotoId: operations.contestPhotoId,
        // expirationTimestamp: operations.expirationTimestamp,
        // executionTimestamp: operations.executionTimestamp,
        // creationTimestamp: operations.creationTimestamp,
        // rejectionReason: operations.rejectionReason,
        // status: operations.status,
        // }
    ).from(operations).where(eq(operations.id, operationId));
    if (result.length === 0) {
        throw new HTTPException(404, {message: 'Operation not found'});
    }
    if (userId !== null && result[0].userId !== userId) {
        throw new HTTPException(503, {message: 'Forbidden'});
    }
    return {...result[0]};
}

export const getDataToSign = async (c: Context, operationId: number, userId: number) : Promise<DataToSign> => {
    const db = getConnection(c.env.DB);
    
    const result = await db.select().from(operations).where(eq(operations.id, operationId));
    if (result.length === 0) {
        throw new HTTPException(404, {message: 'Operation not found'});
    }
    if (result[0].userId !== userId) {
        throw new HTTPException(503, {message: 'Forbidden'});
    }
    const userData = await db.select().from(user).where(eq(user.id, userId));
    const userAccounts = userData[0].accounts as Address[];
    const dataToSign = {
        from: userAccounts[0],
        to: c.env.CONTRACT_ADDRESS,
        value: 0,
        gas: 0,
        deadline: result[0].expirationTimestamp.getTime() - Date.now(),
        data: '0x... something_to_prepare',
        nonce: 0
    } as DataToSign;

    return dataToSign;
}

export const executeWithSignature = async (c: Context, operationId: number, signature: string, userId: number) : Promise<string> => {
    const db = getConnection(c.env.DB);
    
    const result = await db.select().from(operations).where(eq(operations.id, operationId));
    if (result.length === 0) {
        throw new HTTPException(404, {message: 'Operation not found'});
    }
    if (result[0].userId !== userId) {
        throw new HTTPException(503, {message: 'Forbidden'});
    }
    const userData = await db.select().from(user).where(eq(user.id, userId));
    const userAccounts = userData[0].accounts as Address[];
    const signedData = {
        from: userAccounts[0],
        to: c.env.CONTRACT_ADDRESS,
        value: 0,
        gas: 0,
        deadline: result[0].expirationTimestamp.getTime() - Date.now(),
        data: '0x... something_to_prepare',
        nonce: 0,
        signature
    } as DataWithSignature;
    const txId = _executeOperation(signedData);
    return txId;
}

const _executeOperation = (signedData: DataWithSignature) => {
    return 'tx... 0';
}

export const executeOperation = async (c: Context, operationId: number, userId: number) : Promise<{id: number, status: string}> => {
    const db = getConnection(c.env.DB);
    
    const result = await db.select({
        userId: operations.userId,
        status: operations.status,
        expirationTimestamp: operations.expirationTimestamp,
    }).from(operations).where(eq(operations.id, operationId));
    if (result.length === 0) {
        throw new HTTPException(404, {message: 'Operation not found'});
    }
    if (result[0].userId !== userId) {
        throw new HTTPException(503, {message: 'Forbidden'});
    }
    if (result[0].status !== 'pending') {
        throw new HTTPException(400, {message: 'Operación no puede ejecutarse'});
    }
    if (result[0].expirationTimestamp && result[0].expirationTimestamp.getTime() < Date.now()) {
        throw new HTTPException(400, {message: 'Operación caducada'});
    }

    const execution = await db.update(operations).set({
        status: 'executed',
        executionTimestamp: sql`CURRENT_TIMESTAMP`
    }).where(eq(operations.id, operationId)).returning({status: operations.status});    
        
    return {
        id: operationId,
        status: execution[0].status!
    };
}

export const rejectOperation = async (c: Context, operationId: number, rejectionReason: string, userId: number) : Promise<{id: number, status: string}> => {
    const db = getConnection(c.env.DB);
    
    const result = await db.select({
        userId: operations.userId,
        status: operations.status,
        expirationTimestamp: operations.expirationTimestamp,
    }).from(operations).where(eq(operations.id, operationId));
    if (result.length === 0) {
        throw new HTTPException(404, {message: 'Operation not found'});
    }
    if (result[0].userId !== userId) {
        throw new HTTPException(503, {message: 'Forbidden'});
    }
    if (result[0].status !== 'pending') {
        throw new HTTPException(400, {message: 'Operación no puede rechazarse'});
    }

    const execution = await db.update(operations).set({
        status: 'rejected',
        rejectionTimestamp: sql`CURRENT_TIMESTAMP`,        
        rejectionReason
    }).where(eq(operations.id, operationId)).returning({status: operations.status});    
        
    return {
        id: operationId,
        status: execution[0].status!
    };
}

 
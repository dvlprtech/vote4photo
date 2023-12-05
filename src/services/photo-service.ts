import { Buffer } from 'node:buffer';
import { getMimeType } from '@lib/common/mime';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, logVotes, user, userPhoto } from "@lib/domain/schema";
import { desc, eq, gte, isNotNull, lte, ne, sql } from "drizzle-orm";
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

/**
 * 
 * @param c 
 * @param photoKey 
 * @returns 
 */
export const getPhoto = async (c: Context, photoKey: string) : Promise<Response> => {
    const img = await c.env.PHOTO_BUCKET.get(photoKey);
    if (!img) {
        throw new HTTPException(404, {message: 'Foto no existe: ' + photoKey});
    }
    const headers = new Headers();
    img.writeHttpMetadata(headers);
    headers.set('Content-Length', img.size.toString());
    
    return new Response(img.body, {headers});    
}


/**
 * 
 * @param c 
 * @param photoKey 
 * @returns 
 */
export const deleteOrphanPhoto = async (c: Context, photoKey: string) : Promise<{photoKey: string}> => {
    const img = await c.env.PHOTO_BUCKET.head(photoKey);
    if (!img) {
        throw new HTTPException(404, {message: 'Foto no existe: ' + photoKey});
    }
    const db = getConnection(c.env.DB);
    const photoDB = await db.select({existe: sql`true`}).from(userPhoto).where(eq(userPhoto.photoKey, photoKey));
    if (photoDB.length > 0) {
        throw new HTTPException(403, {message: 'Foto no puede ser eliminada'});
    }
    const jsonKey = photoKey.split('.').shift() + '.json';
    await c.env.PHOTO_BUCKET.delete(photoKey);
    await c.env.PHOTO_BUCKET.delete(jsonKey);
    
    return {photoKey};    
}


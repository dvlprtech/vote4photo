import { getUrlBase } from '@lib/common/hono-utils';
import { getMimeType } from '@lib/common/mime';
import { ForwardRequest } from '@lib/domain/blockchain';
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, userPhoto } from "@lib/domain/schema";
import { eq, sql } from "drizzle-orm";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { Buffer } from 'node:buffer';
import { getDomain, getMessageSeralizable, getMessageToSignForNFTCreation, getNonce } from './blockchain-services';


type UserPhotoType = typeof userPhoto.$inferSelect;

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
        return {photoKey: '****'}; // Silent error        
    }
    const db = getConnection(c.env.DB);
    const photoDB = await db.select({existe: sql`true`}).from(userPhoto).where(eq(userPhoto.photoKey, photoKey));
    if (photoDB.length > 0) {        
        return {photoKey: '****'}; // Silent error
    }
    const jsonKey = photoKey.split('.').shift() + '.json';
    await c.env.PHOTO_BUCKET.delete(photoKey);
    await c.env.PHOTO_BUCKET.delete(jsonKey);
    
    return {photoKey};    
}


export const preparePhotoNFT = async (c: Context) : Promise<{
    messageToSign: ForwardRequest,
    photoKey: string,
    domain: object
}> => {
    const body = await c.req.parseBody();
    const title = body['title'] as string;
    const photo = body['photo'] as File;
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
    const messageToSign = getMessageSeralizable(rawMessageToSign);

    return {messageToSign, photoKey: photoKey!, domain: await getDomain(c) };
}

const checkPhotoExists = async (c: Context, photoHash: string) => {
    const db = getConnection(c.env.DB);
    const exists = await db.select({existe: sql`true`}).from(userPhoto).where(eq(userPhoto.md5, photoHash));
    if (exists.length > 0) {
        throw new HTTPException(400, {message: 'La foto ya existe'});
    }
}

const uploadPhotoToBucket = async (c: Context, title: string, photo: File) : Promise<Partial<UserPhotoType>> => {
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

const getMetadataPhoto = async (c: Context, photoId: number, userId: number) : Promise<Partial<UserPhotoType>> => {
    const db = getConnection(c.env.DB);
    const photo = await db.select({
        photoKey: userPhoto.photoKey, 
        title: userPhoto.title,
        md5: userPhoto.md5, 
        size: userPhoto.size,
        userId: userPhoto.userId
    }).from(userPhoto).where(eq(userPhoto.id, photoId));
    if (photo.length === 0) {
        throw new HTTPException(404, {message: 'Foto no encontrada'});
    }
    if (photo[0].userId !== userId) {
        throw new HTTPException(403, {message: 'Foto no pertenece al usuario'});
    }
    return photo[0];
}


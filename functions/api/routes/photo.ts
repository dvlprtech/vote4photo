import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";
import { getJsonBody, verifyAdminUser } from '@lib/common/hono-utils';
import { HTTPException } from 'hono/http-exception';
import { deleteOrphanPhoto, getPhoto, preparePhotoNFT } from '@lib/services/photo-service';
import { BodyData } from 'hono/utils/body';


export const route = new Hono<{ Bindings: Bindings }>();

/**
 * Descarga una foto
 */
route.get('/:photoKey', async (c: Context) => {
  const photoKey = c.req.param('photoKey');  

  return await getPhoto(c, photoKey);
});


/**
 * Sube una foto al repositorio R2 y retorna la key y datos para firmar la transacción
 * que generará el NFT
 */
route.post('/prepare/:photoId?', async (c: Context) => {
  const userId = c.get('user').id;
  const photoId = parseInt(c.req.param('photoId'));

  const dataTosign = await preparePhotoNFT(c, photoId);
  return c.json({...dataTosign});
});

/**
 * Borra una foto si no está en DB
 */
route.delete('/:photoKey', async (c: Context) => {
  const photoKey = c.req.param('photoKey');  

  return c.json(await deleteOrphanPhoto(c, photoKey));
});

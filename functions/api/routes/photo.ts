import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";
import { getJsonBody, verifyAdminUser } from '@lib/common/hono-utils';
import { HTTPException } from 'hono/http-exception';
import { deleteOrphanPhoto, getPhoto } from '@lib/services/photo-service';


export const route = new Hono<{ Bindings: Bindings }>();

/**
 * Descarga una foto
 */
route.get('/:photoKey', async (c: Context) => {
  const photoKey = c.req.param('photoKey');  

  return await getPhoto(c, photoKey);
});

/**
 * Borra una foto si no está en DB
 */
route.delete('/:photoKey', async (c: Context) => {
  const photoKey = c.req.param('photoKey');  

  return c.json(await deleteOrphanPhoto(c, photoKey));
});

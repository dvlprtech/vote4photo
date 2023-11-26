import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";
import { getJsonBody, verifyAdminUser } from '@lib/common/hono-utils';
import { HTTPException } from 'hono/http-exception';
import { createContest } from '@lib/services/contest-service';


export const route = new Hono<{ Bindings: Bindings }>();

route.get('/', (c: Context) => {
    return c.json({
      app: 'Contest API',
      version: VERSION
    })
  });

/**
 * Crea un nuevo concurso
 */
route.post('', async (c: Context) => {
    verifyAdminUser(c);
    const contestData = await getJsonBody(c);

    return c.json(await createContest(c, contestData));
  });
  
  
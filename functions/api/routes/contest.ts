import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";


export const route = new Hono<{ Bindings: Bindings }>();

route.get('/', (c: Context) => {
    throw new Error('Not implemented yet');
    return c.json({
      app: 'Contest API',
      version: VERSION
    })
  })
  
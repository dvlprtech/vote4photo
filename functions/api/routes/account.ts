import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";


export const route = new Hono<{ Bindings: Bindings }>();

route.get('/', (c: Context) => {
    return c.json({
      app: 'Account API',
      version: VERSION
    })
  })
  
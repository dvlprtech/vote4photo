
import { VERSION } from '@lib/common/version'
import { Bindings } from '@lib/domain/env'
import { Context, Hono } from 'hono'

import { SecRequest, globalErrorHandler, requestTimeLog, securityFilter } from '@lib/common/hono-utils'
import { handle } from 'hono/cloudflare-pages'
import { route as accountRoute } from './routes/account'
import { route as configRoute } from './routes/config'
import { route as contestRoute } from './routes/contest'
import { route as operationRoute } from './routes/operation'
import { route as photoRoute } from './routes/photo'


const API_PREFIX = '/api';

const PUBLIC_APIS = [
  ['GET', '/api',],
  ['GET', '/api/photo/*',],
  ['POST', '/api/account/signin',],
  ['POST', '/api/account/signup',],
] as SecRequest[];


const app = new Hono<{ Bindings: Bindings }>().basePath(API_PREFIX);

//app.use('*', compress());

app.use('*', requestTimeLog);
app.use('*', securityFilter({publicPathsPrefix: PUBLIC_APIS}));

app.onError(globalErrorHandler); 


app.get('/', async (c: Context) => {

  return c.json({
    app: 'Vote4Photo',
    version: VERSION
  })
});

app.route(`account`, accountRoute);
app.route(`operation`, operationRoute);
app.route(`contest`, contestRoute);
app.route(`config`, configRoute);
app.route(`photo`, photoRoute);

export const onRequest = handle(app)



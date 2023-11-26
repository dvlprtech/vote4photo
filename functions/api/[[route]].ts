
import { Bindings } from '@lib/domain/env'
import { VERSION } from '@lib/common/version'
import { Context, Hono, Next } from 'hono'
import { compress } from 'hono/compress'

import { handle } from 'hono/cloudflare-pages'
import { route as accountRoute } from './routes/account'
import { route as contestRoute } from './routes/contest'
import { route as operationRoute } from './routes/operation'
import { route as configRoute } from './routes/config'
import { hashPassword, verifyPassword } from '@lib/common/crypto-utils'
import { loadInitData } from '@lib/domain/_local_data'
import { globalErrorHandler, requestTimeLog, securityFilter } from '@lib/common/hono-utils'

const API_PREFIX = '/api';

const PUBLIC_APIS = [
  '/api/account/signin',
  '/api/account/signup',
  '/api/account/validate',
  '/api/config/version',
];


const app = new Hono<{ Bindings: Bindings }>().basePath(API_PREFIX);

//app.use('*', compress());

app.use('*', requestTimeLog);
app.use('*', securityFilter({publicPathsPrefix: PUBLIC_APIS}));

app.onError(globalErrorHandler); 


app.get('/', async (c: Context) => {
  await test(c.env.DB);
  return c.json({
    app: 'Vote6Photo',
    version: VERSION
  })
});

app.route(`account`, accountRoute);
app.route(`operation`, operationRoute);
app.route(`contest`, contestRoute);
app.route(`config`, configRoute);

export const onRequest = handle(app)

async function test(db: D1Database) {
  console.log('\nTEST');
  await loadInitData(db);
}



import { Bindings } from '@lib/domain/env'
import { VERSION } from '@lib/common/version'
import { Context, Hono, Next } from 'hono'
import { compress } from 'hono/compress'

import { handle } from 'hono/cloudflare-pages'
import { route as accountRoute } from './routes/account'
import { route as contestRoute } from './routes/contest'
import { route as operationRoute } from './routes/operation'
import { hashPassword, verifyPassword } from '@lib/common/crypto-utils'

const API_PREFIX = '/api';

const app = new Hono<{ Bindings: Bindings }>().basePath(API_PREFIX);


app.use('*', compress());

app.use('*', async (c: Context, next: Next) => {
  const start = performance.now();
  await next();
  const elapsed = performance.now() - start;
  const elapsedTxt = `${(elapsed*1000).toFixed(0)} µs`;
  c.res.headers.set('x-v4p-response-time', elapsedTxt);
});

app.onError((err, c) => {
  const message = err.message || `${err}`;
  console.error(message)
  return c.json({message}, 500);
})

app.get('/', async (c: Context) => {
  await test();
  return c.json({
    app: 'Vote6Photo',
    version: VERSION
  })
})

app.route(`account`, accountRoute);
app.route(`operation`, operationRoute);
app.route(`contest`, contestRoute);


export const onRequest = handle(app)

async function test() {
  console.log('\nHOLA HOLA');
  const p = 'hola';

  const hp = await hashPassword(p);
  console.log(hp);
  console.log('Is pass ', p, '?', await verifyPassword(p, hp));
}


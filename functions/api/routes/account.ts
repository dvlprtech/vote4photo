import { Bindings } from '@lib/domain/env'
import { VERSION } from "@lib/common/version";
import { Context, Hono } from "hono";
import { HTTPException } from 'hono/http-exception'
import { getJsonBody, verifyUser } from '@lib/common/hono-utils';
import { addFunds, buyVotes, createUser, getProfile, jwtFromCredentials, updateProfile, validateJWT } from '@lib/services/account-service';
import { hash } from '@lib/common/crypto-utils';


export const route = new Hono<{ Bindings: Bindings }>();

route.get('/', (c: Context) => {
  return c.json({ 
    app: 'Account API',
    version: VERSION
  })
})

route.post('/signin', async (c: Context) => {
  const {email, password, chainId, account} = await getJsonBody(c);
  if (!email || !password) {
    throw new HTTPException(400, {message: 'Wrong data'});
  }  
  const token = await jwtFromCredentials(c, email, password, chainId, account);
  return c.json({
    token
  });
});

route.get('/validate', async (c: Context) => {
  
  const token = c.req.query('token') as string;
  const tokenPayload = await validateJWT(c, token);
  return c.json({
    data: tokenPayload
  })
}) 


route.post('/signup', async (c: Context) => {  
  const challengeMinuteDate = `${Math.floor(Date.now()/1000/60)}`;
  const {chainId, account, ...userData} = await getJsonBody(c);

  await _verifyChallenge(c, challengeMinuteDate, userData.email);

  return c.json(await createUser(c, userData, chainId, account));
})

route.post('/funds', async (c: Context) => {  
  const userId = c.get('user').id;
  const { amount } = await getJsonBody(c);
  if (amount <= 0) {
    throw new HTTPException(400, {message: 'Cantidad no válida'});
  }
  return c.json(await addFunds(c, userId, amount))
})

route.post('/buyvotes', async (c: Context) => {  
  const userId = c.get('user').id;
  const { amount } = await getJsonBody(c);
  
  return c.json(await buyVotes(c, userId, Math.floor(amount)))
})

  
route.get('/:userId', async (c: Context) => {  
  const userId = parseInt(c.req.param('userId'));
  verifyUser(c, userId);  

  return c.json(await getProfile(c, userId))
})
  
route.post('/:userId', async (c: Context) => {  
  const userId = parseInt(c.req.param('userId'));
  const profileData = await getJsonBody(c);
  verifyUser(c, userId);  

  return c.json(await updateProfile(c, userId, profileData))
})




async function _verifyChallenge(c: Context, challengeMinuteDate: string, email: string) {
  const __challenge = c.req.header('x-v4p-challenge') || '';  
  if (!__challenge) {
    throw new HTTPException(401, {message: 'Invalid data'});
  }  
  const challenge = await hash(challengeMinuteDate, email);
  if (challenge !== __challenge) {
    throw new HTTPException(401, {message: 'Invalid data'});
  }  
}



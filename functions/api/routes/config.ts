import { VERSION } from "@lib/common/version";
import { getConnection } from '@lib/domain/db-conn';
import { Bindings } from '@lib/domain/env';
import { FEES } from "@lib/domain/params";
import { votesPricing } from '@lib/domain/schema';
import { Context, Hono } from "hono";
import { isAdminUser } from "../../../FRONT/src/lib/store/session-store";
import { HTTPException } from "hono/http-exception";

export const route = new Hono<{ Bindings: Bindings }>();

route.get('/votes_pricing', async (c: Context) => {
  
  const db = getConnection(c.env.DB);
  const vp = await db.select().from(votesPricing).orderBy(votesPricing.numVotes);
  const pricing = vp.map(p => ({amount: p.numVotes, price: p.price*p.numVotes}));
  return c.json({pricing});
});


route.get('/fees', async (c: Context) => {  
  return c.json(FEES);
});

route.get('/urls', async (c: Context) => {  
  const SEPOLIA_ETHERSCAN_URL_BASE = 'https://sepolia.etherscan.io';
  return c.json({
    tx_base: `${SEPOLIA_ETHERSCAN_URL_BASE}/tx`,
    token_base: `${SEPOLIA_ETHERSCAN_URL_BASE}/nft/${c.env.V4P_CONTRACT}`
  });
});

route.get('/_env', async (c: Context) => {  
  if (c.get('user').role !== 'admin') {
    throw new HTTPException(403, {message: 'Not allowed'});
  }
  return c.json(c.env);
});

import { VERSION } from "@lib/common/version";
import { getConnection } from '@lib/domain/db-conn';
import { Bindings } from '@lib/domain/env';
import { FEES } from "@lib/domain/params";
import { votesPricing } from '@lib/domain/schema';
import { Context, Hono } from "hono";

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


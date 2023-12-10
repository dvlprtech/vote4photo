import { getConnection } from "@lib/domain/db-conn";
import { Bindings } from "@lib/domain/env";
import { contest } from "@lib/domain/schema";
import { and, eq, lt, ne } from "drizzle-orm";

type ScheduledEvent = {
    scheduledTime: Date;
    type: string;
    cron: string;
  };


const contestsMonitor = async (env: Bindings) => {
    console.log('---> contestsMonitor');
    const db = getConnection(env.DB);
    const now = new Date(Date.now() + 1000*3600*24*30);
    const noFinishedContests = await db.select().from(contest)
      .where(and(ne(contest.status, 'finished'), lt(contest.endTimestamp, now)));
    if (noFinishedContests.length > 0) {
      console.log('There are unfinished contests!');
      const now = new Date();
      for (const c of noFinishedContests) {
        if (c.endTimestamp < now) {
          console.log(`Contest ${c.title} has ended!`);
          //await db.update(contest).set({ status: 'finished' }).where(eq(contest.id,c.id));
        }
      }
    } else {
      console.log('Nothing to do with contests');
    }
  };

export default {
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: {waitUntil: (promise: Promise<unknown>) => void}) {
        console.log('EVENT: ', event);
        console.log('env: ', env);
      ctx.waitUntil(contestsMonitor(env));
    },
  };
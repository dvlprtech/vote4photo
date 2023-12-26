import { getConnection } from "@lib/domain/db-conn";
import { Bindings } from "@lib/domain/env";
import { contest } from "@lib/domain/schema";
import { and, eq, lt, ne } from "drizzle-orm";

type ScheduledEvent = {
    scheduledTime: Date;
    type: string;
    cron: string;
  };


export default {
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: {waitUntil: (promise: Promise<unknown>) => void}) {
        console.log('EVENT: ', event);
        console.log('env: ', env);
      
    },
  };
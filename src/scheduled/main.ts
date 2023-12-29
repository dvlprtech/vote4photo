import { Bindings } from "@lib/domain/env";
import { expiredContestsChecker, expiredOperationsChecker, initContestsChecker } from "./monitor";

type ScheduledEvent = {
    scheduledTime: Date;
    type: string;
    cron: string;
  };


export default {
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: {waitUntil: (promise: Promise<unknown>) => void}) {
        console.log('EVENT: ', event);
        ctx.waitUntil(initContestsChecker(env));        
        ctx.waitUntil(expiredContestsChecker(env));
        ctx.waitUntil(expiredOperationsChecker(env));
    },
  };
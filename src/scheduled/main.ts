import { Bindings } from "@lib/domain/env";
import { finishedContestsChecker, expiredOperationsChecker, initContestsChecker } from "./monitor";

type ScheduledEvent = {
    scheduledTime: Date;
    type: string;
    cron: string;
  };


export default {
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: {waitUntil: (promise: Promise<unknown>) => void}) {
        console.log('EVENT: ', event.cron, event.type, new Date(event.scheduledTime));
        console.log('ENV: ', env); 
        ctx.waitUntil(initContestsChecker(env));        
        ctx.waitUntil(finishedContestsChecker(env));
        ctx.waitUntil(expiredOperationsChecker(env));
    },
  };
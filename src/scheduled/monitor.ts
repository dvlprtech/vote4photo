import { getConnection } from "@lib/domain/db-conn";
import { Bindings } from "@lib/domain/env";
import { contest, operations } from "@lib/domain/schema";
import { drawPhotoWinner } from "@lib/services/contest-service";
import { prepareActionsForRejectedOperation } from "@lib/services/operation-service";
import { and, eq, lt, ne, sql } from "drizzle-orm";

type ScheduledEvent = {
  scheduledTime: Date;
  type: string;
  cron: string;
};

/**
 * Comprueba si los concursos han finalizado para elegir al ganador y cambiarlos de estado
 * @param env 
 */
export const expiredContestsChecker = async (env: Bindings) => {
  console.log('---> expiredContestsChecker');
  const db = getConnection(env.DB);
  const expiredContests = await db.select().from(contest)
    .where(and(ne(contest.status, 'finished'), lt(contest.endTimestamp, sql`CURRENT_TIMESTAMP`)));
  if (expiredContests.length > 0) {
    console.log(`There are ${expiredContests.length} new finished contests!`);
    for (const c of expiredContests) {
      console.log(`Contest ${c.id} - ${c.title} has ended!`);
      await db.update(contest).set({ status: 'finished' }).where(eq(contest.id, c.id));
      const results = await drawPhotoWinner(env, c.id);
      console.log(`Contest ${c.id} results: {winner photo = ${results?.winnerPhotoId}, winner voter = ${results?.winnerVoterId} }`);
    }
  }
};

/**
 * Comprueba si lso concursos pendientes deben iniciarse, cambiandolos de estado
 * @param env 
 */
export const initContestsChecker = async (env: Bindings) => {
  console.log('---> initContestsChecker');
  const db = getConnection(env.DB);
  const contestsToInit = await db.select().from(contest)
    .where(and(eq(contest.status, 'pending'), lt(contest.initTimestamp, sql`CURRENT_TIMESTAMP`)));
  if (contestsToInit.length > 0) {
    console.log(`There are ${contestsToInit.length} contests ready to init!`);
    for (const c of contestsToInit) {
      await db.update(contest).set({ status: 'active' }).where(eq(contest.id, c.id));
      console.log(`Contest ${c.id} - ${c.title} has been initiated!`);
    }
  } else {
    console.log('<--- No contests to init');
  }
  
};

export const expiredOperationsChecker = async (env: Bindings) => {
  console.log('---> expiredOperationsChecker');
  const db = getConnection(env.DB);
  const expiredOperations = await db.select().from(operations)
    .where(and(ne(operations.status, 'pending'), lt(operations.expirationTimestamp, sql`CURRENT_TIMESTAMP`)));
  if (expiredOperations.length > 0) {
    console.log(`There are ${expiredOperations.length} expired operations!`);
    for (const o of expiredOperations) {
      console.log(`Operation ${o.id} (msg: '${o.message}') has expired!`);
      const [updatedFields] = await db.update(operations).set({
        status: 'rejected',
        rejectionTimestamp: sql`CURRENT_TIMESTAMP`,
        rejectionReason: 'Operación caducada'
      }).where(eq(operations.id, o.id)).returning({        
        status: operations.status,
        rejectionTimestamp: operations.rejectionTimestamp,
        rejectionReason: operations.rejectionReason
      });
      Object.assign(o, updatedFields);
      prepareActionsForRejectedOperation(env, o);
    }
  }
};


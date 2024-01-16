import { getConnection } from "@lib/domain/db-conn";
import { Bindings } from "@lib/domain/env";
import { contest, operations } from "@lib/domain/schema";
import { createBuyOperations, drawPhotoWinner } from "@lib/services/contest-service";
import { prepareActionsForRejectedOperation } from "@lib/services/operation-service";
import { eq, ne, sql } from "drizzle-orm";

/**
 * Comprueba si los concursos han finalizado para elegir al ganador y cambiarlos de estado
 * @param env 
 */
export const finishedContestsChecker = async (env: Bindings) => {
  console.log('---> finishedContestsChecker');
  const db = getConnection(env.DB);
  const notFinishedContests = await db.select().from(contest)
    .where(ne(contest.status, 'finished'));
  const now = new Date();
  const expiredContests = notFinishedContests.filter(c => c.endTimestamp < now);
  if (expiredContests.length > 0) {
    console.log(`There are ${expiredContests.length} new finished contests!`);
    for (const c of expiredContests) {
      console.log(`Contest ${c.id} - ${c.title} has ended!`);
      await db.update(contest).set({ status: 'finished' }).where(eq(contest.id, c.id));
      const results = await drawPhotoWinner(env, c.id);      
      if (results) {
        console.log(`Contest "${c.title}" (ID: ${c.id}) results: {winner photo = ${results.winnerPhotoId}, winner voter = ${results.winnerVoterId} }`);
        await createBuyOperations(env, results);        
      } else {
        console.log(`Contest ${c.id} - ${c.title} had no winner!`);
      }
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
  const pendingContests = await db.select().from(contest).where(eq(contest.status, 'pending'));
  const now = new Date();
  const contestsToInit = pendingContests.filter(c => c.initTimestamp < now);
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
  const pendingOperations = await db.select().from(operations).where(eq(operations.status, 'pending'));
  const now = new Date();
  const expiredOperations = pendingOperations.filter(o => o.expirationTimestamp < now);
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
      await prepareActionsForRejectedOperation(env, o);
    }
  }
};


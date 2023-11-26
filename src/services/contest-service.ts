import { hashPassword, verifyPassword } from "@lib/common/crypto-utils";
import { getConnection } from "@lib/domain/db-conn";
import { contest } from "@lib/domain/schema";
import { desc, eq, lte, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";

type ContestType = typeof contest.$inferSelect;
type ContestCreationDataType = {
    title: string,
    description: string,
    initTimestamp: number,
    duration: number
}

export const createContest = async (c: Context, initialData: ContestCreationDataType) : Promise<Partial<ContestType>> => {
    const db = getConnection(c.env.DB);
    const contestData : Partial<ContestType> = {
        title: initialData.title,
        description: initialData.description,
        initTimestamp: new Date(initialData.initTimestamp),
        endTimestamp: new Date(initialData.initTimestamp + initialData.duration),
        status: 'pending'
    }
    console.log(initialData);
    console.log(contestData);
    const result = await db.insert(contest).values(contestData as ContestType).returning({id: contest.id});
    return {...contestData, ...result[0]};
}

import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";

export const getConnection = (d1Db: D1Database) : DrizzleD1Database => {
    return drizzle(d1Db);
}

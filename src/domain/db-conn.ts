import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";

export const getConnection = (d1Db: D1Database) : DrizzleD1Database => {
    const d = drizzle(d1Db, { logger: true });
    console.log('DB connection: ', d);
    return d;
}



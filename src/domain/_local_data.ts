
import { user, votesPricing } from "./schema";
import { eq, sql } from "drizzle-orm";
import { getConnection } from "./db-conn";

const INIT_DATA = {
    user: [
        {email: "robertosanchez@uoc.edu", password: "dd091e0de37e0b8e818655e5ea126a6e$WdpUdCxjZG0CVglUgZtyQBP8CL2DGtES6Fi8oSb+rNg=", role: "admin", full_name: "Admin"},
        {email: "r@r75.es", password: "dd091e0de37e0b8e818655e5ea126a6e$WdpUdCxjZG0CVglUgZtyQBP8CL2DGtES6Fi8oSb+rNg=", role: "user" , full_name: "Rob"}
    ], 
    votesPricing: [
        {num_votes: 1, price: 0.50},
        {num_votes: 10, price: 0.35},
        {num_votes: 35, price: 0.25},
        {num_votes: 100, price: 0.15},        
    ]
}

export const loadInitData = async (d1Db: D1Database) : Promise<void> => {
    const db = getConnection(d1Db);

    await db.delete(user);
    await db.delete(votesPricing);

    const adminEmail = INIT_DATA.user[0].email;
    const r = await db.select({id: user.id}).from(user).where(eq(user.email, adminEmail));
    if (r.length > 0) {
        console.log('Datos iniciales cargados, admin ID:', r[0].id);
        return;
    }

    await db.insert(user).values(INIT_DATA.user);
    await db.insert(votesPricing).values(INIT_DATA.votesPricing);        

}
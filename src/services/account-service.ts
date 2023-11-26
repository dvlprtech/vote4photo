import { hashPassword, verifyPassword } from "@lib/common/crypto-utils";
import { getConnection } from "@lib/domain/db-conn";
import { user, userPhoto, votesPricing } from "@lib/domain/schema";
import { desc, eq, lte, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import jwt from '@tsndr/cloudflare-worker-jwt'
import { forceExactType } from "@lib/common/utils";

type UserType = typeof user.$inferSelect;

const UPDATABLE_PROFILE_FIELDS = ['email', 'fullName', 'password'];

type UpdatableProfileType = {
    email?: string,
    fullName?: string,
    password?: string
};

export type JwtPayload = {
    email: string, 
    id: number, 
    role: string, 
    fullName: string
}

const TOKEN_DURATION = 14*3600;

export const jwtFromCredentials = async (c: Context, userEmail: string, password: string) : Promise<string> => {
    const db = getConnection(c.env.DB);
    const u = await db.select({password: user.password, id: user.id, role: user.role, fullName: user.fullName}).from(user).where(eq(user.email, userEmail));
    if (u.length === 0) {
      throw new HTTPException(500, {message: 'Invalid credentials'});
    }
    const userPass = u[0].password;
    const isValid = await verifyPassword(password, userPass);
    if (!isValid) {
        throw new HTTPException(500, {message: 'Invalid credentials'});
    }  

    const jwtPayload = {
        id: u[0].id,
        email: userEmail,
        role: u[0].role!,
        fullName: u[0].fullName
    }
    return generateJWT(jwtPayload, c.env.SECRET);
}

const generateJWT = async (payload: JwtPayload, secret: string) : Promise<string> => {
    const token = await jwt.sign({
        ...payload,
        exp: Date.now()/1000 + TOKEN_DURATION // seconds
    }, secret);
    return token;
}


export const validateJWT = async (c: Context, token: string) : Promise<JwtPayload> => {
    try {
        await jwt.verify(token, c.env.SECRET, {throwError: true});
    } catch(err: unknown) {
        console.warn('Invalid token, reason: ' + err);
        throw new HTTPException(401, {message: 'Invalid token'});
    }
    const jwtData = await jwt.decode<JwtPayload>(token);
    return jwtData.payload as JwtPayload;
}

export const getProfile = async (c: Context, userid: number) : Promise<Partial<UserType & {photos: any[]}>> => {
    const db = getConnection(c.env.DB);
    const u = await db.select().from(user).where(eq(user.id, userid));
    if (u.length === 0) {
        throw new HTTPException(404, {message: 'Unknown user'});
    }
    const photos = await db.select({id: userPhoto.id, title: userPhoto.title}).from(userPhoto).where(eq(userPhoto.userId, userid));
    const userProfile : Partial<UserType & {photos: any[]}> = { ...u[0], photos };
    delete userProfile.password; 
    return userProfile;
}

export const createUser = async (c: Context, userData: UserType) : Promise<{id: number, jwt: string}> => {
    const db = getConnection(c.env.DB);

    userData.role = 'user';
    userData.password = await hashPassword(userData.password);

    try {
        const u = await db.insert(user).values(userData).returning({id:user.id});
        const jwtPayload = {
            id: u[0].id,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName
        }
        const jwt = await generateJWT(jwtPayload, c.env.SECRET);
    
        return {id: jwtPayload.id, jwt};
    } catch(err: unknown) {
        console.warn('Error creating user: ' + err);
        throw new HTTPException(500, {message: 'Error creating user'});
    }
}

export const updateProfile = async (c: Context, userid: number, profileData: UpdatableProfileType) : Promise<UpdatableProfileType> => {
    const db = getConnection(c.env.DB);
    
    if (profileData.password) {
        profileData.password = await hashPassword(profileData.password);
    } else {
        delete profileData.password;
    }
    const dataToUpdate = Object.keys(profileData).reduce((acc: UpdatableProfileType, key: string) => {
        if (UPDATABLE_PROFILE_FIELDS.includes(key)) {
            acc[key as keyof UpdatableProfileType] = profileData[key as keyof UpdatableProfileType];
        }
        return acc;
    }, {} as UpdatableProfileType);
    
    console.log(profileData);
    console.log(dataToUpdate);
    
    try {
        await db.update(user).set(dataToUpdate).where(eq(user.id, userid));
        delete dataToUpdate.password;
        return dataToUpdate;
    } catch(err: unknown) {
        console.warn('Error updating user: ' + err);
        throw new HTTPException(500, {message: 'Error updating user'});
    }
}

export const addFunds = async (c: Context<any, any, {}>, userId: number, amount: number): Promise<{funds: number}> => {
    const db = getConnection(c.env.DB);
    const result = await db.update(user).set({funds:sql`funds+${amount}`}).where(eq(user.id, userId)).returning({funds:user.funds});
    return { ...result[0] };
}

const _calculateVotesPrice = async (c: Context<any, any, {}>, amount: number): Promise<number> => {
    if (amount <= 0) {
        throw new HTTPException(400, {message: 'Invalid amount'});
    }
    const db = getConnection(c.env.DB);
    const vp = await db.select({price: votesPricing.price}).from(votesPricing)
        .where(lte(votesPricing.numVotes, amount))
        .orderBy(desc(votesPricing.numVotes)).limit(1);
    const price = vp[0].price*amount;
    return price;
}

export const buyVotes = async (c: Context<any, any, {}>, userId: number, amount: number): Promise<{remainingVotes: number, funds: number}> => {
    const db = getConnection(c.env.DB);
    const price = await _calculateVotesPrice(c, amount);
    const currentUser = await db.select({remainigVotes: user.remainingVotes, funds: user.funds}).from(user).where(eq(user.id, userId));
    if (currentUser[0].funds < price) {
        throw new HTTPException(403, {message: 'Not enough funds. Necessary: ' + price + '€'});
    }
    const votes = currentUser[0].remainigVotes + amount;
    const result = await db.update(user).set({remainingVotes:votes, funds:sql`funds-${price}`}).where(eq(user.id, userId))
        .returning({remainingVotes:user.remainingVotes, funds: user.funds});
    return { ...result[0] };
}
  


import { hashPassword, verifyPassword } from "@lib/common/crypto-utils";
import { getConnection } from "@lib/domain/db-conn";
import { contest, contestPhoto, user, userPhoto, votesPricing } from "@lib/domain/schema";
import { and, desc, eq, lte, ne, sql } from "drizzle-orm";
import { Context } from "hono"
import { HTTPException } from "hono/http-exception";
import jwt from '@tsndr/cloudflare-worker-jwt'
import { Account, Address } from "viem";
import { assertValidChain } from "./blockchain-services";

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
    fullName: string,
    chainId: number,
    account: Address
}

const TOKEN_DURATION = 14*3600;

export const jwtFromCredentials = async (c: Context, userEmail: string, password: string, chainId:number, account: Address) : Promise<string> => {
    assertValidChain(c, chainId);
    const db = getConnection(c.env.DB);
    const u = await db.select({password: user.password, id: user.id, role: user.role, fullName: user.fullName}).from(user).where(eq(user.email, userEmail));
    if (u.length === 0) {
      throw new HTTPException(500, {message: 'Credenciales no válidas'});
    }
    const userPass = u[0].password;
    const isValid = await verifyPassword(password, userPass);
    if (!isValid) {
        throw new HTTPException(500, {message: 'Credenciales no válidas'});
    }  

    const jwtPayload = {
        id: u[0].id,
        email: userEmail,
        role: u[0].role!,
        fullName: u[0].fullName,
        chainId, 
        account: account.toLowerCase() as Address
    } as JwtPayload;
    return generateJWT(jwtPayload, c.env.SECRET);
}

const generateJWT = async (payload: JwtPayload, secret: string) : Promise<string> => {
    const token = await jwt.sign({
        ...payload,
        exp: Date.now()/1000 + TOKEN_DURATION // seconds
    }, secret);
    return token;
}

export const validateAccount = async (c: Context, chainId: number, account: Account) : Promise<void> => {

}

export const validateJWT = async (c: Context, token: string) : Promise<JwtPayload> => {
    try {
        await jwt.verify(token, c.env.SECRET, {throwError: true});
    } catch(err: unknown) {
        console.warn('Invalid token, reason: ' + err);
        throw new HTTPException(401, {message: 'Token no válido'});
    }
    const jwtData = await jwt.decode<JwtPayload>(token);
    return jwtData.payload as JwtPayload;
}

export const getProfile = async (c: Context, userid: number) : Promise<Partial<UserType & {photos: any[]}>> => {
    const db = getConnection(c.env.DB);
    const u = await db.select({
        id: user.id, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role, 
        remainingVotes: user.remainingVotes, 
        funds: user.funds
    }).from(user).where(eq(user.id, userid));
    if (u.length === 0) {
        throw new HTTPException(404, {message: 'Usuario desconocido'});
    }
    const ct = db.$with('ct').as(db.select({
                photoId: contestPhoto.photoId,
                id: contest.id,
                title: contest.title,                
            }).from(contest).innerJoin(contestPhoto, eq(contestPhoto.contestId, contest.id))
                .where(ne(contest.status, 'finished')));

    const photos = await db.with(ct).select({
        id: userPhoto.id, 
        title: userPhoto.title,
        photoKey: userPhoto.photoKey,
        size: userPhoto.size,
        ownerSince: userPhoto.ownerSince,
        account: userPhoto.account,
        tokenId: userPhoto.tokenId,
        mintTx: userPhoto.mintTx,
        lastTransferTx: userPhoto.lastTransferTx,
        currentContestId: sql`${ct.id}`.as('currentContestId'),
        currentContestTitle: sql`${ct.title}`.as('currentContestTitle'),
    }).from(userPhoto)
        .leftJoin(ct, eq(ct.photoId, userPhoto.id))
    .where(eq(userPhoto.userId, userid))
    .orderBy(desc(userPhoto.ownerSince));
    const userProfile : Partial<UserType & {photos: any[]}> = { ...u[0], photos };
    
    return userProfile;
}

export const createUser = async (c: Context, userData: UserType, chainId:number, account: Address) : Promise<{id: number, jwt: string}> => {
    assertValidChain(c, chainId);
    
    const db = getConnection(c.env.DB);

    userData.role = 'user';
    userData.password = await hashPassword(userData.password);

    try {
        const u = await db.insert(user).values(userData).returning({id:user.id});
        const jwtPayload = {
            id: u[0].id,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName,
            chainId, 
            account: account.toLowerCase() as Address
        }
        const jwt = await generateJWT(jwtPayload, c.env.SECRET);
    
        return {id: jwtPayload.id, jwt};
    } catch(err: unknown) {
        console.warn('Error creating user: ' + err);
        throw new HTTPException(500, {message: 'Error creando el usuario'});
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
        throw new HTTPException(500, {message: 'Error actualizando el usuario'});
    }
}

export const addFunds = async (c: Context<any, any, {}>, userId: number, amount: number): Promise<{funds: number}> => {
    const db = getConnection(c.env.DB);
    const result = await db.update(user).set({funds:sql`funds+${amount}`}).where(eq(user.id, userId)).returning({funds:user.funds});
    return { ...result[0] };
}

const _calculateVotesPrice = async (c: Context<any, any, {}>, amount: number): Promise<number> => {
    if (amount <= 0) {
        throw new HTTPException(400, {message: 'Número de votos no válido'});
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
        throw new HTTPException(403, {message: `No hay suficientes fondos. Es necesario: ${price} €`});
    }
    const votes = currentUser[0].remainigVotes + amount;
    const result = await db.update(user).set({remainingVotes:votes, funds:sql`funds-${price}`}).where(eq(user.id, userId))
        .returning({remainingVotes:user.remainingVotes, funds: user.funds});
    return { ...result[0] };
}
  
/**
 * 
 * @param c Comprueba si hay fondos suficcientes apra el cargo a realizar y lo realiza
 * @param charge 
 * @returns Los fondos restantes
 */
export const checkAndUseFunds = async (c: Context, charge: number): Promise<{funds: number}> => {
    const db = getConnection(c.env.DB);
    const userId = c.get('user').id;
    const [currentUser] = await db.select({remainigVotes: user.remainingVotes, funds: user.funds}).from(user).where(eq(user.id, userId));
    if (currentUser.funds < charge) {
        throw new HTTPException(403, {message: `No hay suficientes fondos. Es necesario: ${charge} €`});
    }
    
    const [newFunds] = await db.update(user).set({funds:sql`funds-${charge}`}).where(eq(user.id, userId))
        .returning({funds: user.funds});
    return { ...newFunds };
}
  


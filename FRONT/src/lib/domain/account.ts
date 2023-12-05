import type { Address, Hex } from "viem";

type ContestStatus = 'active' | 'pending' | 'finished';

type UserRoles = 'user' | 'admin';


export interface UserPhotoData {
    id: number;
    photoKey: string,
    title: string,
    size: number,
    tokenId: number,
    ownerSince: string,
    account: Address,
    mintTx: Hex,
    lastTransferTx: Hex  
}

export interface AccountData {
    id: number;
    email: string;
    role: UserRoles;
    fullName: string;
    remainingVotes: number,
    funds: number,  
    photos: UserPhotoData[];
}


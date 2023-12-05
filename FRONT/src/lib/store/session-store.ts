export const ssr = false;
export const prerender = false;

import { writable, derived } from "svelte/store";
import type { Account } from "viem";
import { persistent } from "./persistent";


export type JwtPayload = {
    email: string, 
    id: number, 
    role: string, 
    fullName: string,
    chainId: number,
    account: Account
}

export const currentToken = persistent<string | null>('token', null);
export const session = writable<JwtPayload | undefined>();
export const isAuthenticated = derived(session, ($session?: JwtPayload) => !!$session);
export const currentAccount = derived(session, ($session?: JwtPayload) => $session?.account);
export const userRole = derived(session, ($session?: JwtPayload) => !!$session?.role);
export const isAdminUser = derived(session, ($session?: JwtPayload) => $session?.role === 'admin');

export const userFullname = derived(session, ($session?: JwtPayload) => !!$session?.fullName);
export const userId = derived(session, ($session?: JwtPayload) => $session?.id);

const saveToken = (_token: string | null) => {
    if (!_token) {
        session.set(undefined);
    } else {
        const sessionData = JSON.parse(atob(_token.split('.')[1]));
        session.set(sessionData);
    }
}
currentToken.subscribe(saveToken);

export const clearSessionData = () => {
    currentToken.set(null);
}



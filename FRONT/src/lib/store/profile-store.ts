export const ssr = false;
export const prerender = false;

import { writable, derived, get } from "svelte/store";
import type { Account, Address } from "viem";
import { persistent } from "./persistent";
import type { AccountData } from "$lib/domain/account";
import { fetchProxy } from "$lib/utils/fetch-utils";
import { userId } from "./session-store";


export const loadProfile = async () : Promise<AccountData> => {
	const rp = await fetchProxy(`/api/account/${get(userId)}`);
    if (rp.status === 200) {
        const profile= await rp.json() as AccountData;
        userProfile.set(profile);
        return profile;
    }
    throw new Error('No profile loaded');
}

export const userProfile = writable<AccountData | undefined>();


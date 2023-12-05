export const ssr = false;
import type { PageLoad } from './$types';
import type { ContestDetail } from '$lib/domain/contests';
import { fetchProxy } from '$lib/utils/fetch-utils';
import type { AccountData } from '$lib/domain/account';
import { get } from 'svelte/store';
import { userId } from '$lib/store/session-store';


export const load: PageLoad = async ({ params }) => {
    const accountId =get(userId);
    if (accountId) {
        const r = await fetchProxy(`/api/account/${accountId}`);
        if (r.status === 200) {
            const profile= await r.json() as AccountData;
            return {profile};
        }
    }
    return {
	};
};
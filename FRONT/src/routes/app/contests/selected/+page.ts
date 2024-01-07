//import type { PageLoad } from './$types';
import type { ContestDetail } from '$lib/domain/contests';
import { fetchProxy } from '$lib/utils/fetch-utils';
import { get } from 'svelte/store';
import { currentContest } from '$lib/store/contest-store';
import { goto } from '$app/navigation';

export type FeesType = {
    CONTEST: number;
    CONTEST_NEW_PHOTO: number;
}

export const load = async ({  }) => {
	const contestId = get(currentContest);
    console.log('contestId', contestId);
    if (!contestId) {
        goto('/app/contests');
        return;
    }
        
    let contestData: ContestDetail = {} as ContestDetail;
    let fees = {} as FeesType;
    const r = await fetchProxy(`/api/contest/${contestId}`);
    if (r.status === 200) {
        contestData = await r.json();
    }
    const rf = await fetchProxy(`/api/config/fees`);
    if (rf.status === 200) {
        fees = await rf.json();
    }
	return {
    	contestData, fees
	};
};
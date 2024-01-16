//import type { PageLoad } from './$types';
import type { ContestDetail, FeesType } from '$lib/domain/contests';
import { fetchProxy } from '$lib/utils/fetch-utils';
import { get } from 'svelte/store';
import { currentContestId } from '$lib/store/contest-store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const load = async ({  }) => {
	const contestId = get(currentContestId);
    console.log('contestId', contestId);
    if (!contestId) {
        browser && goto('/app/contests');
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
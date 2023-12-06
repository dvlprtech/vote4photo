import type { PageLoad } from './$types';
import type { ContestDetail } from '$lib/domain/contests';
import { fetchProxy } from '$lib/utils/fetch-utils';


export type FeesType = {
    CONTEST: number;
    CONTEST_NEW_PHOTO: number;
}

export const load: PageLoad = async ({ params }) => {
	const {contestId} = params;

    let contestData: ContestDetail = {} as ContestDetail;
    let fees = {} as FeesType;
    const r = await fetchProxy(`/api/contest/${contestId}`);
    if (r.status === 200) {
        contestData = await r.json();
    }
    const rf = await fetchProxy(`/api/config/fees`);
    if (rf.status === 200) {
        fees = await r.json();
    }
	return {
    	contestData, fees
	};
};
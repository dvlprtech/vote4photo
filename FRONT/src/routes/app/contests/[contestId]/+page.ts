import type { PageLoad } from './$types';
import type { ContestDetail } from '$lib/domain/contests';
import { fetchProxy } from '$lib/utils/fetch-utils';


export const load: PageLoad = async ({ params }) => {
	const {contestId} = params;

    let contestData: ContestDetail = {} as ContestDetail;
    const r = await fetchProxy(`/api/contest/${contestId}`);
    if (r.status === 200) {
        contestData = await r.json();
    }
	return {
    	contestData,
	};
};
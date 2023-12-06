export const ssr = false;
import type { PageLoad } from './$types';
import type { ContestDetail } from '$lib/domain/contests';
import { fetchProxy } from '$lib/utils/fetch-utils';
import type { AccountData } from '$lib/domain/account';
import { get } from 'svelte/store';
import { userId } from '$lib/store/session-store';


type VotePackPrice = {amount: number, price: number};
type SelectOpt = {value: number | string, name: string};
type PageParams = {profile: AccountData, votesPricing: VotePackPrice[], priceList: SelectOpt[]};
export const load = async ({ params }: Parameters<PageLoad>[0]) : Promise<PageParams> => {
    const accountId =get(userId);
    if (accountId) {
        const data = {} as PageParams;
        const rp = await fetchProxy(`/api/account/${accountId}`);
        if (rp.status === 200) {
            const profile= await rp.json() as AccountData;
            data.profile = profile;
        }
        const rv = await fetchProxy(`/api/config/votes_pricing`);
        if (rv.status === 200) {
            const votesPricing = (await rv.json()).pricing as VotePackPrice[];
            votesPricing.sort((a, b) => a.amount - b.amount);
            const priceList = votesPricing.map(vp => <SelectOpt>{value: vp.amount, name: `${vp.amount} => ${vp.price} €`});            
            data.priceList = priceList;
            data.votesPricing = votesPricing;
        }
        return { ...data };
    }
    throw new Error('No user id');
};
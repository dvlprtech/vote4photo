import type { OperationBasicData } from "$lib/domain/operations";
import { fetchProxy } from "$lib/utils/fetch-utils";
import { derived, writable } from "svelte/store";

export const refreshOperations = async () => {
    const data = await fetchProxy('/api/operation');
    if (data.status == 200) {        
        ownOperations.set(await data.json());
    }
}

export const ownOperations = writable([] as OperationBasicData[]);

// derived(session, ($session?: JwtPayload) => !!$session?.role);
export const pendingOperations = derived(ownOperations, ($ownOperations: OperationBasicData[]) => {
    return $ownOperations.filter(o => o.status === 'pending');
});

export const rejectedOperations = derived(ownOperations, ($ownOperations: OperationBasicData[]) => {
    return $ownOperations.filter(o => o.status === 'rejected');
});

export const executedOperations = derived(ownOperations, ($ownOperations: OperationBasicData[]) => {
    return $ownOperations.filter(o => o.status === 'executed');
});



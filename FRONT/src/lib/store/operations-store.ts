import type { OperationBasicData } from "$lib/domain/operations";
import { fetchProxy } from "$lib/utils/fetch-utils";
import { derived, writable } from "svelte/store";

export const refreshOperations = async () => {
    const data = await fetchProxy('/api/operation');
    if (data.status == 200) {        
        ownOperations.set(await data.json());
    }
}

const DUMMY_DATA = [{
    id: 1,
    title: 'Foto de prueba 1',
    salePrice: 10,
    type: 'accept_prize',
    message: 'Has ganado el concurso "Concurso de prueba"',
    expirationTimestamp: '2021-03-01T20:30:00.000Z',
    status: 'pending'
}, {
    id: 2,
    salePrice: 1000,
    title: 'Foto de prueba 2',
    type: 'buy',
    message: 'Has comprado la foto "Foto de prueba"',
    expirationTimestamp: '2021-04-01T10:30:00.000Z',
    status: 'pending'
  }, {
    id: 3,
    salePrice: 1400,
    title: 'Foto de prueba 3',
    type: 'sell',
    message: 'Has vendido la foto "Foto de prueba"',
    expirationTimestamp: '2021-06-01T21:35:00.000Z',
    status: 'pending'
}, {
    id: 4,
    salePrice: 1001,
    title: 'Foto de prueba 4',
    type: 'notification',
    message: 'Has recibido una notificación',
    expirationTimestamp: '2021-05-01T22:15:10.000Z',
    status: 'pending'
}, {
    id: 5,
    salePrice: 1001,
    title: 'Foto de prueba 4',
    type: 'notification',
    message: 'Has recibido una notificación',
    executionTimestamp: '2021-05-01T22:15:10.000Z',
    status: 'executed'
}, {
    id: 5,
    salePrice: 1001,
    title: 'Foto de prueba 4',
    type: 'buy',
    message: 'Aceptada la compra de la foto "Foto de prueba"',
    executionTimestamp: '2021-03-01T22:15:10.000Z',
    status: 'executed'
}, {
    id: 6,
    salePrice: 1001,
    title: 'Foto de prueba 4',
    type: 'sell',
    message: 'Acepta la venta de la foto "Foto de prueba"',
    rejectionTimestamp: '2021-03-01T02:15:10.000Z',
    rejectionReason: 'Cambio de idea',
    status: 'rejected'
}, {
    id: 7,
    salePrice: 1001,
    title: 'Foto de prueba 4',
    type: 'accept_prize',
    message: 'Acepta el premio del concurso',
    rejectionTimestamp: '2021-02-01T12:15:10.000Z',
    rejectionReason: 'Operación caducada',
    status: 'rejected'
  }] as OperationBasicData[];

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



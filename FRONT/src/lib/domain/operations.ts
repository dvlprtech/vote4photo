export type OperationTypeType = 'accept_prize' | 'notification' | 'buy' | 'sell';
export type OperationStatusType = 'pending' | 'rejected' | 'executed';

export type OperationBasicData = {
    id: number,
    type: OperationTypeType,
    status: OperationStatusType,
    message: string,
    expirationTimestamp?: string | Date,
    executionTimestamp?: string | Date,
    rejectionTimestamp?: string | Date,
    rejectionReason?: string,
    photoId: number,
    salePrice: number,
    title: string,
    photoKey: string,
}

export const isSignatureRequired = (operation: OperationTypeType) => {
    return operation === 'accept_prize' || operation === 'sell';
}
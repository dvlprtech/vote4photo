
type ContestStatus = 'active' | 'pending' | 'finished';

export interface ContestBase {
    id: number;
    title: string;
    description: string;
    initTimestamp: string;
    endTimestamp: string;
    winnerPhotoId?: number;
    status: ContestStatus;
}

export interface ContestPhoto {
    contestPhotoId: number;
    photoId: number;
    title: string;
    userId: number;
    photoKey: string;
    price: number;
    winner: boolean | number;
    ownVotes: number;
}

export interface ContestListing extends ContestBase {
    winnerPhotoKey?: string;
    winnerPhotoTitle?: string;
    totalPhotos: number;
}

export interface ContestDetail extends ContestBase {
    photos: ContestPhoto[];
    totalPrize?: number
}

export const getStatusName = (status: ContestStatus) => {
    switch (status) {
        case 'active': return 'Activo';
        case 'finished': return 'Finalizado';
        case 'pending': return 'Pendiente';
    }
}

export const getStatusColor = (status: ContestStatus) => {
    switch (status) {
        case 'active': return 'green';
        case 'finished': return 'gray';
        case 'pending': return 'blue';
    }
}

export type FeesType = {
    CONTEST: number;
    CONTEST_NEW_PHOTO: number;
}

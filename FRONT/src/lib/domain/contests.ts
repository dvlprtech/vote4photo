
type ContestStatus = 'active' | 'pending' | 'finished';

export interface ContestBase {
    id: number;
    title: string;
    description: string;
    initTimestamp: string;
    endTimestamp: string;
    status: ContestStatus;
}

export interface ContestPhoto {
    contestPhotoId: number;
    photoId: number;
    title: string;
    userId: number;
    photoKey: string;
    price: number;
    ownVotes: number;
}

export interface ContestListing extends ContestBase {
    totalPhotos: number;
}

export interface ContestDetail extends ContestBase {
    photos: ContestPhoto[];
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

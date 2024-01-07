import { persistent } from "./persistent";


export const currentContest = persistent<number | null>('contestId', null);
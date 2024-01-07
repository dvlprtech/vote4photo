import { persistent } from "./persistent";


export const currentContestId = persistent<number | null>('contestId', null);
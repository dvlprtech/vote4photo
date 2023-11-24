import { writable } from "svelte/store";

export type ConfigData = {
    squareSize: number;
}

export const config = writable({squareSize: 60} as ConfigData);


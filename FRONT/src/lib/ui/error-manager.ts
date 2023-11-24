import { writable } from "svelte/store"

export type ErrorData = {
    message: string;
    delay?: number;
}

export const errorMessage = writable<ErrorData | null>(null);
export const showError = (errMsg: string | ErrorData) => {
    const errData = typeof errMsg === 'string' ? { message: errMsg } : errMsg;
    errorMessage.set(errData);
}

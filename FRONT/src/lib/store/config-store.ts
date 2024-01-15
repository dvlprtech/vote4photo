import { get, writable } from "svelte/store";

export type ConfigUrls = {
    tx_base: string;
    token_base: string;
}

export const urls = writable({
    tx_base: 'https://sepolia.etherscan.io/tx',
    token_base: ''
} as ConfigUrls);

const getConfig = async () => {
    const rv = await fetch('/api/config/urls');
    if (rv.status === 200) {
        urls.set(await rv.json());
    }
}

export const getTokenUrl = (tokenId: number) => {
    return `${get(urls).token_base}/${tokenId}`;
}

export const getTxUrl = (tx: string) => {    
    return `${get(urls).tx_base}/${tx}`;
}

getConfig().catch(console.error);


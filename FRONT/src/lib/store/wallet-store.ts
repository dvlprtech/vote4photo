import { showError } from "$lib/ui/error-manager";
import { connectWallet, getChain } from "$lib/utils/wallet-utils";
import { writable, get } from "svelte/store";
import { publicActions, type Account, type Address, type WalletClient, type PublicClient, createPublicClient, http, type EIP1193Provider, isAddressEqual, type Chain } from "viem";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const wallet = writable<WalletClient>();
export const chain = writable<Chain | undefined>();

export const walletAccount = writable<Address | undefined>();

export const ethereum : EIP1193Provider | undefined = (window as any).ethereum;

const _accountChangedHandler = (accounts: Address[]) => {
    if (!isAddressEqual(accounts[0], get(walletAccount) || ZERO_ADDRESS)) {
        console.log('Account has changed to: ', accounts[0]);
        walletAccount.set(accounts[0]);
    }
}

const _chainChangedHandler = (chainId: `0x{string}`) => {
    console.log(new Date(), 'Chain has changed to: ', chainId);
    // Si la red cambie debemos actualizar el wallet tb, si no apunta a la red original
    wallet.set(connectWallet(chainId));
    chain.set(getChain(chainId));

    console.log(new Date(), 'Chain Name: ', get(wallet).chain?.name);
}

wallet.subscribe(connectedWallet => {
    ethereum?.removeListener('chainChanged', _chainChangedHandler);
    if (connectedWallet) {
        chain.set(getChain(get(wallet).chain?.id));
        ethereum?.on('chainChanged', _chainChangedHandler);
    }    
});


walletAccount.subscribe(newAccount => {
    ethereum?.removeListener('accountsChanged', _accountChangedHandler);
    if (newAccount) {
        ethereum?.on('accountsChanged', _accountChangedHandler);
    }
});

export const firstConnect = async () => {
    if (!(window as any).ethereum) {
        showError('No se encontró una "Wallet" instalada en el navegador.');
        return;
    }
    console.log('Ether?', (window as any).ethereum);
    console.log('firstConnect...')
    const client = connectWallet();
    const validChain = getChain(await client.getChainId());
    console.log('chain:', validChain);
    if (!chain) {
        throw new Error('Chain not supported');
    }
    console.log('wallet chain::', validChain?.name);
    wallet.set(client);
    chain.set(validChain);

    const allWalletAccounts = await client.requestAddresses();
    console.log('Account:', allWalletAccounts[0]);
    walletAccount.set(allWalletAccounts[0]);
}

export const ensureWallet = async () => {
    const w = get(wallet);
    if (!w) {
        await firstConnect();
    }
    return get(wallet);
}

// window.ethereum.on('accountsChanged', function (accounts) {
//     // Time to reload your interface with accounts[0]!
// })

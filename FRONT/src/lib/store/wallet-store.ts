import { connectWallet } from "$lib/utils/wallet-utils";
import { writable, get } from "svelte/store";
import { publicActions, type Account, type Address, type WalletClient, type PublicClient, createPublicClient, http, type EIP1193Provider, isAddressEqual } from "viem";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const wallet = writable<WalletClient>();

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
    wallet.set(connectWallet(chainId));
    console.log(new Date(), 'Chain Name: ', get(wallet).chain?.name);
}

wallet.subscribe(connectedWallet => {
    ethereum?.removeListener('chainChanged', _chainChangedHandler);
    if (connectedWallet) {
        ethereum?.on('chainChanged', _chainChangedHandler);
    }    
});


walletAccount.subscribe(newAccount => {
    ethereum?.removeListener('accountsChanged', _accountChangedHandler);
    if (newAccount) {
        ethereum?.on('accountsChanged', _accountChangedHandler);
    }
});



// window.ethereum.on('accountsChanged', function (accounts) {
//     // Time to reload your interface with accounts[0]!
// })


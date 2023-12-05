import { TYPES, type ForwardRequest } from "$lib/domain/blockchain";
import { ensureWallet, wallet, walletAccount } from "$lib/store/wallet-store";
import { get } from "svelte/store";
import { createWalletClient, custom, type Account, type WalletClient, type Address, getChainContractAddress, type Chain, hexToNumber } from "viem";
import { hardhat, sepolia } from "viem/chains";

export const ALLOWED_CHAINS = [hardhat, sepolia];

export const getChain = (chainId: `0x{string}` | number | undefined) : Chain | undefined => {
    if (!chainId) {
        return undefined;
    }
    const numChainId = (typeof chainId === 'string') ? hexToNumber(chainId) : chainId;
    return ALLOWED_CHAINS.find(c => c.id === numChainId);
}

export const existsWallet = () => !!(window as any).ethereum;

export const connectWallet = (chainId?: `0x{string}`) : WalletClient => {
    const client = createWalletClient({
      //chain: chainId ? getChain(chainId) : sepolia,
       transport: custom((window as any).ethereum)
  });	
  return client;
}

export const getWalletAccount = async (wallet: WalletClient) : Promise<Address | undefined> => {
    const walletAddresses = await wallet.requestAddresses();
    return walletAddresses[0];
}

export const signMessageWithWallet = async (message: ForwardRequest, domain: object) : Promise<string> => {
    const msgReal = {...message, 
        value: BigInt(message.value),
        gas: BigInt(message.gas),
        nonce: message.nonce && BigInt(message.nonce),
    } as const;
    console.log('Message to be signed: ', msgReal );
    const signer = await ensureWallet();
    const signature = await signer.signTypedData({
        account: get(walletAccount)!,
        message: msgReal,
        types: {ForwardRequest: TYPES.ForwardRequest},
        primaryType: "ForwardRequest",
        domain: {...domain} as const,      
      });
    return signature;
}
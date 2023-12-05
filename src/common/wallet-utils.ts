import { createWalletClient, custom, type Account, type WalletClient, type Address, getChainContractAddress, type Chain, hexToNumber, createPublicClient, http, encodeFunctionData } from "viem";
import { hardhat, sepolia } from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts'

export const ALLOWED_CHAINS = [hardhat, sepolia];

export const getChain = (chainId: `0x{string}` | number |undefined) : Chain | undefined => {
    if (!chainId) {
        return undefined;
    }
    let numChainId = (typeof chainId === 'string') ? hexToNumber(chainId) : chainId;
    console.log('numChainId:', numChainId);
    console.log('ALLOWED_CHAINS:', ALLOWED_CHAINS.map(c => c.id));
    return ALLOWED_CHAINS.find(c => c.id === numChainId);
}

export const connectEtherNetwork = (chainId: `0x{string}` | number, account: Account) : WalletClient => {
    const client = createWalletClient({
        chain: getChain(chainId),
        account,        
        transport: http()
    });

    return client;
}

export const getWalletAccount = async (wallet: WalletClient) : Promise<Address | undefined> => {
    const walletAddresses = await wallet.requestAddresses();
    return walletAddresses[0];
}



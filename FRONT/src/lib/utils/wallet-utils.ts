import { createWalletClient, custom, type Account, type WalletClient, type Address, getChainContractAddress, type Chain, hexToNumber } from "viem";
import { hardhat, sepolia } from "viem/chains";

export const ALLOWED_CHAINS = [hardhat, sepolia];

export const getChain = (chainId: `0x{string}`) : Chain | undefined => {
    const numChainId = hexToNumber(chainId);
    return ALLOWED_CHAINS.find(c => c.id === numChainId);
}

export const existsWallet = () => !!(window as any).ethereum;

export const connectWallet = (chainId?: `0x{string}`) : WalletClient => {
    const client = createWalletClient({
      chain: chainId ? getChain(chainId) : sepolia,
       transport: custom((window as any).ethereum)
  });	
  return client;
}

export const getWalletAccount = async (wallet: WalletClient) : Promise<Address | undefined> => {
    const walletAddresses = await wallet.requestAddresses();
    return walletAddresses[0];
}


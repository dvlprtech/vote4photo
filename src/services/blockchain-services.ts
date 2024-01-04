import { Account, createPublicClient, getContract, http } from 'viem'
import { connectEtherNetwork, getChain } from "@lib/common/wallet-utils";
import { ForwardRequest, SignedForwardRequest } from "@lib/domain/blockchain";
import { Context } from "hono";
import { type Hex, hexToNumber, Address, encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import PhotoNFT from "@lib/contracts/PhotoNFT.json";
import V4PForwarder from "@lib/contracts/V4PForwarder.json";


type eip712DomainType = [string, string, string, number, string, string, string[]];

export type TxType = 'mint' | 'transfer';

export type DomainType = {
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string
}

export const contracts = {
    abiPhotoNFT: [...PhotoNFT.abi] as const,
    abiV4PForwarder: [...V4PForwarder.abi] as const
}

export const assertValidChain = (c: Context, chainId: number) => {
    const currentChain = c.env.CHAIN_ID;
    const currentChainNumber = (typeof currentChain === 'string') ? hexToNumber(currentChain as Hex) : currentChain;

    if (currentChainNumber !== chainId) {
        console.log('Invalid chainId??', chainId, currentChainNumber);
        throw new Error('Red Blockchain no válida, debe conectarse a la red Sepolia: https://sepolia.dev/');
    }
}


export const connectToV4PChainNetwork = (c: Context) => {
    const chainId = c.env.CHAIN_ID;
    const account = privateKeyToAccount(c.env.V4P_ACCOUNT_PRIV_KEY);
    return connectEtherNetwork(chainId, account);
}

export const sendMetatransaction = async (c: Context, message: SignedForwardRequest, txType: TxType) => { 
  const publicClient = createPublicClient({
    chain: getChain(c.env.CHAIN_ID),
    transport: http()
  });
  const walletClient = connectToV4PChainNetwork(c);
  const account = privateKeyToAccount(c.env.V4P_ACCOUNT_PRIV_KEY);
  console.log('signedMessage:', message);
  const { request } = await publicClient.simulateContract({
    address: c.env.V4P_FORWARDER,
    abi: contracts.abiV4PForwarder,
    functionName: 'execute',
    args: [message],
    account
  });
  console.log('Request:', request);
  console.log('Simulation OK, ready to send transaction');
  await walletClient.writeContract(request)
  console.log('Esperando eventos...');
  const logs = await publicClient.getContractEvents({ 
    address: c.env.V4P_CONTRACT,
    abi: contracts.abiPhotoNFT,
    eventName: txType === 'mint' ? 'newPhotoToken' : 'Transfer'
  });
  console.log('logs:', logs);
  return logs;
  // const unwatch = publicClient.watchContractEvent({
  //   address: c.env.V4P_CONTRACT,
  //   abi: contracts.abiPhotoNFT,
  //   eventName: 'newPhotoToken',
  //   onLogs: logs => {
  //     console.log('EVENTO!!!', logs);
  //     unwatch();
  //   }
  // })
}

export const getNonce = async (c: Context, account: Address) : Promise<bigint> =>  {
  const publicClient = createPublicClient({
    chain: getChain(c.env.CHAIN_ID),
    transport: http()
  });
  //await forwarder.read.nonces([alice.account.address])
  const nonce = await publicClient.readContract({
    address: c.env.V4P_FORWARDER,
    abi: contracts.abiV4PForwarder,
    functionName: 'nonces',
    args: [account]
  })as bigint;
  return nonce;
}

export const getMessageToSignForNFTCreation = async (from: Address, to: Address, nonce: bigint, photoUri: string) => { 

  return await getMessageToSign({
      from, to,
      data : abiMintPhotoCallEncoded(photoUri),
      nonce
  });
}

export const getMessageToSignForNFTTransfer = async (from: Address, to: Address, destination: Address, tokenId: bigint, nonce: bigint) => { 
    return await getMessageToSign({
        from, to,
        data : abiTransferTokenCallEncoded(destination, tokenId),
        nonce
    });
}

export const getMessageSeralizable = (message: ForwardRequest) : ForwardRequest => {
  const serializableMessage = Object.keys(message).reduce((acc: any, key: string) => {
      const value = message[key as keyof ForwardRequest];
      if (typeof value === 'bigint') {
          acc[key] = parseInt(value.toString());
      } else {
          acc[key] = value;
      }
      return acc;    
  }, {} as Record<keyof ForwardRequest, unknown>);
  return serializableMessage;
}

export const getDomain = async (c: Context) : Promise<DomainType> => {
    const publicClient = createPublicClient({
        chain: getChain(c.env.CHAIN_ID),
        transport: http()
    });
    const forwarder = getContract({
        publicClient,
        address: c.env.V4P_FORWARDER,
        abi: contracts.abiV4PForwarder
    });
    const [ _, name, version, chainId, verifyingContract ] = await publicClient.readContract({
                                                                address: c.env.V4P_FORWARDER,
                                                                abi: contracts.abiV4PForwarder,
                                                                functionName: 'eip712Domain',
                                                              })as eip712DomainType;
    return {
        name, version, chainId: Number(chainId), verifyingContract
    };
    
}

const getMessageToSign = async (data : {
    from: Address, // Usuario que firma
    to: Address,   // Dirección del Contrato donde se ejecuta la transacción
    data: `0x${string}`,
    nonce: bigint
  }, deadline?: number) : Promise<ForwardRequest> => {
    if (!deadline) {
        deadline = Math.floor(Date.now() / 1000) + 60*100; // We have 10 minutes to perform the transaction
    }

    return {
      ...data,      
      gas: 1_000_000n,
      deadline,
      value: 0n
    };
  }


const abiMintPhotoCallEncoded = (photoUri: string) : `0x${string}` => {

    const methodEncoded = encodeFunctionData({
      abi: [{
        inputs: [
          {name: 'newTokenURI', type: 'string'}
        ],
        name: 'mintPhoto',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      }],
      args: [photoUri]
    });
    return methodEncoded; // fnSignatureTransfer+fnParamsTransfer.substring(2) as `0x${string}`;
  }


const abiTransferTokenCallEncoded = (account: Address, tokenId: bigint) : `0x${string}` => {

    const methodEncoded = encodeFunctionData({
      abi: [{
        inputs: [
          {name: 'to', type: 'address'}, 
          {name: 'tokenId', type: 'uint256'}],
        name: 'transferToken',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      }],
      args: [account, tokenId]
    });
    return methodEncoded; // fnSignatureTransfer+fnParamsTransfer.substring(2) as `0x${string}`;
  }


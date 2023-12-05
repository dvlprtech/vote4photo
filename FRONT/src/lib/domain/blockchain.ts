import type { Address } from "viem"

export type ForwardRequest = {
    from: Address
    to: Address,
    value: bigint,
    gas: bigint,
    deadline: number,
    data: `0x${string}`,
    nonce?: bigint,
  }

export type SignedForwardRequest = ForwardRequest & {
    signature: `0x${string}`
  }

export const TYPES = {
    ForwardRequest: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'gas', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },        
      { name: 'deadline', type: 'uint48' },
      { name: 'data', type: 'bytes' },    
    ],
    EIP712Domain : [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
  }
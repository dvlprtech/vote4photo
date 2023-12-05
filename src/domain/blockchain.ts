import { Address } from "viem"

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
  
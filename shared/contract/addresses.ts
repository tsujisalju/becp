// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : shared/contract/addresses.ts
// Description      : Populated after deploying the contract to the blockchain network.
// First Written on : Sunday, 10-Mar-2026
// Last Modified on :

import { CHAIN } from "../constants";

const DEPLOYED_ADDRESSES: Record<number, `0x${string}`> = {
  [CHAIN.OP_SEPOLIA.id]: "0x0b7E8cd604830d29DDe6eb5417b948F89eBE248D",
  [CHAIN.OPTIMISM.id]: "0x",
}

export function getContractAddress(chainId: number): `0x${string}` {
  const envOverride = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (envOverride) return envOverride as `0x${string}`;
  const addr = DEPLOYED_ADDRESSES[chainId];
  if (!addr) throw new Error(`No contract address configured for chain ${chainId}`);
  return addr;
}

export { DEPLOYED_ADDRESSES }

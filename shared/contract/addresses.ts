// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : shared/contract/addresses.ts
// Description      : Populated after deploying the contract to the blockchain network.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { CHAIN } from "../constants";

const DEPLOYED_ADDRESSES: Record<number, `0x${string}`> = {
  [CHAIN.OP_SEPOLIA.id]: "0x2E576e8f9CFfc44DCa5d8a19E63E300C2b59dF3f",
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

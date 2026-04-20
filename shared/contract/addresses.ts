// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : shared/contract/addresses.ts
// Description      : Populated after deploying the contract to the blockchain network.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { ACTIVE_CHAIN, CHAIN } from "../constants";

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

/** Block explorer URL for a specific NFT token on the active chain */
export function nftExplorerUrl(tokenId: string | bigint): string {
  const contractAddress = getContractAddress(ACTIVE_CHAIN.id);
  return `${ACTIVE_CHAIN.blockExplorer}/nft/${contractAddress.toLowerCase()}/${tokenId.toString()}`;
}

/** Block explorer URL for a wallet address on the active chain */
export function addressExplorerUrl(address: string): string {
  return `${ACTIVE_CHAIN.blockExplorer}/address/${address}`;
}

export { DEPLOYED_ADDRESSES }

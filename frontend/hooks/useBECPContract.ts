"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useBECPContract.ts
// Description      : Returns a stable contract config object to be spread on wagmi contract calls. Centralize address and ABI so call sites never import them directly.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on :

import { BECP_CREDENTIAL_ABI, getContractAddress } from "@becp/shared/contract";
import { useChainId } from "wagmi";

export interface BECPContractConfig {
  address: `0x${string}`;
  abi: typeof BECP_CREDENTIAL_ABI;
}

export function useBECPContract(): BECPContractConfig | null {
  const chainId = useChainId();
  try {
    return {
      address: getContractAddress(chainId),
      abi: BECP_CREDENTIAL_ABI,
    }
  } catch {
    return null;
  }
}

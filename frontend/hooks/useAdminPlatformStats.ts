// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useAdminPlatformStats.ts
// Description      : Aggregates platform-wide stats for the university admin dashboard.
//                    Reads totalCredentialTypes() and totalSupply(id) for each type from
//                    the contract, plus the paused() state. Active organizer and pending
//                    approval counts come from useOrganizerRequests (off-chain store).
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { useBECPContract } from "./useBECPContract";
import { useOrganizerRequests } from "./useOrganizerRequests";

export interface AdminPlatformStats {
  totalTypes: number;
  totalIssued: bigint;
  activeOrganizers: number;
  pendingApprovals: number;
  isPaused: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function useAdminPlatformStats(): AdminPlatformStats {
  const contract = useBECPContract();
  const { pending, approved, isLoading: isRequestsLoading, isError: isRequestsError } = useOrganizerRequests();

  // 1. Total credential types
  const {
    data: total,
    isLoading: isTotalLoading,
    isError: isTotalError,
  } = useReadContract({
    ...contract!,
    functionName: "totalCredentialTypes",
    query: { enabled: !!contract },
  });

  // 2. Token ID range
  const tokenIds = useMemo(() => {
    if (!total || total === 0n) return [];
    return Array.from({ length: Number(total) }, (_, i) => BigInt(i + 1));
  }, [total]);

  // 3. Batch totalSupply per token
  const {
    data: supplyResults,
    isLoading: isSupplyLoading,
    isError: isSupplyError,
  } = useReadContracts({
    contracts: tokenIds.map((tokenId) => ({
      ...contract!,
      functionName: "totalSupply" as const,
      args: [tokenId] as const,
    })),
    query: { enabled: !!contract && tokenIds.length > 0, staleTime: 30_000 },
  });

  // 4. Pause state
  const {
    data: pausedResult,
    isLoading: isPausedLoading,
    isError: isPausedError,
  } = useReadContract({
    ...contract!,
    functionName: "paused",
    query: { enabled: !!contract },
  });

  const totalIssued = useMemo<bigint>(() => {
    if (!supplyResults) return 0n;
    return supplyResults.reduce<bigint>((sum, r) => {
      return sum + (r?.status === "success" ? (r.result as bigint) : 0n);
    }, 0n);
  }, [supplyResults]);

  return {
    totalTypes: Number(total ?? 0n),
    totalIssued,
    activeOrganizers: approved.length,
    pendingApprovals: pending.length,
    isPaused: (pausedResult as boolean | undefined) ?? false,
    isLoading: isTotalLoading || isSupplyLoading || isPausedLoading || isRequestsLoading,
    isError: isTotalError || isSupplyError || isPausedError || isRequestsError,
  };
}

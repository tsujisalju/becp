"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useAllCredentialTypes.ts
// Description      : Fetches every active credential type registered on the contract —
//                    the data source for the student events marketplace. Unlike
//                    useOrganizerCredentialTypes (which filters to the connected wallet),
//                    this hook returns ALL active types from all organizers.
//                    Pipeline:
//                      1. totalCredentialTypes() → N
//                      2. Batch getCredentialType(1..N) → keep active: true only
//                      3. Batch totalSupply(tokenId) for each active type
//                      4. Batch hasCredential(address, tokenId) for each active type
//                         (wallet-connected only; defaults isEarned: false otherwise)
//                      5. useQueries for IPFS metadata per active type
// First Written on : Wednesday, 25-Mar-2026
// Last Modified on : Wednesday, 25-Mar-2026

import { CredentialTypeMetadata } from "@/lib/credential/metadata";
import { ipfsToHttp } from "@becp/shared";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useConnection, useReadContract, useReadContracts } from "wagmi";
import { useBECPContract } from "./useBECPContract";

export interface MarketplaceEvent {
  tokenId: bigint;
  issuer: `0x${string}`;
  metadataURI: string;
  active: boolean;
  registeredAt: bigint;
  issuedCount: bigint;
  isEarned: boolean;
  metadata: CredentialTypeMetadata | null;
  isMetadataLoading: boolean;
}

export interface MarketplaceStats {
  totalEvents: number;
  categoryCount: number;
  totalSkillsAvailable: number;
}

async function fetchIpfsMetadata(uri: string): Promise<CredentialTypeMetadata> {
  const url = ipfsToHttp(uri);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch metadata: ${uri}`);
  return res.json();
}

export interface UseAllCredentialTypesResult {
  events: MarketplaceEvent[];
  stats: MarketplaceStats;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useAllCredentialTypes(): UseAllCredentialTypesResult {
  const { address } = useConnection();
  const contract = useBECPContract();

  // 1. Total credential type count
  const {
    data: total,
    isLoading: isTotalLoading,
    isError: isTotalError,
    refetch: refetchTotal,
  } = useReadContract({
    ...contract!,
    functionName: "totalCredentialTypes",
    query: { enabled: !!contract },
  });

  // 2. Stable token ID range
  const tokenIds = useMemo(() => {
    if (!total || total === 0n) return [];
    return Array.from({ length: Number(total) }, (_, i) => BigInt(i + 1));
  }, [total]);

  // 3. Batch read all credential types
  const {
    data: credentialTypeResults,
    isLoading: isTypesLoading,
    isError: isTypesError,
    refetch: refetchTypes,
  } = useReadContracts({
    contracts: tokenIds.map((tokenId) => ({
      ...contract!,
      functionName: "getCredentialType" as const,
      args: [tokenId] as const,
    })),
    query: {
      enabled: !!contract && tokenIds.length > 0,
      staleTime: 30_000,
    },
  });

  // 4. Filter to active types only
  const activeTypes = useMemo(() => {
    if (!credentialTypeResults) return [];
    return tokenIds.flatMap((tokenId, i) => {
      const result = credentialTypeResults[i];
      if (result?.status !== "success" || !result.result) return [];
      const { issuer, metadataURI, active, registeredAt } = result.result as {
        issuer: `0x${string}`;
        metadataURI: string;
        active: boolean;
        registeredAt: bigint;
      };
      if (!active) return [];
      return [{ tokenId, issuer, metadataURI, active, registeredAt }];
    });
  }, [credentialTypeResults, tokenIds]);

  // 5. Batch totalSupply for issued count social proof
  const {
    data: supplyResults,
    isLoading: isSupplyLoading,
    isError: isSupplyError,
    refetch: refetchSupply,
  } = useReadContracts({
    contracts: activeTypes.map((ct) => ({
      ...contract!,
      functionName: "totalSupply" as const,
      args: [ct.tokenId] as const,
    })),
    query: { enabled: !!contract && activeTypes.length > 0, staleTime: 30_000 },
  });

  // 6. Batch hasCredential for "Already earned" badge (wallet optional)
  const {
    data: earnedResults,
    isLoading: isEarnedLoading,
    refetch: refetchEarned,
  } = useReadContracts({
    contracts: activeTypes.map((ct) => ({
      ...contract!,
      functionName: "hasCredential" as const,
      args: [ct.tokenId, address!] as const,
    })),
    query: {
      enabled: !!contract && !!address && activeTypes.length > 0,
      staleTime: 30_000,
    },
  });

  // 7. Fetch IPFS metadata per active type
  const metadataQueries = useQueries({
    queries: activeTypes.map((ct) => ({
      queryKey: ["credential-type-metadata", ct.metadataURI],
      queryFn: () => fetchIpfsMetadata(ct.metadataURI),
      staleTime: 5 * 60_000,
      retry: 2,
    })),
  });

  // 8. Merge into MarketplaceEvent[]
  const events = useMemo<MarketplaceEvent[]>(() => {
    return activeTypes.map((ct, i) => ({
      ...ct,
      issuedCount: supplyResults?.[i]?.status === "success" ? (supplyResults[i].result as bigint) : 0n,
      isEarned: !!address && earnedResults?.[i]?.status === "success" ? (earnedResults[i].result as boolean) : false,
      metadata: metadataQueries[i]?.data ?? null,
      isMetadataLoading: metadataQueries[i]?.isLoading ?? false,
    }));
  }, [activeTypes, supplyResults, earnedResults, metadataQueries, address]);

  const stats = useMemo<MarketplaceStats>(() => {
    const categorySet = new Set(
      events.flatMap((e) => (e.metadata?.becp_activity_category ? [e.metadata.becp_activity_category] : [])),
    );
    const skillIdSet = new Set(events.flatMap((e) => (e.metadata?.becp_skills ?? []).map((s) => s.id)));
    return {
      totalEvents: events.length,
      categoryCount: categorySet.size,
      totalSkillsAvailable: skillIdSet.size,
    };
  }, [events]);

  const isAnyMetadataLoading = metadataQueries.some((q) => q.isLoading);

  function refetch() {
    refetchTotal();
    refetchTypes();
    refetchSupply();
    refetchEarned();
  }

  return {
    events,
    stats,
    isLoading: isTotalLoading || isTypesLoading || isSupplyLoading || isEarnedLoading || isAnyMetadataLoading,
    isError: isTotalError || isTypesError || isSupplyError,
    refetch,
  };
}

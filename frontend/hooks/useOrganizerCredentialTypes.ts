"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useOrganizerCredentialTypes.ts
// Description      : Fetches all credential types registered by the connected organizer wallet.
//                    Strategy:
//                      1. Read totalCredentialTypes() to know the token ID range (1..N)
//                      2. Batch read getCredentialType(id) for all IDs via useReadContracts
//                      3. Filter to those where issuer === connected address
//                      4. Fetch IPFS metadata for each matching type via TanStack Query
// First Written on : Wednesday, 18-Mar-2026
// Last Modified on : Wednesday, 18-Mar-2026

import { CredentialTypeMetadata } from "@/lib/credential/metadata";
import { ipfsToHttp } from "@becp/shared";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useConnection, useReadContract, useReadContracts } from "wagmi";
import { useBECPContract } from "./useBECPContract";

export interface OnChainCredentialType {
  tokenId: bigint;
  issuer: `0x${string}`;
  metadataURI: string;
  active: boolean;
  registeredAt: bigint;
}

export interface HydratedCredentialType extends OnChainCredentialType {
  metadata: CredentialTypeMetadata | null;
  isMetadataLoading: boolean;
}

async function fetchIpfsMetadata(uri: string): Promise<CredentialTypeMetadata> {
  const url = ipfsToHttp(uri);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch metadata from IPFS: ${uri}`);
  return res.json();
}

export interface UseOrganizerCredentialTypesResult {
  credentialTypes: HydratedCredentialType[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useOrganizerCredentialTypes(): UseOrganizerCredentialTypesResult {
  const { address } = useConnection();
  const contract = useBECPContract();

  //1. Get total number of credential types
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

  //2. Generate tokenIds based on total
  const tokenIds = useMemo(() => {
    if (!total || total === 0n) return [];
    return Array.from({ length: Number(total) }, (_, i) => BigInt(i + 1));
  }, [total]);

  //3. Read credential types based on tokenIds
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

  //4. Filter owned types by organizer
  const ownedTypes = useMemo<OnChainCredentialType[]>(() => {
    if (!credentialTypeResults || !address) return [];

    return tokenIds.flatMap((tokenId, i) => {
      const result = credentialTypeResults[i];
      if (result?.status !== "success" || !result.result) return [];

      const { issuer, metadataURI, active, registeredAt } = result.result as {
        issuer: `0x${string}`;
        metadataURI: string;
        active: boolean;
        registeredAt: bigint;
      };

      if (issuer.toLowerCase() !== address.toLowerCase()) return [];

      return [{ tokenId, issuer, metadataURI, active, registeredAt }];
    });
  }, [credentialTypeResults, tokenIds, address]);

  //5. Fetch metadata for owned types
  const metadataQueries = useQueries({
    queries: ownedTypes.map((ct) => ({
      queryKey: ["credential-type-metadata", ct.metadataURI],
      queryFn: () => fetchIpfsMetadata(ct.metadataURI),
      staleTime: 5 * 60_000,
      retry: 2,
    })),
  });

  //6. Combine owned types with metadata
  const credentialTypes = useMemo<HydratedCredentialType[]>(() => {
    return ownedTypes.map((ct, i) => ({
      ...ct,
      metadata: metadataQueries[i]?.data ?? null,
      isMetadataLoading: metadataQueries[i]?.isLoading ?? false,
    }));
  }, [ownedTypes, metadataQueries]);

  const isAnyMetadataLoading = metadataQueries.some((q) => q.isLoading);

  function refetch() {
    refetchTotal();
    refetchTypes();
  }

  return {
    credentialTypes,
    isLoading: isTotalLoading || isTypesLoading || isAnyMetadataLoading,
    isError: isTotalError || isTypesError,
    refetch,
  };
}

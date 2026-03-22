"use client";

import { CredentialTypeMetadata } from "@/lib/credential/metadata";
import { ActivityCategory, ipfsToHttp, scoreToLevel, SKILL_LEVELS, SkillLevel, SkillTag } from "@becp/shared";
import { useConnection, useReadContract, useReadContracts } from "wagmi";
import { useBECPContract } from "./useBECPContract";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useStudentCredentials.ts
// Description      : Fetches all credentials owned by the connected student wallet.
//                    Strategy:
//                      1. Read getStudentCredentials(address) → uint256[] of tokenIds
//                      2. Batch read uri(tokenId) for every tokenId
//                      3. Fetch IPFS metadata for each uri via TanStack Query
//                      4. Derive aggregated SkillScore[] for the dashboard charts
// First Written on : Friday, 20-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026

export interface HydratedCredential {
  tokenId: bigint;
  tokenURI: string;
  metadata: CredentialTypeMetadata | null;
  isMetadataLoading: boolean;
}

export interface AggregatedSkillScore {
  skill: SkillTag;
  totalScore: number;
  credentialCount: number;
  level: SkillLevel;
  nextLevelThreshold: number | null;
  progressPercent: number;
}

export interface StudentStats {
  totalCredentials: number;
  totalActivityHours: number;
  uniqueSkillCount: number;
  categoryBreakdown: Partial<Record<ActivityCategory, number>>;
}

export interface UseStudentCredentialsResult {
  credentials: HydratedCredential[];
  skillScores: AggregatedSkillScore[];
  stats: StudentStats;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

async function fetchIpfsMetadata(uri: string): Promise<CredentialTypeMetadata> {
  const url = ipfsToHttp(uri);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch metadata from IPFS: ${uri}`);
  return res.json();
}

function aggregateSkills(credentials: HydratedCredential[]): AggregatedSkillScore[] {
  const scoreMap = new Map<
    string,
    {
      skill: SkillTag;
      totalScore: number;
      credentialCount: number;
    }
  >();

  for (const cred of credentials) {
    const meta = cred.metadata;
    if (!meta?.becp_skills?.length) continue;

    const duration = meta.becp_activity_duration_hours ?? 0;

    for (const skill of meta.becp_skills) {
      const existing = scoreMap.get(skill.id);
      const points = duration * skill.weight;

      if (existing) {
        existing.totalScore += points;
        existing.credentialCount += 1;
      } else {
        scoreMap.set(skill.id, {
          skill,
          totalScore: points,
          credentialCount: 1,
        });
      }
    }
  }

  return Array.from(scoreMap.values())
    .map(({ skill, totalScore, credentialCount }) => {
      const level = scoreToLevel(totalScore);
      const levelConfig = SKILL_LEVELS[level];
      const levels = Object.values(SKILL_LEVELS);
      const currentIdx = levels.findIndex((l) => l.label === levelConfig.label);
      const nextLevel = levels[currentIdx + 1] ?? null;

      const rangeStart = levelConfig.min;
      const rangeEnd = nextLevel ? nextLevel.min : totalScore;
      const rangeSize = rangeEnd - rangeStart;
      const progressInRange = totalScore - rangeStart;
      const progressPercent = nextLevel && rangeSize > 0 ? Math.min(100, Math.round((progressInRange / rangeSize) * 100)) : 100;

      return {
        skill,
        totalScore,
        credentialCount,
        level,
        nextLevelThreshold: nextLevel ? nextLevel.min : null,
        progressPercent,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

export function useStudentCredentials(): UseStudentCredentialsResult {
  const { address } = useConnection();
  const contract = useBECPContract();

  // 1. Fetch token IDs owned by this student
  const {
    data: tokenIds,
    isLoading: isTokenIdsLoading,
    isError: isTokenIdsError,
    refetch: refetchTokenIds,
  } = useReadContract({
    ...contract!,
    functionName: "getStudentCredentials",
    args: address ? [address] : undefined,
    query: {
      enabled: !!contract && !!address,
      staleTime: 30_000,
    },
  });

  const ids = useMemo<bigint[]>(() => {
    return (tokenIds as bigint[] | undefined) ?? [];
  }, [tokenIds]);

  // 2. Batch read uri(tokenId) for each token
  const {
    data: uriResults,
    isLoading: isUrisLoading,
    isError: isUrisError,
    refetch: refetchUris,
  } = useReadContracts({
    contracts: ids.map((tokenId) => ({
      ...contract!,
      functionName: "uri" as const,
      args: [tokenId] as const,
    })),
    query: {
      enabled: !!contract && ids.length > 0,
      staleTime: 5 * 60_000,
    },
  });

  // 3. Build uri list aligned to tokenIds
  const uriList = useMemo<string[]>(() => {
    if (!uriResults) return [];
    return ids.map((_, i) => {
      const r = uriResults[i];
      return r?.status === "success" ? (r.result as string) : "";
    });
  }, [uriResults, ids]);

  // 4. Fetch IPFS metadata for each URI
  const metadataQueries = useQueries({
    queries: uriList.map((uri) => ({
      queryKey: ["credential-metadata", uri],
      queryFn: () => fetchIpfsMetadata(uri),
      enabled: !!uri,
      staleTime: 10 * 60_000,
      retry: 2,
    })),
  });

  // 5. Combine tokenId, uri, and metadata into a single credential object
  const credentials = useMemo<HydratedCredential[]>(() => {
    return ids.map((tokenId, i) => ({
      tokenId,
      tokenURI: uriList[i] ?? "",
      metadata: metadataQueries[i]?.data ?? null,
      isMetadataLoading: metadataQueries[i]?.isLoading ?? false,
    }));
  }, [ids, uriList, metadataQueries]);

  // 6. Aggregate skill scores from credentials
  const skillScores = useMemo(() => aggregateSkills(credentials), [credentials]);

  // 7. Calculate student stats from credentials
  const stats = useMemo<StudentStats>(() => {
    const ready = credentials.filter((c) => c.metadata);
    const totalActivityHours = ready.reduce((sum, c) => sum + (c.metadata?.becp_activity_duration_hours ?? 0), 0);
    const categoryBreakdown: Partial<Record<ActivityCategory, number>> = {};
    for (const c of ready) {
      const cat = c.metadata?.becp_activity_category;
      if (cat) categoryBreakdown[cat] = (categoryBreakdown[cat] ?? 0) + 1;
    }
    return {
      totalCredentials: credentials.length,
      totalActivityHours,
      uniqueSkillCount: skillScores.length,
      categoryBreakdown,
    };
  }, [credentials, skillScores]);

  const isAnyMetadataLoading = metadataQueries.some((q) => q.isLoading);

  function refetch() {
    refetchTokenIds();
    refetchUris();
  }

  return {
    credentials,
    skillScores,
    stats,
    isLoading: isTokenIdsLoading || isUrisLoading || isAnyMetadataLoading,
    isError: isTokenIdsError || isUrisError,
    refetch,
  };
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useRole.ts
// Description      : Reads the connected wallet's on-chain role from BECPCredential and returns the resolved UserRole.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { CONTRACT_ROLES, UserRole } from "@becp/shared";
import { BECP_CREDENTIAL_ABI, getContractAddress } from "@becp/shared/contract";
import { useChainId, useConnection, useReadContracts } from "wagmi";

export interface UseRoleResult {
  role: UserRole;
  isAdmin: boolean;
  isUniversityAdmin: boolean;
  isOrganizer: boolean;
  isStudent: boolean;
  isLoading: boolean;
  isConnected: boolean;
}

export function useRole(): UseRoleResult {
  const { address, isConnected, isReconnecting, isConnecting } = useConnection();
  const chainId = useChainId();

  let contractAddress: `0x${string}` | undefined;
  try {
    contractAddress = getContractAddress(chainId);
  } catch {
    contractAddress = undefined;
  }

  const { data, isLoading } = useReadContracts({
    contracts:
      address && contractAddress
        ? [
            {
              address: contractAddress,
              abi: BECP_CREDENTIAL_ABI,
              functionName: "hasRole",
              args: [CONTRACT_ROLES.DEFAULT_ADMIN as `0x${string}`, address],
            },
            {
              address: contractAddress,
              abi: BECP_CREDENTIAL_ABI,
              functionName: "hasRole",
              args: [CONTRACT_ROLES.UNIVERSITY_ADMIN as `0x${string}`, address],
            },
            {
              address: contractAddress,
              abi: BECP_CREDENTIAL_ABI,
              functionName: "hasRole",
              args: [CONTRACT_ROLES.ISSUER as `0x${string}`, address],
            },
          ]
        : [],
    query: {
      enabled: !!address && !!contractAddress,
      staleTime: 30_000,
    },
  });

  const isDefaultAdmin = data?.[0]?.result === true;
  const isUniversityAdmin = data?.[1]?.result === true || isDefaultAdmin;
  const isOrganizer = data?.[2]?.result === true;

  // Role precedence: admin > organizer > student
  // University admins do not also show as organize even if they hold both roles
  let role: UserRole = "student";
  if (isUniversityAdmin) role = "university_admin";
  else if (isOrganizer) role = "organizer";

  return {
    role,
    isAdmin: isDefaultAdmin,
    isUniversityAdmin,
    isOrganizer: isOrganizer && !isUniversityAdmin,
    isStudent: role === "student",
    isLoading: isReconnecting || isConnecting || (isLoading && !!address),
    isConnected,
  };
}

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useOrganizerRequests.ts
// Description      : Fetches all organizer role requests from the off-chain JSON store
//                    at /api/organizer-request. Used by the admin organizers page to show
//                    pending approvals and the active organizers list.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import { useQuery } from "@tanstack/react-query";

export type OrganizerRequestStatus = "pending" | "approved" | "rejected" | "revoked";

export interface OrganizerRequest {
  address: string;
  displayName: string;
  organization: string;
  reason: string;
  requestedAt: string;
  status: OrganizerRequestStatus;
}

async function fetchRequests(): Promise<OrganizerRequest[]> {
  const res = await fetch("/api/organizer-request");
  if (!res.ok) throw new Error("Failed to fetch organizer requests");
  return res.json();
}

export interface UseOrganizerRequestsResult {
  all: OrganizerRequest[];
  pending: OrganizerRequest[];
  approved: OrganizerRequest[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useOrganizerRequests(): UseOrganizerRequestsResult {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<OrganizerRequest[]>({
    queryKey: ["organizer-requests"],
    queryFn: fetchRequests,
    staleTime: 30_000,
  });

  return {
    all: data,
    pending: data.filter((r) => r.status === "pending"),
    approved: data.filter((r) => r.status === "approved"),
    isLoading,
    isError,
    refetch,
  };
}

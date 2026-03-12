"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/hooks/useStudentProfile.ts
// Description      : Off-chain half of hybrid auth. Fetched and updates a student's profile from the Next.js API route that is not stored on-chain.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnection } from "wagmi";

export interface StudentProfile {
  address: `0x${string}`;
  displayName?: string;
  bio?: string;
  careerGoal?: string;
  avatarUri?: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentProfileUpdate = Partial<Pick<StudentProfile, "displayName" | "bio" | "careerGoal" | "avatarUri">>

const PROFILE_QUERY_KEY = (address: string) => ["student-profile", address.toLowerCase()];

async function fetchProfile(address: string): Promise<StudentProfile | null> {
  const res = await fetch(`/api/profile/${address.toLowerCase()}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

async function upsertProfile(address: string, update: StudentProfileUpdate): Promise<StudentProfile> {
  const res = await fetch(`/api/profile/${address.toLowerCase()}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update, (_, value) => value === undefined ? null : value),
  })
  if (!res.ok) throw new Error('Failed to save profile')
  return res.json()
}

export function useStudentProfile() {
  const { address } = useConnection();
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: PROFILE_QUERY_KEY(address ?? ''),
    queryFn: () => fetchProfile(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 min — profile data changes infrequently
  })

  const { mutateAsync: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: (update: StudentProfileUpdate) => upsertProfile(address!, update),
    onSuccess: (updated) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY(address!), updated)
    },
  })

  return {
    profile,
    isLoading: isLoading && !!address,
    isSaving,
    saveProfile,
    displayName: profile?.displayName ?? `${address?.slice(0, 6)}…${address?.slice(-4)}`,
  }
}

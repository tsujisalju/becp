// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/lib/credential/metadata.ts
// Description      : Builds the CredentialTypeMetadata JSON object from the
//                    credential type form values. This document is uploaded to IPFS
//                    at credential type registration time, before any recipients are known.
//                    Per-recipient fields (becp_recipient_address, becp_issued_date,
//                    becp_tx_hash) are added separately when batchIssueCredential is called.
// First Written on : Tuesday, 17-Mar-2026
// Last Modified on : Tuesday, 17-Mar-2026

import { ActivityCategory, BECP_METADATA_VERSION, SkillTag } from "@becp/shared";
import { format } from "date-fns";

export interface CredentialTypeMetadata {
  // ERC-1155 / OpenSea standard
  name: string;
  description: string;
  image: string;
  external_url?: string;

  // Open Badges 3.0 alignment
  achievementType: "Extracurricular";
  criteria: { narrative: string };

  // BECP credential type fields
  becp_version: string;
  becp_issuer_name: string;
  becp_issuer_address: `0x${string}`;
  becp_activity_date: string; // ISO 8601 date string
  becp_activity_category: ActivityCategory;
  becp_activity_duration_hours: number;
  becp_soulbound: true;
  becp_skills: SkillTag[];
}

export interface BuildMetadataInput {
  name: string;
  description: string;
  activityDate: Date;
  activityCategory: ActivityCategory;
  durationHours: number;
  issuerName: string;
  issuerAddress: `0x${string}`;
  externalUrl?: string;
  skills: SkillTag[];
}

export function buildCredentialTypeMetadata(input: BuildMetadataInput): CredentialTypeMetadata {
  return {
    name: input.name,
    description: input.description,
    // Placeholder badge image — organizers can update this in Phase 4 when
    // badge artwork upload is implemented.
    image: "ipfs://bafkreihdwdcefgh4dqkjv67uzcmw37rwez4ecd1tizuish5yynpuad624u",
    ...(input.externalUrl ? { external_url: input.externalUrl } : {}),

    achievementType: "Extracurricular",
    criteria: {
      narrative: input.description,
    },

    becp_version: BECP_METADATA_VERSION,
    becp_issuer_name: input.issuerName,
    becp_issuer_address: input.issuerAddress,
    becp_activity_date: format(input.activityDate, "yyyy-MM-dd"),
    becp_activity_category: input.activityCategory,
    becp_activity_duration_hours: input.durationHours,
    becp_soulbound: true,
    becp_skills: input.skills,
  };
}

export async function uploadCredentialTypeMetadata(metadata: CredentialTypeMetadata): Promise<string> {
  const res = await fetch("/api/metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to upload metadata to IPFS");
  }

  const { uri } = (await res.json()) as { cid: string; uri: string };
  return uri;
}

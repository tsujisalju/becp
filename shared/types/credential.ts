// ─────────────────────────────────────────────────────────────────────────────
// BECP Core Credential Types
// Aligned with ERC-1155 token standard and Open Badges 3.0 specification.
// These types are the single source of truth shared between the smart contract
// ABI, IPFS metadata, and the frontend application.
// ─────────────────────────────────────────────────────────────────────────────

// ── User Roles ──────────────────────────────────────────────────────────────

/**
 * The four stakeholder roles in the BECP platform.
 * Maps to on-chain role bytes32 constants in the smart contract.
 */
export type UserRole = 'student' | 'organizer' | 'university_admin' | 'recruiter'
export const roleLabel: Record<UserRole, string> = {
  organizer: "Organizer",
  university_admin: "University Admin",
  student: "Student",
  recruiter: "Recruiter",
};

// ── Skill Taxonomy ───────────────────────────────────────────────────────────

/** Broad category of a skill. */
export type SkillCategory = 'technical' | 'soft' | 'leadership' | 'creative' | 'domain'

/** Proficiency tier — maps to the gamified RPG progression in the dashboard. */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

/** A single skill tag embedded in a credential's metadata. */
export interface SkillTag {
  /** Unique identifier, e.g. "react", "public-speaking", "project-management" */
  id: string
  /** Human-readable label */
  label: string
  category: SkillCategory
  /**
   * Weight 1–10 indicating how heavily this activity develops this skill.
   * Used by the skill quantification framework.
   */
  weight: number
}

// ── Credential Metadata ──────────────────────────────────────────────────────

/** Activity categories recognized by the BECP platform. */
export type ActivityCategory =
  | 'hackathon'
  | 'workshop'
  | 'competition'
  | 'volunteer'
  | 'club_leadership'
  | 'conference'
  | 'bootcamp'
  | 'sports'
  | 'community_service'
  | 'other'

/**
 * NFT metadata schema for a BECP credential.
 * Stored on IPFS via Pinata. The `tokenURI` in the smart contract
 * resolves to a JSON document conforming to this interface.
 *
 * Extended from the ERC-1155 metadata standard with BECP-specific fields
 * under the `becp_*` namespace to maintain compatibility with wallets
 * and marketplaces that read standard NFT metadata.
 */
export interface CredentialMetadata {
  // ── ERC-1155 / OpenSea standard fields ────────────────────────────────────
  /** Display name of the credential, e.g. "DevMatch 2024 Hackathon — 2nd Place" */
  name: string
  /** Detailed description of the activity and what was achieved. */
  description: string
  /** IPFS URI to the credential badge image, e.g. "ipfs://Qm..." */
  image: string
  /** External URL to the event page or issuing organization. */
  external_url?: string

  // ── BECP-specific metadata ─────────────────────────────────────────────────
  /** Schema version for forward-compatibility, e.g. "1.0.0" */
  becp_version: string
  /** On-chain token ID (set after minting). */
  becp_token_id?: bigint
  /** Ethereum address of the issuing organization's wallet. */
  becp_issuer_address: `0x${string}`
  /** Human-readable name of the issuing organization. */
  becp_issuer_name: string
  /** Ethereum address of the student recipient's wallet. */
  becp_recipient_address: `0x${string}`
  /** Full name of the student (optional — student controls visibility). */
  becp_recipient_name?: string
  /** Student ID from the university identity system (hashed for privacy). */
  becp_recipient_student_id_hash?: string
  /** ISO 8601 date the certificate was issued, e.g. "2025-03-07" */
  becp_issued_date: string
  /** ISO 8601 date the activity took place. */
  becp_activity_date: string
  /** Duration of the activity in hours. Used for skill weight calculation. */
  becp_activity_duration_hours: number
  becp_activity_category: ActivityCategory
  /**
   * Whether this credential is soulbound (non-transferable).
   * Most BECP credentials are soulbound — they represent personal achievement.
   */
  becp_soulbound: boolean
  /**
   * Skill tags associated with this credential.
   * Populated via AI skill inferencing from the event description.
   */
  becp_skills: SkillTag[]
  /**
   * On-chain transaction hash of the minting transaction.
   * Set after minting is confirmed.
   */
  becp_tx_hash?: `0x${string}`
  /**
   * Block explorer URL to the minting transaction.
   * e.g. "https://sepolia-optimism.etherscan.io/tx/0x..."
   */
  becp_explorer_url?: string
}

// ── Credential (hydrated) ────────────────────────────────────────────────────

/**
 * A fully hydrated credential object used in the frontend.
 * Combines on-chain token data with IPFS metadata.
 */
export interface Credential {
  /** ERC-1155 token ID */
  tokenId: bigint
  /** IPFS URI pointing to CredentialMetadata JSON */
  tokenURI: string
  /** Hydrated metadata from IPFS */
  metadata: CredentialMetadata
  /** On-chain owner address */
  ownerAddress: `0x${string}`
  /** Block number when the credential was minted */
  mintedAtBlock: bigint
  /** Unix timestamp of minting */
  mintedAtTimestamp: number
}

// ── Event / Activity ─────────────────────────────────────────────────────────

/**
 * An extracurricular event listed on the BECP events marketplace.
 * Created by organizers; students register and receive credentials upon completion.
 */
export interface BECPEvent {
  /** Unique event ID (UUID, set by the database) */
  id: string
  title: string
  description: string
  /** Organizer's wallet address — must hold ORGANIZER_ROLE on-chain */
  organizerAddress: `0x${string}`
  organizerName: string
  /** Issuing university or organization */
  institutionName: string
  category: ActivityCategory
  /** ISO 8601 datetime */
  startDate: string
  /** ISO 8601 datetime */
  endDate: string
  location?: string
  isOnline: boolean
  maxParticipants?: number
  /** Current registration count */
  registeredCount: number
  /**
   * AI-inferred skill tags from the event title + description.
   * Organizers can review and edit before publishing.
   */
  inferredSkills: SkillTag[]
  /** Duration in hours — used for skill weight calculations */
  durationHours: number
  /** IPFS URI for the badge artwork for this event */
  badgeImageUri?: string
  /** Whether certificates have been issued for this event */
  certificatesIssued: boolean
  /** Corresponding ERC-1155 token type ID once credentials are minted */
  tokenTypeId?: bigint
}

// ── Student Skill Profile ────────────────────────────────────────────────────

/**
 * Aggregated skill profile derived from a student's credential collection.
 * Powers the gamified skill dashboard.
 */
export interface SkillScore {
  skill: SkillTag
  /** Accumulated score from all credentials containing this skill */
  totalScore: number
  /** Number of credentials contributing to this skill */
  credentialCount: number
  level: SkillLevel
  /** Score required to reach the next level */
  nextLevelThreshold: number
}

export interface StudentSkillProfile {
  studentAddress: `0x${string}`
  /** Total credentials held */
  totalCredentials: number
  /** Total activity hours across all credentials */
  totalActivityHours: number
  /** Aggregated scores per skill */
  skills: SkillScore[]
  /** Credentials sorted by most recently issued */
  recentCredentials: Credential[]
  /** Last recalculated timestamp */
  lastUpdated: number
}

// ── Verification ─────────────────────────────────────────────────────────────

/**
 * Result returned to a recruiter when verifying a credential via QR code or link.
 */
export interface VerificationResult {
  isValid: boolean
  credential?: Credential
  /** Reason for invalidity, if applicable */
  invalidReason?: 'not_found' | 'revoked' | 'wrong_owner' | 'chain_error'
  /** Block explorer URL for the recruiter to audit directly */
  explorerUrl?: string
  verifiedAt: number
}

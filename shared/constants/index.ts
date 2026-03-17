// ─────────────────────────────────────────────────────────────────────────────
// BECP Platform Constants
// Single source of truth for values used across the frontend and contracts.
// ─────────────────────────────────────────────────────────────────────────────

// ── Blockchain ───────────────────────────────────────────────────────────────

export const CHAIN = {
  /** OP Sepolia testnet — where the smart contract is deployed during development */
  OP_SEPOLIA: {
    id: 11155420,
    name: 'OP Sepolia',
    rpcUrl: 'https://sepolia.optimism.io',
    blockExplorer: 'https://sepolia-optimism.etherscan.io',
  },
  /** Optimism mainnet — target for production deployment */
  OPTIMISM: {
    id: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
} as const

/** Default chain for the current environment */
export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === 'production' ? CHAIN.OPTIMISM.id : CHAIN.OP_SEPOLIA.id

// ── Smart Contract Role Identifiers ──────────────────────────────────────────
// These are the keccak256 hashes of the role strings used in AccessControl.
// Kept here to avoid magic strings on the frontend when checking roles.

export const CONTRACT_ROLES = {
  /** bytes32(0) — the default admin role in OpenZeppelin AccessControl */
  DEFAULT_ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  /** keccak256("ISSUER_ROLE") */
  ISSUER: '0x114e74f6ea3bd819998f3d08537d1a8c0499cf2d8581bca18dae0498d5e74e73',
  /** keccak256("UNIVERSITY_ADMIN_ROLE") */
  UNIVERSITY_ADMIN: '0x4a0a6d86122c7bd7083e83912c312adabf207f986f5f674c45fb05012cff44c7',
} as const

// ── IPFS ─────────────────────────────────────────────────────────────────────

export const IPFS = {
  /** Public gateway for resolving ipfs:// URIs in the browser */
  PUBLIC_GATEWAY: process.env.NEXT_PUBLIC_GATEWAY_URL ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/` : 'https://gateway.pinata.cloud/ipfs/',
  /** Cloudflare's IPFS gateway as fallback */
  CLOUDFLARE_GATEWAY: 'https://cloudflare-ipfs.com/ipfs/',
} as const

/** Convert an ipfs:// URI to an HTTPS gateway URL */
export function ipfsToHttp(uri: string, gateway = IPFS.PUBLIC_GATEWAY): string {
  if (uri.startsWith('ipfs://')) {
    return `${gateway}${uri.slice(7)}`
  }
  return uri
}

// ── Skill Quantification Framework ───────────────────────────────────────────
// Thresholds for the RPG-style level progression on the student dashboard.

export const SKILL_LEVELS = {
  beginner: { min: 0, max: 99, label: 'Beginner', color: '#94a3b8' },
  intermediate: { min: 100, max: 299, label: 'Intermediate', color: '#60a5fa' },
  advanced: { min: 300, max: 699, label: 'Advanced', color: '#a78bfa' },
  expert: { min: 700, max: Infinity, label: 'Expert', color: '#f59e0b' },
} as const

/**
 * Calculate the SkillLevel from a raw score.
 * Score = Σ (credential.durationHours × skillTag.weight) across all credentials.
 */
export function scoreToLevel(score: number): keyof typeof SKILL_LEVELS {
  if (score >= SKILL_LEVELS.expert.min) return 'expert'
  if (score >= SKILL_LEVELS.advanced.min) return 'advanced'
  if (score >= SKILL_LEVELS.intermediate.min) return 'intermediate'
  return 'beginner'
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export const BECP_METADATA_VERSION = '1.0.0'

// ── Routes ───────────────────────────────────────────────────────────────────
// Centralized route constants so path strings are never duplicated.

export const ROUTES = {
  // Public
  HOME: '/',
  VERIFY: '/verify',
  VERIFY_CREDENTIAL: (tokenId: string) => `/verify/${tokenId}`,

  // Student
  DASHBOARD: '/dashboard',
  CREDENTIALS: '/dashboard/credentials',
  CREDENTIAL_DETAIL: (tokenId: string) => `/dashboard/credentials/${tokenId}`,
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  PROFILE: '/dashboard/profile',

  // Organizer
  ORGANIZER_PORTAL: '/organizer',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_ISSUE: '/organizer/issue',

  // Admin
  ADMIN: '/admin',

  // Auth
  CONNECT: '/connect',
} as const

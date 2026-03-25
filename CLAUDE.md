# BECP — Claude Code Project Memory

## Student & Project Identity

- **Developer:** Muhammad Qayyum bin Mahamad Yazid · TP075129 · APU BSc Software Engineering (Final Year)
- **Supervisor:** Dr. Mohd Nizam bin A. Badaruddin
- **Project:** Blockchain-based Extracurricular Credentials Platform (BECP)
- **Methodology:** Extreme Programming (XP) — solo developer, XP artifacts (release plan, iteration plan, user stories, CRC cards) produced per release
- **Timeline:** March–June 2026

---

## What BECP Does

BECP issues soulbound ERC-1155 NFT micro-credentials to university students upon completing extracurricular activities. Four stakeholder roles:

| Role                 | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| **Student**          | Receives credentials, views gallery, skill dashboard                 |
| **Organizer**        | Registers credential types, batch-issues credentials                 |
| **University Admin** | Manages organizer roles via the admin portal                         |
| **Recruiter**        | Publicly verifies credentials via QR code or link — no auth required |

---

## Monorepo Structure

```
becp-main/
├── contracts/          Hardhat 3 · Solidity · OpenZeppelin v5
├── frontend/           Next.js 16 · Wagmi v3 · RainbowKit · shadcn/ui
└── shared/             TypeScript types, constants, contract ABI/addresses
    ├── constants/
    │   ├── index.ts          CHAIN, CONTRACT_ROLES, IPFS, SKILL_LEVELS, ROUTES
    │   ├── career-goals.ts   CAREER_GOAL_SKILLS, getPrioritySkillIds()
    │   └── skill-pool.ts     SKILL_POOL (array), SKILL_POOL_BY_ID (Map)
    ├── types/
    │   └── credential.ts     UserRole, SkillTag, CredentialMetadata, etc.
    └── contract/
        ├── abi.ts            BECP_CREDENTIAL_ABI (as const)
        └── addresses.ts      getContractAddress(chainId)
```

---

## Tech Stack (locked in)

- **Smart contracts:** Hardhat 3, Viem, OpenZeppelin v5, deployed on **OP Sepolia** (`0x2E576e8f9CFfc44DCa5d8a19E63E300C2b59dF3f`)
- **Frontend:** Next.js 16, Wagmi v3, RainbowKit v2, TanStack Query v5, TanStack Form v1
- **UI:** shadcn/ui preset, **Roboto Slab** font, mauve/emerald light palette
- **IPFS:** Pinata (credentials pinned at issuance)
- **Testing:** Vitest + Testing Library + MSW

---

## Deployment

- **Network:** OP Sepolia (chainId 11155420) for development
- **Contract address:** `0x2E576e8f9CFfc44DCa5d8a19E63E300C2b59dF3f`
- **Block explorer:** `https://sepolia-optimism.etherscan.io`

---

## XP Release Status

| Release | Phase(s)    | Deliverable                                                                   | Status          |
| ------- | ----------- | ----------------------------------------------------------------------------- | --------------- |
| R1      | Phase 0+1   | Monorepo scaffold + ERC-1155 soulbound contract + 52 passing tests            | **DONE**        |
| R2      | Phase 2     | Next.js frontend skeleton, wallet auth, role detection, verify page, 58 tests | **DONE**        |
| R3      | Phase 3A–3B | Credential issuance flow + student credential dashboard                       | **IN PROGRESS** |
| R4      | Phase 3C–3D | Gamified skill progression + events marketplace + AI inferencing              | PENDING         |
| R5      | Phase 3E–3G | Recruiter verification portal (QR) + portfolio export + OP Mainnet            | PENDING         |

---

## Phase 3 — Current State (as of R3 handoff)

### What's complete

**Phase 3A — Organizer credential type registration**

- `organizer/events/` page with credential type form and card list
- `useOrganizerCredentialTypes` hook — reads `totalCredentialTypes()`, batch-reads `getCredentialType(id)`, filters by issuer address, fetches IPFS metadata, aggregates stats
- `lib/credential/metadata.ts` — `buildCredentialTypeMetadata()`, `uploadCredentialTypeMetadata()`
- `api/metadata/` route — proxies to Pinata

**Phase 3B — Organizer batch issuance**

- `organizer/issue/` page — 3-step flow (select type → add recipients → review & issue)
- Recipient address parsing with duplicate/invalid detection (`parseRecipients`)
- Calls `batchIssueCredential(tokenId, recipients[])` on-chain

**Phase 3C — Student credential gallery**

- `useStudentCredentials` hook — `getStudentCredentials(address)` → batch `uri()` reads → IPFS metadata fetch → skill aggregation → `StudentStats`
- `(student)/dashboard/credentials/` page — filterable card gallery with stat bar
- `credential-card.tsx` component

**Phase 3D — Student skill dashboard**

- `dashboard/page.tsx` — live stat cards, career-goal-aware bar chart, soft skills radar, recent credentials sidebar, skill badge wall
- `skill-progress-chart.tsx` — shadcn `ChartContainer` wrapping Recharts `BarChart`. Priority skills shown first (with zero-score placeholders for unearned), non-priority bars at reduced opacity
- `soft-skills-radar-chart.tsx` — Recharts `RadarChart`, all 6 soft skill axes always shown (zero placeholders for unearned)
- `recent-credentials-list.tsx`

**Shared additions**

- `shared/constants/career-goals.ts` — `CAREER_GOAL_SKILLS` maps all 14 career goal strings → ordered priority skill ID arrays; `getPrioritySkillIds(careerGoal)`
- `shared/constants/skill-pool.ts` — `SKILL_POOL` (23 skills, all categories) and `SKILL_POOL_BY_ID` map. **This is the single source of truth** — the organizer credential type form imports from here too (local copy removed)

### Frontend test suite (115 tests total after R3)

| File                                              | Tests | Covers                                       |
| ------------------------------------------------- | ----- | -------------------------------------------- |
| `tests/unit/api-profile.test.ts`                  | —     | Profile API route                            |
| `tests/components/ProfileEditForm.test.tsx`       | —     | Student profile form                         |
| `tests/components/RoleGuard.test.tsx`             | —     | Role-based access control                    |
| `tests/components/VerifyForm.test.tsx`            | —     | Public credential verify                     |
| `tests/hooks/useRole.test.ts`                     | —     | On-chain role resolution                     |
| `tests/hooks/useStudentProfile.test.ts`           | —     | Off-chain profile hook                       |
| `tests/unit/parseRecipients.test.ts`              | 21    | Address parsing for issuance (pure unit)     |
| `tests/hooks/useOrganizerCredentialTypes.test.ts` | 13    | Organizer credential types hook              |
| `tests/hooks/useStudentCredentials.test.ts`       | 23    | Student credentials hook + skill aggregation |

**Key testing patterns:**

- Wagmi hooks mocked at module level via `vi.mock("wagmi", () => ({...}))` — never spin up a real WagmiProvider
- MSW (`setupServer`) intercepts IPFS/API fetch calls
- `makeQueryClient()` in `test-utils.tsx` accepts optional overrides: `makeQueryClient({ queries: { retry: 0 } })`
- `useReadContracts` called multiple times per hook render — use `mockImplementation` dispatching on `contracts[0]?.functionName` instead of `mockReturnValueOnce` to avoid mock desynchronisation across re-renders
- `waitFor` callbacks must use `expect(...)` (throws on failure) — never return a boolean from `waitFor`
- IPFS failure tests: wait on `isMetadataLoading === false` with `{ timeout: 15000 }` — hooks have `retry: 2` at query level which overrides QueryClient defaults

---

## Key Architectural Decisions

**Role detection — hybrid**

- On-chain: `hasRole(ISSUER_ROLE | UNIVERSITY_ADMIN_ROLE | DEFAULT_ADMIN_ROLE, address)` via `useReadContracts` multicall
- Off-chain: `/api/profile/[address]` JSON file store for `displayName`, `bio`, `careerGoal`, `avatarUri`
- Role precedence: `university_admin` > `organizer` > `student`

**`(web3)` route group**

- All Wagmi/RainbowKit providers live in `app/(web3)/layout.tsx`
- Root layout stays a pure server component — zero Web3 bundle on the landing page

**Recruiter access**

- Public verify page only, no wallet connection required

**Credential metadata — two-document model (Option B)**

- Document 1: Credential Type Metadata (pinned at registration, shared across all recipients)
- Document 2: Not used — recipient address proven on-chain via `balanceOf`, not embedded in IPFS
- `uri(tokenId)` returns the type metadata URI for all holders of that token ID

**SKILL_LEVELS colour fields**

- `color` — hex string used directly for chart fills and inline styles (e.g. `"#a7f3d0"`)
- Previously had `colorHex` split from `color` (Tailwind class) — now consolidated back to single `color` hex field

**Skill score formula**

```
score(skill) = Σ (credential.becp_activity_duration_hours × skill.weight)
               across all credentials containing that skill
```

**Career goal skill priority**

- `getPrioritySkillIds(careerGoal)` returns ordered skill IDs for the bar chart
- Bar chart: priority skills first (including zero-score placeholders), non-priority skills after at 45% opacity
- Radar chart: all 6 known soft skills always shown with zero-score fill for unearned ones

---

## Important Code Patterns

**Wagmi hook imports (v3 API)**

- `useConnection()` not `useAccount()` — this is Wagmi v3
- `useReadContract`, `useReadContracts`, `useWriteContract`, `usePublicClient`

**Hardhat 3 task API**

```ts
// Correct Hardhat 3 syntax:
task({ id: "taskName", description: "...", action: async (args, hre) => {} });
// NOT the v2 chaining API (.addParam() etc.)
```

**shadcn Chart usage**

- Always use `ChartContainer` (wraps `ResponsiveContainer` + injects CSS vars)
- `ChartConfig` keys become `--color-<key>` CSS variables
- `ChartTooltip` is a re-export of Recharts `Tooltip`
- Bar colouring: use `shape` prop on `Bar`, read `var(--color-<skillKey>)` from injected CSS

**File header convention (all source files)**

```ts
// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : path/relative/to/project/root/filename.ts
// Description      : What this file does
// First Written on : <Day>, DD-Mon-YYYY
// Last Modified on : <Day>, DD-Mon-YYYY
```

---

## What's Next (Phase 3E onwards)

The next feature in the release plan is **Phase 3E — Recruiter verification portal**:

- QR code generation on the student's credential cards linking to `/verify?tokenId=X&holder=0x...`
- The `/verify` page already does on-chain verification — just needs the QR generation and shareable link UI

After that: **Phase 3F** — exportable portfolio PDF, and **Phase 3G** — OP Mainnet production deployment prep.

---

## Files to Know First

When picking up any task, these are the most important files to read:

```
shared/constants/index.ts              SKILL_LEVELS, CONTRACT_ROLES, ROUTES, ipfsToHttp
shared/constants/career-goals.ts       Career goal → priority skill ID mapping
shared/constants/skill-pool.ts         SKILL_POOL, SKILL_POOL_BY_ID
shared/types/credential.ts             All shared types: SkillTag, CredentialMetadata, etc.
shared/contract/abi.ts                 BECP_CREDENTIAL_ABI
frontend/hooks/useStudentCredentials.ts     Full student data pipeline
frontend/hooks/useOrganizerCredentialTypes.ts  Organizer data pipeline
frontend/tests/test-utils.tsx          Shared test helpers and mock factories
```

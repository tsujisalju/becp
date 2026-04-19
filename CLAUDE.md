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
- **QR codes:** `uqr` — pure-JS QR encoder, works in jsdom and @react-pdf/renderer (no canvas/DOM required)
- **Testing:** Vitest + Testing Library + MSW

---

## Deployment

- **Network:** OP Sepolia (chainId 11155420) for development
- **Contract address:** `0x2E576e8f9CFfc44DCa5d8a19E63E300C2b59dF3f`
- **Block explorer:** `https://sepolia-optimism.etherscan.io`

---

## XP Release Status

| Release | Phase(s)    | Deliverable                                                                        | Status       |
| ------- | ----------- | ---------------------------------------------------------------------------------- | ------------ |
| R1      | Phase 0+1   | Monorepo scaffold + ERC-1155 soulbound contract + 52 passing tests                 | **DONE**     |
| R2      | Phase 2     | Next.js frontend skeleton, wallet auth, role detection, verify page, 58 tests      | **DONE**     |
| R3      | Phase 3A–3D | Credential registration and issuance flow + student credential dashboard           | **DONE**     |
| R4      | Phase 3E–3G | Recruiter QR share + portfolio PDF export + admin portal + 177 tests               | **DONE**     |
| R5      | Phase 4     | Centralized DB + credential/event images + event detail page + UX polish           | **NEXT**     |

---

## Completed Features (R1–R4)

### Phase 3A — Organizer credential type registration

- `organizer/events/` page with credential type form and card list
- `useOrganizerCredentialTypes` hook — reads `totalCredentialTypes()`, batch-reads `getCredentialType(id)`, filters by issuer address, fetches IPFS metadata, aggregates stats
- `lib/credential/metadata.ts` — `buildCredentialTypeMetadata()`, `uploadCredentialTypeMetadata()`
- `api/metadata/` route — proxies to Pinata

### Phase 3B — Organizer batch issuance

- `organizer/issue/` page — 3-step flow (select type → add recipients → review & issue)
- Recipient address parsing with duplicate/invalid detection (`parseRecipients`)
- Calls `batchIssueCredential(tokenId, recipients[])` on-chain

### Phase 3C — Student credential gallery

- `useStudentCredentials` hook — `getStudentCredentials(address)` → batch `uri()` reads → IPFS metadata fetch → skill aggregation → `StudentStats`
- `(student)/dashboard/credentials/` page — filterable card gallery with stat bar
- `credential-card.tsx` component — QR share dialog using `uqr` inline SVG renderer

### Phase 3D — Student skill dashboard

- `dashboard/page.tsx` — live stat cards, career-goal-aware bar chart, soft skills radar, recent credentials sidebar, skill badge wall
- `skill-progress-chart.tsx` — shadcn `ChartContainer` wrapping Recharts `BarChart`. Priority skills shown first (with zero-score placeholders for unearned), non-priority bars at reduced opacity
- `soft-skills-radar-chart.tsx` — Recharts `RadarChart`, all 6 soft skill axes always shown (zero placeholders for unearned)
- `recent-credentials-list.tsx`

### Phase 3E — Recruiter QR verification portal

- `ShareDialog` inside `credential-card.tsx` — generates verify URL (`/verify?tokenId=X&holder=0x...`), renders QR code using `uqr` inline SVG, copy-link button, "Verify now" link
- `/verify` page refactored to 2-column layout; `VerifyForm` reads pre-fill params from `useSearchParams()`
- QR code replaces `react-qr-code` — `uqr` `encode()` returns `{ size, data: boolean[][] }`, rendered as `<svg>` with `<rect>` per dark module

### Phase 3F — Portfolio PDF export

- `portfolio-pdf.tsx` — `@react-pdf/renderer` document with per-credential rows
- Each credential row: left side text info + right side QR code rendered with `Svg`/`Rect` primitives from `@react-pdf/renderer` (canvas/DOM unavailable in PDF renderer)
- `QRCodePDF` component uses `uqr` matrix, maps boolean cells → `<Rect>` elements

### Phase 3G — University Admin portal

- `admin/` pages — platform stats dashboard, organizer request review (approve/reject)
- `useAdminPlatformStats` hook — aggregates `totalCredentialTypes`, per-type `totalSupply` batch, `paused()` state, plus off-chain organizer request counts
- `useOrganizerRequests` hook — fetches `GET /api/organizer-request`, exposes `all`, `pending`, `approved` filtered arrays

### Phase 3H (4) — Events marketplace

- `useAllCredentialTypes` hook — reads all credential types from chain, fetches IPFS metadata, adds `issuedCount` (totalSupply) and `isEarned` (hasCredential) per student
- Student-facing events browsing page showing all registered credential types

### Shared additions

- `shared/constants/career-goals.ts` — `CAREER_GOAL_SKILLS` maps all 14 career goal strings → ordered priority skill ID arrays; `getPrioritySkillIds(careerGoal)`
- `shared/constants/skill-pool.ts` — `SKILL_POOL` (23 skills, all categories) and `SKILL_POOL_BY_ID` map. **Single source of truth** — organizer form imports from here

---

## Frontend test suite (177 tests — 13 files)

| File                                              | Tests | Covers                                             |
| ------------------------------------------------- | ----- | -------------------------------------------------- |
| `tests/unit/api-profile.test.ts`                  | 10    | Profile API route (GET/PUT/404)                    |
| `tests/unit/parseRecipients.test.ts`              | 21    | Address parsing for batch issuance (pure unit)     |
| `tests/components/RoleGuard.test.tsx`             | 7     | Role-based access control component               |
| `tests/components/ProfileEditForm.test.tsx`       | 11    | Student profile form                               |
| `tests/components/VerifyForm.test.tsx`            | 12    | Public credential verify form + result states      |
| `tests/components/CredentialCard.test.tsx`        | 16    | Card rendering + ShareDialog + QR SVG + clipboard  |
| `tests/hooks/useRole.test.ts`                     | 11    | On-chain role resolution                           |
| `tests/hooks/useStudentProfile.test.ts`           | 7     | Off-chain profile hook                             |
| `tests/hooks/useOrganizerCredentialTypes.test.ts` | 13    | Organizer credential types hook                    |
| `tests/hooks/useStudentCredentials.test.ts`       | 23    | Student credentials hook + skill aggregation       |
| `tests/hooks/useAllCredentialTypes.test.ts`       | 20    | Events marketplace hook (issuedCount, isEarned)    |
| `tests/hooks/useAdminPlatformStats.test.ts`       | 15    | Admin stats aggregation (contract + off-chain)     |
| `tests/hooks/useOrganizerRequests.test.ts`        | 11    | Organizer request fetch + pending/approved filter  |

**Key testing patterns:**

- Wagmi hooks mocked at module level via `vi.mock("wagmi", () => ({...}))` — never spin up a real WagmiProvider
- MSW (`setupServer`) intercepts IPFS/API fetch calls
- `makeQueryClient()` in `test-utils.tsx` accepts optional overrides: `makeQueryClient({ queries: { retry: 0 } })`
- **Multiple `useReadContracts` calls per hook** — use `mockImplementation` dispatching on `contracts[0]?.functionName` to avoid mock desynchronisation across re-renders. Never use `mockReturnValueOnce` for hooks that render multiple times
- **Multiple `useReadContract` calls per hook** (e.g. `useAdminPlatformStats` calls it for `totalCredentialTypes` and `paused`) — pass config through: `vi.mock("wagmi", () => ({ useReadContract: (config) => mockFn(config) }))` then dispatch on `config.functionName`
- `waitFor` callbacks must use `expect(...)` (throws on failure) — never return a boolean from `waitFor`
- IPFS failure tests: wait on `isMetadataLoading === false` with `{ timeout: 15000 }` — hooks have `retry: 2` at query level which overrides QueryClient defaults
- **`navigator.clipboard` mock** — use `Object.defineProperty` in `beforeEach` (not `beforeAll`), because `vi.clearAllMocks()` can wipe the value. Always redeclare after clearing
- **Radix UI Dialog portals in tests** — `userEvent.click` fails for buttons inside portals (Radix sets `pointer-events: none` on body; React 18 event delegation is scoped to root container). Use native `.click()` inside `act(async () => {...})` instead:
  ```ts
  await act(async () => { screen.getByRole("button", { name: /share/i }).click(); });
  ```
- **`next/navigation` mock** — use a configurable `vi.fn()` factory so individual tests can override it without `mockReturnValueOnce` desync:
  ```ts
  const mockSearchParams = vi.fn(() => new URLSearchParams());
  vi.mock("next/navigation", () => ({ useSearchParams: () => mockSearchParams(), ... }));
  // In beforeEach after vi.clearAllMocks():
  mockSearchParams.mockImplementation(() => new URLSearchParams());
  ```

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

**QR code encoding — `uqr`**

- `encode(value)` returns `{ size: number, data: boolean[][] }` where `data[y][x] === true` means dark module
- Web UI: render as `<svg>` with `<rect>` elements per dark module (pure React, no canvas)
- PDF: render using `<Svg>`/`<Rect>` from `@react-pdf/renderer` (canvas unavailable in PDF renderer)
- Works in jsdom without any browser API polyfills — safe to use in tests

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

## R6 — What's Next

### R6.1 — Centralized database (replace JSON file stores)

Currently, two off-chain stores use local JSON files:
- `/api/profile/[address]` — student/organizer/admin profiles (`displayName`, `bio`, `careerGoal`, `avatarUri`)
- `/api/organizer-request` — organizer role applications

Replace both with a proper database. Selection criteria: easy setup, reasonable free tier, privacy-appropriate for FYP deployment.

**Also in scope:** Profile edit pages for organizer and university admin roles (student profile edit already exists).

### R6.2 — Credential and event images

Extend `CredentialTypeMetadata` in `shared/types/credential.ts` to include:
- `becp_certificate_image` — image shown on the credential card / PDF certificate
- `becp_event_image` — banner/cover image shown on the event card in the marketplace

Update the organizer credential type registration form to accept image uploads (upload to IPFS via Pinata, same pattern as existing metadata upload). Show image covers in `credential-card.tsx` and the events marketplace card component.

### R6.3 — Event detail page

Clicking an event card in the student events marketplace should navigate to a dedicated event detail page (`/events/[tokenId]` or similar) showing full event information: description, criteria, skills awarded, organizer info, issue count, and a claim/verify CTA.

### R6.4 — UX polish

- Fix random greeting in student dashboard re-generating on every re-render — should be stable after first mount (use `useRef` or `useState` with a stable initial value, not a `useMemo` that depends on render state)

---

## Files to Know First

When picking up any task, these are the most important files to read:

```
shared/constants/index.ts                     SKILL_LEVELS, CONTRACT_ROLES, ROUTES, ipfsToHttp
shared/constants/career-goals.ts              Career goal → priority skill ID mapping
shared/constants/skill-pool.ts                SKILL_POOL, SKILL_POOL_BY_ID
shared/types/credential.ts                    All shared types: SkillTag, CredentialMetadata, etc.
shared/contract/abi.ts                        BECP_CREDENTIAL_ABI
frontend/hooks/useStudentCredentials.ts       Full student data pipeline
frontend/hooks/useOrganizerCredentialTypes.ts Organizer credential types pipeline
frontend/hooks/useAllCredentialTypes.ts       Events marketplace pipeline (with isEarned/issuedCount)
frontend/hooks/useAdminPlatformStats.ts       Admin aggregated stats
frontend/hooks/useOrganizerRequests.ts        Organizer request off-chain store hook
frontend/app/(web3)/(student)/dashboard/credentials/credential-card.tsx  QR share dialog
frontend/app/(web3)/(student)/dashboard/credentials/portfolio-pdf.tsx    PDF export with QR
frontend/tests/test-utils.tsx                 Shared test helpers and mock factories
```

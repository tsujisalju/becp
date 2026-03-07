# BECP — Blockchain Extracurricular Credentials Platform

> Final Year Project — BSc Software Engineering, Asia Pacific University (APU)
> Student: Muhammad Qayyum bin Mahamad Yazid (TP075129)
> Supervisor: Dr. Mohd Nizam bin A. Badaruddin

A blockchain-based platform for issuing, owning, and verifying credentials for
university extracurricular activities. Built on Optimism (OP Stack), with
NFT-based micro-credentials, an AI-powered skill inferencing engine, and a
gamified student skill dashboard.

---

## Architecture

```
becp/
├── apps/
│   └── web/                 ← Next.js 16 PWA (TypeScript + Tailwind + ShadCN)
│                               Wagmi v2 + RainbowKit + TanStack Query
│
├── contracts/               ← Solidity smart contracts (Hardhat + OpenZeppelin)
│   ├── contracts/
│   │   ├── BECPCredential.sol      ← ERC-1155 credential NFT contract
│   │   ├── interfaces/             ← Contract interfaces
│   │   └── libraries/              ← Shared Solidity libraries
│   ├── scripts/                    ← Deployment scripts
│   └── test/                       ← Hardhat tests (Chai + Mocha)
│
└── packages/
    └── shared/              ← Shared TypeScript types, constants, schemas
                                Imported by both apps/web and contracts
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 (App Router, PWA) |
| UI Components | ShadCN UI + Tailwind CSS |
| Charts / Dashboard | Recharts |
| Blockchain Client | Wagmi v3 + Viem |
| Wallet Integration | RainbowKit v2 |
| Smart Contract Language | Solidity 0.8.28 |
| Contract Framework | Hardhat v3 + OpenZeppelin v5 |
| Token Standard | ERC-1155 (multi-token, soulbound) |
| Blockchain Network | Optimism / OP Sepolia (testnet) |
| RPC Provider | Alchemy |
| Decentralized Storage | IPFS via Pinata |
| AI Skill Inferencing | Anthropic API |
| Deployment | Vercel (frontend) |
| Monorepo | Turborepo + bun workspaces |

## Development Methodology

This project follows **Extreme Programming (XP)**, adapted for solo development:

- **User stories** drive requirements and acceptance tests
- **Spike solutions** explore technical unknowns before implementation
- **Test-driven development (TDD)** — write tests first, then implementation
- **Small frequent releases** via Vercel auto-deploy on push to `main`
- **Continuous refactoring** — code is always kept clean and simple

## Getting Started

### Prerequisites

- Node.js v20+
- Bun
- Git

### First-time Setup

```bash
git clone https://github.com/tsujisalju/becp.git
```

### Environment Variables

After setup, fill in your API keys:

**`apps/web/.env.local`**

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | [dashboard.alchemy.com](https://dashboard.alchemy.com) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [cloud.walletconnect.com](https://cloud.walletconnect.com) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | After running `pnpm contract:deploy:testnet` |
| `PINATA_JWT` | [app.pinata.cloud/keys](https://app.pinata.cloud/keys) |
| `AI_API_KEY` | OpenAI or Anthropic dashboard |

**`contracts/.env.local`**

| Variable | Where to get it |
|---|---|
| `DEPLOYER_PRIVATE_KEY` | Your dedicated deployer wallet (never use your main wallet) |
| `ALCHEMY_API_KEY` | Same as above |
| `ETHERSCAN_API_KEY` | [optimistic.etherscan.io/myapikey](https://optimistic.etherscan.io/myapikey) |

> ⚠️ **Security**: Fund the deployer wallet with OP Sepolia ETH from the
> [Optimism Faucet](https://app.optimism.io/faucet). Use a fresh wallet
> dedicated to this project — never use a wallet holding real funds.

### Running Locally

```bash
# Terminal 1 — start local Hardhat blockchain node
bun --filter @becp/contracts node

# Terminal 2 — deploy contract to local node
bun run contract:deploy:local

# Terminal 3 — start Next.js dev server
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Deploying to Testnet

```bash
# Deploy contract to OP Sepolia
bun run contract:deploy:testnet

# Copy the deployed contract address into apps/web/.env.local
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Deploy frontend to Vercel (auto-deploys on git push)
git push origin main
```

## Key Commands

```bash
bun run dev                        # Start all workspaces in dev mode
bun run build                      # Build all workspaces
bun run test                       # Run all tests
bun run lint                       # Lint all workspaces
bun run typecheck                  # Type-check all workspaces
bun run format                     # Format all files with Prettier

bun run contract:compile           # Compile Solidity contracts
bun run contract:test              # Run Hardhat tests
bun run contract:deploy:local      # Deploy to local Hardhat node
bun run contract:deploy:testnet    # Deploy to OP Sepolia
```

## Smart Contract Architecture

The core contract `BECPCredential.sol` implements:

- **ERC-1155** multi-token standard for batch issuance efficiency
- **Soulbound tokens** (ERC-5484) — credentials are non-transferable by default
- **Role-based access control** (OpenZeppelin AccessControl):
  - `DEFAULT_ADMIN_ROLE` — platform deployer
  - `ISSUER_ROLE` — verified event organizers
  - `UNIVERSITY_ADMIN_ROLE` — university administrators
- **Token URI** points to IPFS JSON conforming to `CredentialMetadata` schema

## Shared Type System

All TypeScript types live in `packages/shared` and are imported by both the
frontend and the contract deployment/test scripts. This ensures the IPFS
metadata schema, skill taxonomy, and route constants are never duplicated.

Key types: `CredentialMetadata`, `BECPEvent`, `SkillTag`, `StudentSkillProfile`, `VerificationResult`.

---

## License

Academic project — All Rights Reserved. Not licensed for commercial use.

# BECP Contracts

Solidity smart contracts for the **Blockchain-based Extracurricular Credentials Platform (BECP)**.

Built with [Hardhat 3](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3), [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x/), and [Hardhat Ignition](https://hardhat.org/ignition/docs/getting-started) for deterministic deployments.

---

## Contracts

### `BECPCredential.sol`

An ERC-1155 **soulbound** credential contract. Each token type represents one extracurricular event or activity, and tokens are non-transferable (soulbound) — they can only be minted to or burned from a student's wallet.

#### Role hierarchy

| Role | Granted to | Capabilities |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | Admin (deployer / multi-sig) | Pause & unpause the contract, manage role admins |
| `UNIVERSITY_ADMIN_ROLE` | Admin | Approve / revoke organizers, revoke any credential |
| `ISSUER_ROLE` | Approved organizers | Register credential types, issue & revoke credentials |

> **Note:** `UNIVERSITY_ADMIN_ROLE` is the role admin for `ISSUER_ROLE`, implementing a two-tier trust model where the university controls which organizers can issue credentials.

#### Key functions

| Function | Role required | Description |
|---|---|---|
| `approveOrganizer(address)` | `UNIVERSITY_ADMIN_ROLE` | Grant `ISSUER_ROLE` to an organizer |
| `revokeOrganizer(address)` | `UNIVERSITY_ADMIN_ROLE` | Revoke `ISSUER_ROLE` from an organizer |
| `registerCredentialType(string)` | `ISSUER_ROLE` | Register a new credential type, returns its `tokenId` |
| `issueCredential(uint256, address)` | `ISSUER_ROLE` | Issue a credential to one student |
| `batchIssueCredential(uint256, address[])` | `ISSUER_ROLE` | Issue a credential to many students atomically |
| `revokeCredential(uint256, address, string)` | `ISSUER_ROLE` (original) or `UNIVERSITY_ADMIN_ROLE` | Revoke a credential, burning it from the student's wallet |
| `pause()` / `unpause()` | `DEFAULT_ADMIN_ROLE` | Emergency circuit breaker |

---

## Setup

### Prerequisites

- [Bun](https://bun.sh/) (used as the package manager)
- Node.js ≥ 20

### Install dependencies

```sh
bun install
```

### Environment variables

The following configuration variables are required for testnet / mainnet deployments. You can set them via `hardhat-keystore` (recommended) or as shell environment variables.

| Variable | Description |
|---|---|
| `ALCHEMY_API_KEY` | Alchemy API key used to construct RPC URLs for OP Sepolia and OP Mainnet |
| `DEPLOYER_PRIVATE_KEY` | Private key of the account that will sign and fund the deployment transaction |

To set a variable using `hardhat-keystore`:

```sh
npx hardhat keystore set ALCHEMY_API_KEY
npx hardhat keystore set DEPLOYER_PRIVATE_KEY
```

---

## Running Tests

Run all tests (Solidity + Node.js):

```sh
npx hardhat test
```

Run only Solidity tests:

```sh
npx hardhat test solidity
```

Run only Node.js / viem integration tests:

```sh
npx hardhat test nodejs
```

---

## Deployment

All deployments use the `BECPCredential` Ignition module located at `ignition/modules/BECPCredential.ts`.

The module accepts one parameter:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `admin` | `address` | Deployer account (index 0) | Address granted `DEFAULT_ADMIN_ROLE` and `UNIVERSITY_ADMIN_ROLE` |

> For any persistent deployment, always override `admin` with a multi-sig wallet (e.g. Safe) or a hardware wallet address using a parameters file. **Never leave the deployer EOA as the long-term admin in production.**

### Local — simulated OP chain

No environment variables are needed. The deployer account is used as admin by default.

```sh
npx hardhat ignition deploy ignition/modules/BECPCredential.ts --network hardhatOp
```

### OP Sepolia (testnet)

1. Fill in your admin address in `ignition/parameters/opSepolia.json`:

   ```json
   {
     "BECPCredentialModule": {
       "admin": "0xYOUR_ADMIN_ADDRESS_HERE"
     }
   }
   ```

2. Ensure `ALCHEMY_API_KEY` and `DEPLOYER_PRIVATE_KEY` are set, then deploy:

   ```sh
   npx hardhat ignition deploy ignition/modules/BECPCredential.ts \
     --network opSepolia \
     --parameters ignition/parameters/opSepolia.json
   ```

### OP Mainnet (production)

1. Fill in your **multi-sig or hardware wallet** address in `ignition/parameters/opMainnet.json`:

   ```json
   {
     "BECPCredentialModule": {
       "admin": "0xYOUR_MULTISIG_OR_HARDWARE_WALLET_ADDRESS_HERE"
     }
   }
   ```

2. Ensure `ALCHEMY_API_KEY` and `DEPLOYER_PRIVATE_KEY` are set, then deploy:

   ```sh
   npx hardhat ignition deploy ignition/modules/BECPCredential.ts \
     --network opMainnet \
     --parameters ignition/parameters/opMainnet.json \
     --deployment-id becp-credential-mainnet
   ```

   The `--deployment-id` flag gives this deployment a stable, human-readable name so Ignition can resume or track it correctly across sessions.

---

## Project Structure

```
contracts/
├── contracts/
│   └── BECPCredential.sol        # Main soulbound ERC-1155 credential contract
├── interfaces/
│   └── IBECPCredential.sol       # External-facing interface (events, errors, structs)
├── libraries/
│   └── CredentialLib.sol         # Shared validation helpers
├── ignition/
│   ├── modules/
│   │   └── BECPCredential.ts     # Ignition deployment module
│   └── parameters/
│       ├── opSepolia.json        # Parameter overrides for OP Sepolia
│       └── opMainnet.json        # Parameter overrides for OP Mainnet
├── test/                         # Node.js / viem integration tests
├── hardhat.config.ts             # Hardhat 3 configuration
└── package.json
```

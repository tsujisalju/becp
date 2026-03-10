import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Hardhat Ignition deployment module for BECPCredential.
 *
 * The `admin` parameter is passed to the constructor and is granted both
 * DEFAULT_ADMIN_ROLE and UNIVERSITY_ADMIN_ROLE on deployment. It can
 * later delegate ISSUER_ROLE to approved organizers.
 *
 * It defaults to the deployer account (index 0) for local / testnet
 * convenience, but should always be overridden with a multi-sig or
 * hardware wallet address for production deployments.
 *
 * ─── Local (simulated OP chain) ─────────────────────────────────────────────
 *   npx hardhat ignition deploy ignition/modules/BECPCredential.ts \
 *     --network hardhatOp
 *
 * ─── OP Sepolia (testnet) ────────────────────────────────────────────────────
 *   npx hardhat ignition deploy ignition/modules/BECPCredential.ts \
 *     --network opSepolia \
 *     --parameters ignition/parameters/opSepolia.json
 *
 * ─── OP Mainnet (production) ─────────────────────────────────────────────────
 *   npx hardhat ignition deploy ignition/modules/BECPCredential.ts \
 *     --network opMainnet \
 *     --parameters ignition/parameters/opMainnet.json \
 *     --deployment-id becp-credential-mainnet
 *
 * ─── Required environment variables ─────────────────────────────────────────
 *   ALCHEMY_API_KEY     – Alchemy API key (used in hardhat.config.ts RPC URLs)
 *   DEPLOYER_PRIVATE_KEY – Private key of the account funding the deployment
 */
const BECPCredentialModule = buildModule("BECPCredentialModule", (m) => {
  // The admin address receives DEFAULT_ADMIN_ROLE and UNIVERSITY_ADMIN_ROLE.
  // Defaults to the deployer account so local / testnet runs work out of the
  // box without a parameters file.  Override via a parameters JSON for any
  // persistent deployment (see ignition/parameters/).
  const admin = m.getParameter("admin", m.getAccount(0));

  const becpCredential = m.contract("BECPCredential", [admin]);

  return { becpCredential };
});

export default BECPCredentialModule;

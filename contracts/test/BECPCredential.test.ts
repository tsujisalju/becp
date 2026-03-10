// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : BECPCredential.test.ts
// Description      : Test suite for BECPCredential structured around XP acceptance criteria, one describe block per feature directly mapped to a user story.
// First Written on : Sunday, 8-Mar-2026
// Last Modified on : Sunday, 8-Mar-2026

import { network } from "hardhat";
import assert from "node:assert/strict";
import { before, beforeEach, describe, it } from "node:test";
import { Account, Address, Chain, decodeEventLog, getAddress, keccak256, toHex, Transport, WalletClient, zeroAddress, zeroHash } from "viem";

// Role hashes (must match the Solidity contract)
const UNIVERSITY_ADMIN_ROLE = keccak256(toHex("UNIVERSITY_ADMIN_ROLE"));
const ISSUER_ROLE = keccak256(toHex("ISSUER_ROLE"));
const DEFAULT_ADMIN_ROLE = zeroHash;

// Sample IPFS URIs
const SAMPLE_URI_1 = "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
const SAMPLE_URI_2 = "ipfs://QmSomeOtherCIDForAnotherEvent12345678901234567890";
const INVALID_URI  = "https://not-ipfs.com/metadata.json";

describe("BECPCredential", async () => {
  // Connect to network to expose wallet clients, contract deployment and assestions
  const { viem } = await network.connect();
  const wallets = await viem.getWalletClients();

  const [
    admin,
    universityAdmin,
    organizer,
    ,
    student1,
    student2,
    student3,
    stranger,
  ] = wallets;

  const adminAddr = getAddress(admin.account!.address);
  const uniAdminAddr = getAddress(universityAdmin.account!.address);
  const organizerAddr = getAddress(organizer.account!.address);
  const student1Addr = getAddress(student1.account!.address);
  const student2Addr = getAddress(student2.account!.address);
  const student3Addr = getAddress(student3.account!.address);
  const strangerAddr = getAddress(stranger.account!.address);


  // Contract instance
  // Using any type to avoid coupling to a specific TypeChain
  let contract: any;

  beforeEach(async () => {
    // Deploy a fresh instance before every test so there is no shared state
    contract = await viem.deployContract("BECPCredential", [adminAddr]);
  });

  // Helper function to get contract instance bound to a specific wallet
  async function as(wallet: WalletClient, c = contract) {
    return viem.getContractAt("BECPCredential", c.address, {
      // Resolve wallet type to assert non-null
      client: { wallet: wallet as unknown as WalletClient<Transport, Chain, Account> },
    });
  }

  // Helper function to approve an organizer through the full two-tier trust flow
  async function setupOrganizer(orgWallet: WalletClient = organizer): Promise<void> {
    const asAdmin = await as(admin);
    const asUniAdmin = await as(universityAdmin);
    await asAdmin.write.grantRole([UNIVERSITY_ADMIN_ROLE, uniAdminAddr]);
    await asUniAdmin.write.approveOrganizer([orgWallet.account!.address]);
  }

  // Helper function to register a credential type and return its token ID
  async function registerType(uri: string = SAMPLE_URI_1, c = contract): Promise<bigint> {
    const publicClient = await viem.getPublicClient();
        const hash = await (await as(organizer, c)).write.registerCredentialType([uri]);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        for (const log of receipt.logs) {
          try {
            const event = decodeEventLog({ abi: c.abi, data: log.data, topics: log.topics }) as { eventName: string; args: Record<string, unknown> };
            if (event.eventName === "CredentialTypeRegistered") {
              return (event.args as { tokenId: bigint }).tokenId;
            }
          } catch { /* not a log we care about */ }
        }
        throw new Error("CredentialTypeRegistered event not found in receipt");
  }

  describe("1. Deployment & Initialization", async () => {
    it("grants DEFAULT_ADMIN_ROLE to the deployer", async () => {
      assert.equal(await contract.read.hasRole([DEFAULT_ADMIN_ROLE, adminAddr]), true);
    });

    it("grants UNIVERSITY_ADMIN_ROLE to the deployer", async () => {
      assert.equal(await contract.read.hasRole([UNIVERSITY_ADMIN_ROLE, adminAddr]), true);
    });

    it("sets UNIVERSITY_ADMIN_ROLE as the admin of ISSUER_ROLE", async () => {
      assert.equal(await contract.read.getRoleAdmin([ISSUER_ROLE]), UNIVERSITY_ADMIN_ROLE);
    });

    it("starts with zero credential types registered", async () => {
      assert.equal(await contract.read.totalCredentialTypes(), 0n);
    });

    it("reverts if deployed with zero address as admin", async () => {
      await viem.assertions.revertWithCustomError(
        viem.deployContract("BECPCredential", [zeroAddress]),
        contract,
        "ZeroAddress",
      );
    });
  })

  describe("2. Two-tier Organizer Trust Model", async () => {
    beforeEach(async () => {
      await (await as(admin)).write.grantRole([UNIVERSITY_ADMIN_ROLE, uniAdminAddr]);
    });

    it("allows university admin can approve an organizer", async () => {
      const asUniAdmin = await as(universityAdmin);
      await viem.assertions.emitWithArgs(
        asUniAdmin.write.approveOrganizer([organizerAddr]),
        contract, "OrganizerApproved",
        [organizerAddr, uniAdminAddr],
      );
      assert.equal(await contract.read.hasRole([ISSUER_ROLE, organizerAddr]), true);
    })

    it("allows university admin to revoke an organizer", async () => {
      const asUniAdmin = await as(universityAdmin);
      await asUniAdmin.write.approveOrganizer([organizerAddr]);
      await viem.assertions.emitWithArgs(
        asUniAdmin.write.revokeOrganizer([organizerAddr]),
        contract, "OrganizerRevoked",
        [organizerAddr, uniAdminAddr],
      );
      assert.equal(await contract.read.hasRole([ISSUER_ROLE, organizerAddr]), false);
    });

    it("prevents stranger from approving and organizer", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(stranger)).write.approveOrganizer([organizerAddr]),
        contract, "AccessControlUnauthorizedAccount",
      );
    });

    it("reverts approveOrganizer with zero address", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(universityAdmin)).write.approveOrganizer([zeroAddress]),
        contract, "ZeroAddress",
      );
    });

    it("prevents a plain organizer from approving other organizers", async () => {
      await (await as(universityAdmin)).write.approveOrganizer([organizerAddr]);
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.approveOrganizer([strangerAddr]),
        contract, "AccessControlUnauthorizedAccount",
      );
    });
  })

  describe("3. Credential Type Registration", async () => {
    beforeEach(() => setupOrganizer());

    it("allows organizer to register a credential type and receives token ID 1", async () => {
      await viem.assertions.emitWithArgs(
        (await as(organizer)).write.registerCredentialType([SAMPLE_URI_1]),
        contract, "CredentialTypeRegistered",
        [1n, organizerAddr, SAMPLE_URI_1],
      );
    });

    it("auto-increments token IDs from 1", async () => {
      const id1 = await registerType(SAMPLE_URI_1);
      const id2 = await registerType(SAMPLE_URI_2);
      assert.equal(id1, 1n);
      assert.equal(id2, 2n);
    });

    it("ensures totalCredentialTypes reflects registered count", async () => {
      await registerType(SAMPLE_URI_1);
      await registerType(SAMPLE_URI_2);
      assert.equal(await contract.read.totalCredentialTypes(), 2n);
    })

    it("stores issuer address, URI, active flag, and timestamp", async () => {
      const tokenId = await registerType();
      const ct = await contract.read.getCredentialType([tokenId]);
      assert.equal(ct.issuer, organizerAddr);
      assert.equal(ct.metadataURI, SAMPLE_URI_1);
      assert.equal(ct.active, true);
      assert.ok(ct.registeredAt > 0n);
    });

    it("ensures uri() returns the correct IPFS URI for the token", async () => {
      const c = contract;
      const tokenId = await registerType(SAMPLE_URI_2, c);
      assert.equal(await c.read.uri([tokenId]), SAMPLE_URI_2);
    });

    it("reverts registration with a non-IPFS URI", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.registerCredentialType([INVALID_URI]),
        contract, "EmptyString",
      );
    });

    it("reverts registration with an empty string", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.registerCredentialType([""]),
        contract, "EmptyString",
      );
    });

    it("prevents non-issuer from registering a credential type", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(stranger)).write.registerCredentialType([SAMPLE_URI_1]),
        contract, "AccessControlUnauthorizedAccount",
      );
    });
  })
  describe("4. Single Credential Issuance", async () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await setupOrganizer();
      tokenId = await registerType();
    });

    it("organizer can issue a credential to a student", async () => {
      await viem.assertions.emitWithArgs(
        (await as(organizer)).write.issueCredential([tokenId, student1Addr]),
        contract, "CredentialIssued",
        [tokenId, student1Addr, organizerAddr],
      );
    });

    it("student balance is 1 after issuance", async () => {
      await (await as(organizer)).write.issueCredential([tokenId, student1Addr]);
      assert.equal(await contract.read.balanceOf([student1Addr, tokenId]), 1n);
    });

    it("hasCredential returns true for the student after issuance", async () => {
      await (await as(organizer)).write.issueCredential([tokenId, student1Addr]);
      assert.equal(await contract.read.hasCredential([tokenId, student1Addr]), true);
    });

    it("hasCredential returns false before issuance", async () => {
      assert.equal(await contract.read.hasCredential([tokenId, student1Addr]), false);
    });

    it("reverts when issuing to zero address", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.issueCredential([tokenId, zeroAddress]),
        contract, "ZeroAddress",
      );
    });

    it("reverts when issuing an already-held credential", async () => {
      const asOrganizer = await as(organizer);
      await asOrganizer.write.issueCredential([tokenId, student1Addr]);
      await viem.assertions.revertWithCustomError(
        asOrganizer.write.issueCredential([tokenId, student1Addr]),
        contract, "AlreadyIssued",
      );
    });

    it("reverts when issuing a non-existent token type", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.issueCredential([999n, student1Addr]),
        contract, "TokenIdNotFound",
      );
    });

    it("non-issuer cannot issue a credential", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(stranger)).write.issueCredential([tokenId, student1Addr]),
        contract, "AccessControlUnauthorizedAccount",
      );
    });
  });

  describe("5. Batch Credential Issuance", async () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await setupOrganizer();
      tokenId = await registerType();
    });

    it("organizer can batch issue to multiple students", async () => {
      const publicClient = await viem.getPublicClient();
      const hash = await (await as(organizer)).write.batchIssueCredential([
        tokenId,
        [student1Addr, student2Addr, student3Addr],
      ]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const issuedEvents = receipt.logs.filter((log: any) => {
        try {
          const e = decodeEventLog({ abi: contract.abi, data: log.data, topics: log.topics }) as { eventName: string; args: Record<string, unknown> };
          return e.eventName === "CredentialIssued";
        } catch { return false; }
      });
      assert.equal(issuedEvents.length, 3);
    });

    it("all recipients hold the credential after batch issue", async () => {
      await (await as(organizer)).write.batchIssueCredential([
        tokenId,
        [student1Addr, student2Addr, student3Addr],
      ]);
      assert.equal(await contract.read.hasCredential([tokenId, student1Addr]), true);
      assert.equal(await contract.read.hasCredential([tokenId, student2Addr]), true);
      assert.equal(await contract.read.hasCredential([tokenId, student3Addr]), true);
    });

    it("reverts atomically if any recipient already holds the credential", async () => {
      const asOrganizer = await as(organizer);
      await asOrganizer.write.issueCredential([tokenId, student2Addr]);

      await viem.assertions.revertWithCustomError(
        asOrganizer.write.batchIssueCredential([
          tokenId,
          [student1Addr, student2Addr, student3Addr],
        ]),
        contract, "AlreadyIssued",
      );
      // Atomicity check — student1 must NOT have received the credential
      assert.equal(await contract.read.hasCredential([tokenId, student1Addr]), false);
    });

    it("reverts batch issue with empty recipients array", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.batchIssueCredential([tokenId, []]),
        contract, "ZeroAddress",
      );
    });

    it("reverts batch issue if any recipient is zero address", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.batchIssueCredential([
          tokenId,
          [student1Addr, zeroAddress],
        ]),
        contract, "ZeroAddress",
      );
    });
  });

  describe("6. Credential Revocation", async () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await setupOrganizer();
      tokenId = await registerType();
      await (await as(organizer)).write.issueCredential([tokenId, student1Addr]);
    });

    it("original issuer can revoke a credential", async () => {
      await viem.assertions.emitWithArgs(
        (await as(organizer)).write.revokeCredential([tokenId, student1Addr, "Misconduct"]),
        contract, "CredentialRevoked",
        [tokenId, student1Addr, organizerAddr, "Misconduct"],
      );
    });

    it("university admin can revoke a credential from any organizer", async () => {
      await (await as(admin)).write.grantRole([UNIVERSITY_ADMIN_ROLE, uniAdminAddr]);
      await viem.assertions.emitWithArgs(
        (await as(universityAdmin)).write.revokeCredential([
          tokenId, student1Addr, "Academic misconduct",
        ]),
        contract, "CredentialRevoked",
        [tokenId, student1Addr, uniAdminAddr, "Academic misconduct"],
      );
    });

    it("student balance is 0 after revocation", async () => {
      await (await as(organizer)).write.revokeCredential([tokenId, student1Addr, "Test"]);
      assert.equal(await contract.read.balanceOf([student1Addr, tokenId]), 0n);
    });

    it("hasCredential returns false after revocation", async () => {
      await (await as(organizer)).write.revokeCredential([tokenId, student1Addr, "Test"]);
      assert.equal(await contract.read.hasCredential([tokenId, student1Addr]), false);
    });

    it("stranger cannot revoke a credential", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(stranger)).write.revokeCredential([tokenId, student1Addr, "Unauthorized"]),
        contract, "AccessControlUnauthorizedAccount",
      );
    });

    it("reverts revocation of a non-held credential", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.revokeCredential([tokenId, student2Addr, "Never issued"]),
        contract, "NotIssued",
      );
    });

    it("reverts revocation with empty reason", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.revokeCredential([tokenId, student1Addr, ""]),
        contract, "EmptyString",
      );
    });

    it("revoked credential is excluded from getStudentCredentials()", async () => {
      await (await as(organizer)).write.revokeCredential([tokenId, student1Addr, "Test"]);
      const credentials = await contract.read.getStudentCredentials([student1Addr]);
      assert.ok(!credentials.includes(tokenId));
    });
  });

  describe("7. Soulbound Token Transfers", async () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await setupOrganizer();
      tokenId = await registerType();
      await (await as(organizer)).write.issueCredential([tokenId, student1Addr]);
    });

    it("student cannot transfer their credential to another wallet", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(student1)).write.safeTransferFrom([
          student1Addr, student2Addr, tokenId, 1n, "0x",
        ]),
        contract, "SoulboundToken",
      );
    });

    it("even with approval, transfer is blocked", async () => {
      await (await as(student1)).write.setApprovalForAll([strangerAddr, true]);
      await viem.assertions.revertWithCustomError(
        (await as(stranger)).write.safeTransferFrom([
          student1Addr, student2Addr, tokenId, 1n, "0x",
        ]),
        contract, "SoulboundToken",
      );
    });

    it("batch transfer is also blocked", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(student1)).write.safeBatchTransferFrom([
          student1Addr, student2Addr, [tokenId], [1n], "0x",
        ]),
        contract, "SoulboundToken",
      );
    });
  });

  describe("8. Student Credential Portfolio", async () => {
    let tokenId1: bigint;
    let tokenId2: bigint;

    beforeEach(async () => {
      await setupOrganizer();
      tokenId1 = await registerType(SAMPLE_URI_1);
      tokenId2 = await registerType(SAMPLE_URI_2);
    });

    it("getStudentCredentials returns all held token IDs", async () => {
      const asOrganizer = await as(organizer);
      await asOrganizer.write.issueCredential([tokenId1, student1Addr]);
      await asOrganizer.write.issueCredential([tokenId2, student1Addr]);

      const credentials = await contract.read.getStudentCredentials([student1Addr]);
      assert.equal(credentials.length, 2);
      assert.ok(credentials.includes(tokenId1));
      assert.ok(credentials.includes(tokenId2));
    });

    it("getStudentCredentials returns empty array for student with no credentials", async () => {
      const credentials = await contract.read.getStudentCredentials([student1Addr]);
      assert.equal(credentials.length, 0);
    });

    it("getStudentCredentials excludes revoked credentials", async () => {
      const asOrganizer = await as(organizer);
      await asOrganizer.write.issueCredential([tokenId1, student1Addr]);
      await asOrganizer.write.issueCredential([tokenId2, student1Addr]);
      await asOrganizer.write.revokeCredential([tokenId1, student1Addr, "Test"]);

      const credentials = await contract.read.getStudentCredentials([student1Addr]);
      assert.equal(credentials.length, 1);
      assert.ok(credentials.includes(tokenId2));
    });
  });
  describe("9. Emergency Pause", async () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await setupOrganizer();
      tokenId = await registerType();
    });

    it("admin can pause the contract", async () => {
      await (await as(admin)).write.pause();
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.issueCredential([tokenId, student1Addr]),
        contract, "EnforcedPause",
      );
    });

    it("admin can unpause the contract", async () => {
      const asAdmin = await as(admin);
      await asAdmin.write.pause();
      await asAdmin.write.unpause();
      await viem.assertions.emit(
        (await as(organizer)).write.issueCredential([tokenId, student1Addr]),
        contract, "CredentialIssued",
      );
    });

    it("pause blocks registerCredentialType", async () => {
      await (await as(admin)).write.pause();
      await viem.assertions.revertWithCustomError(
        (await as(organizer)).write.registerCredentialType([SAMPLE_URI_2]),
        contract, "EnforcedPause",
      );
    });

    it("non-admin cannot pause", async () => {
      await viem.assertions.revertWithCustomError(
        (await as(stranger)).write.pause(),
        contract, "AccessControlUnauthorizedAccount",
      );
    });
  });

  describe("10. Interface Support (ERC-165)", async () => {
    it("supports ERC-1155 interface", async () => {
      assert.equal(await contract.read.supportsInterface(["0xd9b67a26"]), true);
    });

    it("supports AccessControl interface", async () => {
      assert.equal(await contract.read.supportsInterface(["0x7965db0b"]), true);
    });

    it("does not support random interface", async () => {
      assert.equal(await contract.read.supportsInterface(["0xdeadbeef"]), false);
    });
  });
});

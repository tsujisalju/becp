// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/hooks/useRole.test.ts
// Description      : Unit tests for the useRole hook.
//                    Verifies role resolution logic (student / organizer /
//                    university_admin) and loading state across all wallet
//                    connection scenarios without a live RPC.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Sunday, 15-Mar-2026

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { MOCK_ADDRESS, MOCK_CONTRACT, makeQueryClient, TestProviders } from "../test-utils";
import React from "react";

// ── Wagmi mock ────────────────────────────────────────────────────────────────
// We mock wagmi at the module level. Each test overrides useConnection and
// useReadContracts to control wallet state and on-chain role responses.

const mockUseConnection = vi.fn();
const mockUseReadContracts = vi.fn();
const mockUseChainId = vi.fn();

vi.mock("wagmi", () => ({
  useConnection: () => mockUseConnection(),
  useReadContracts: () => mockUseReadContracts(),
  useChainId: () => mockUseChainId(),
}));

// ── Shared package mock ───────────────────────────────────────────────────────
// getContractAddress throws when the chain has no deployment. We control this
// per-test by overriding the mock return.

vi.mock("@becp/shared/contract", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@becp/shared/contract")>();
  return {
    ...actual,
    getContractAddress: vi.fn(() => MOCK_CONTRACT),
  };
});

import { useRole } from "@/hooks/useRole";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeReadContractsResult(isDefaultAdmin: boolean, isUniversityAdmin: boolean, isIssuer: boolean) {
  return {
    data: [{ result: isDefaultAdmin }, { result: isUniversityAdmin }, { result: isIssuer }],
    isLoading: false,
    isError: false,
  };
}

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(TestProviders, { queryClient: makeQueryClient() }, children);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useRole", () => {
  beforeEach(() => {
    mockUseChainId.mockReturnValue(11155420); // OP Sepolia
    mockUseReadContracts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
  });

  describe("disconnected wallet", () => {
    it("returns student role and isConnected:false when wallet is not connected", () => {
      mockUseConnection.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
      });
      mockUseReadContracts.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("student");
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isStudent).toBe(true);
    });

    it("isLoading is true while wallet is reconnecting", () => {
      mockUseConnection.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isReconnecting: true,
      });
      mockUseReadContracts.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("isLoading is true while wallet is connecting", () => {
      mockUseConnection.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: true,
        isReconnecting: false,
      });
      mockUseReadContracts.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("connected wallet — role resolution", () => {
    beforeEach(() => {
      mockUseConnection.mockReturnValue({
        address: MOCK_ADDRESS,
        isConnected: true,
        isConnecting: false,
        isReconnecting: false,
      });
    });

    it("returns student when wallet holds no on-chain roles", () => {
      mockUseReadContracts.mockReturnValue(makeReadContractsResult(false, false, false));

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("student");
      expect(result.current.isStudent).toBe(true);
      expect(result.current.isOrganizer).toBe(false);
      expect(result.current.isUniversityAdmin).toBe(false);
    });

    it("returns organizer when wallet holds ISSUER_ROLE only", () => {
      mockUseReadContracts.mockReturnValue(makeReadContractsResult(false, false, true));

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("organizer");
      expect(result.current.isOrganizer).toBe(true);
      expect(result.current.isStudent).toBe(false);
      expect(result.current.isUniversityAdmin).toBe(false);
    });

    it("returns university_admin when wallet holds UNIVERSITY_ADMIN_ROLE", () => {
      mockUseReadContracts.mockReturnValue(makeReadContractsResult(false, true, false));

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("university_admin");
      expect(result.current.isUniversityAdmin).toBe(true);
      expect(result.current.isOrganizer).toBe(false);
    });

    it("returns university_admin when wallet holds DEFAULT_ADMIN_ROLE", () => {
      mockUseReadContracts.mockReturnValue(makeReadContractsResult(true, false, false));

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("university_admin");
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isUniversityAdmin).toBe(true);
    });

    it("university_admin takes precedence over organizer when wallet holds both roles", () => {
      // A wallet with both UNIVERSITY_ADMIN_ROLE and ISSUER_ROLE should resolve
      // as university_admin only — no dual role exposure.
      mockUseReadContracts.mockReturnValue(makeReadContractsResult(false, true, true));

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("university_admin");
      // isOrganizer should be false because admin takes precedence
      expect(result.current.isOrganizer).toBe(false);
      expect(result.current.isUniversityAdmin).toBe(true);
    });

    it("isLoading is true while contract reads are in flight", () => {
      mockUseReadContracts.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("falls back to student when contract reads return undefined data", () => {
      mockUseReadContracts.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("student");
    });
  });

  describe("unsupported chain", () => {
    it("falls back to student role when getContractAddress throws", async () => {
      const { getContractAddress } = await import("@becp/shared/contract");
      vi.mocked(getContractAddress).mockImplementationOnce(() => {
        throw new Error("No contract address configured for chain 1");
      });

      mockUseConnection.mockReturnValue({
        address: MOCK_ADDRESS,
        isConnected: true,
        isConnecting: false,
        isReconnecting: false,
      });
      mockUseReadContracts.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => useRole(), { wrapper });

      expect(result.current.role).toBe("student");
    });
  });
});

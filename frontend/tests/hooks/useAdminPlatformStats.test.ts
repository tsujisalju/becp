// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/hooks/useAdminPlatformStats.test.ts
// Description      : Unit tests for the useAdminPlatformStats hook.
//                    Verifies the aggregation pipeline:
//                      1. totalCredentialTypes() → N (useReadContract)
//                      2. totalSupply(1..N) batch → per-type counts (useReadContracts)
//                      3. paused() state (useReadContract)
//                      4. organizer request counts from off-chain store (via MSW)
//                    Uses mockImplementation dispatching on functionName to handle
//                    the two separate useReadContract calls in the hook.
// First Written on : Friday, 10-Apr-2026
// Last Written on  : Friday, 10-Apr-2026

import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MOCK_CONTRACT, makeQueryClient, TestProviders } from "../test-utils";
import React from "react";
import { useAdminPlatformStats } from "@/hooks/useAdminPlatformStats";
import type { OrganizerRequest } from "@/hooks/useOrganizerRequests";

// ── Wagmi mock ────────────────────────────────────────────────────────────────
// useAdminPlatformStats makes two separate useReadContract calls (totalCredentialTypes
// and paused), so we pass the config through to dispatch on functionName.

const mockUseReadContract = vi.fn();
const mockUseReadContracts = vi.fn();
const mockUseChainId = vi.fn();

vi.mock("wagmi", () => ({
  useReadContract: (config: unknown) => mockUseReadContract(config),
  useReadContracts: (config: unknown) => mockUseReadContracts(config),
  useChainId: () => mockUseChainId(),
}));

vi.mock("@becp/shared/contract", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@becp/shared/contract")>();
  return { ...actual, getContractAddress: vi.fn(() => MOCK_CONTRACT) };
});

// ── MSW server for organizer requests ────────────────────────────────────────

const BASE_REQUESTS: OrganizerRequest[] = [
  {
    address: "0xAAA0000000000000000000000000000000000001",
    displayName: "Alice",
    organization: "Alpha Club",
    reason: "Hackathons",
    requestedAt: "2026-03-01T10:00:00Z",
    status: "approved",
  },
  {
    address: "0xBBB0000000000000000000000000000000000002",
    displayName: "Bob",
    organization: "Beta Society",
    reason: "Workshops",
    requestedAt: "2026-02-15T09:00:00Z",
    status: "pending",
  },
  {
    address: "0xCCC0000000000000000000000000000000000003",
    displayName: "Carol",
    organization: "Gamma Guild",
    reason: "Talks",
    requestedAt: "2026-03-20T11:00:00Z",
    status: "pending",
  },
];

const server = setupServer(
  http.get("/api/organizer-request", () => HttpResponse.json(BASE_REQUESTS)),
);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Helpers ───────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(TestProviders, { queryClient: makeQueryClient() }, children);
}

function setupContractMocks({
  total = 3n,
  supplies = [10n, 5n, 3n],
  paused = false,
  totalLoading = false,
  totalError = false,
  supplyLoading = false,
  supplyError = false,
  pausedLoading = false,
}: {
  total?: bigint;
  supplies?: bigint[];
  paused?: boolean;
  totalLoading?: boolean;
  totalError?: boolean;
  supplyLoading?: boolean;
  supplyError?: boolean;
  pausedLoading?: boolean;
} = {}) {
  mockUseChainId.mockReturnValue(11155420);

  mockUseReadContract.mockImplementation((config: { functionName?: string }) => {
    if (config?.functionName === "totalCredentialTypes") {
      return { data: totalError || totalLoading ? undefined : total, isLoading: totalLoading, isError: totalError };
    }
    if (config?.functionName === "paused") {
      return { data: pausedLoading ? undefined : paused, isLoading: pausedLoading, isError: false };
    }
    return { data: undefined, isLoading: false, isError: false };
  });

  mockUseReadContracts.mockReturnValue({
    data: supplyLoading || supplyError ? undefined : supplies.map((s) => ({ status: "success" as const, result: s })),
    isLoading: supplyLoading,
    isError: supplyError,
    refetch: vi.fn(),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useAdminPlatformStats", () => {
  beforeEach(() => {
    setupContractMocks();
  });

  describe("loading states", () => {
    it("isLoading is true while totalCredentialTypes is fetching", () => {
      setupContractMocks({ totalLoading: true });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("isLoading is true while totalSupply batch is fetching", () => {
      setupContractMocks({ supplyLoading: true });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("isLoading is true while paused state is fetching", () => {
      setupContractMocks({ pausedLoading: true });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("error states", () => {
    it("isError is true when totalCredentialTypes read fails", () => {
      setupContractMocks({ totalError: true });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isError).toBe(true);
    });

    it("isError is true when totalSupply batch read fails", () => {
      setupContractMocks({ supplyError: true });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isError).toBe(true);
    });
  });

  describe("contract-derived stats", () => {
    it("totalTypes reflects the totalCredentialTypes result", async () => {
      setupContractMocks({ total: 7n, supplies: new Array(7).fill(1n) });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.totalTypes).toBe(7);
    });

    it("totalIssued is the sum of all totalSupply results", async () => {
      setupContractMocks({ total: 3n, supplies: [10n, 5n, 3n] });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.totalIssued).toBe(18n);
    });

    it("totalIssued is 0n when no credential types are registered", () => {
      setupContractMocks({ total: 0n, supplies: [] });
      mockUseReadContracts.mockReturnValue({ data: undefined, isLoading: false, isError: false, refetch: vi.fn() });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.totalIssued).toBe(0n);
    });

    it("totalIssued skips failed supply reads and only sums successes", async () => {
      setupContractMocks({ total: 3n });
      mockUseReadContracts.mockReturnValue({
        data: [
          { status: "success", result: 10n },
          { status: "failure", result: undefined },
          { status: "success", result: 4n },
        ],
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.totalIssued).toBe(14n);
    });

    it("isPaused is true when the contract is paused", () => {
      setupContractMocks({ paused: true });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isPaused).toBe(true);
    });

    it("isPaused is false when the contract is active", () => {
      setupContractMocks({ paused: false });
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe("organizer counts from off-chain store", () => {
    it("activeOrganizers reflects the number of approved requests", async () => {
      // BASE_REQUESTS: 1 approved, 2 pending
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.activeOrganizers).toBe(1);
    });

    it("pendingApprovals reflects the number of pending requests", async () => {
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.pendingApprovals).toBe(2);
    });

    it("activeOrganizers is 0 when no requests are approved", async () => {
      server.use(
        http.get("/api/organizer-request", () =>
          HttpResponse.json(BASE_REQUESTS.map((r) => ({ ...r, status: "pending" }))),
        ),
      );
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.activeOrganizers).toBe(0);
    });

    it("pendingApprovals is 0 when all requests are approved", async () => {
      server.use(
        http.get("/api/organizer-request", () =>
          HttpResponse.json(BASE_REQUESTS.map((r) => ({ ...r, status: "approved" }))),
        ),
      );
      const { result } = renderHook(() => useAdminPlatformStats(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.pendingApprovals).toBe(0);
    });
  });
});

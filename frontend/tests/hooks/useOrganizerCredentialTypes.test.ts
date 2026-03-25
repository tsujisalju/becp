// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/hooks/useOrganizerCredentialTypes.test.ts
// Description      : Unit tests for the useOrganizerCredentialTypes hook.
//                    Verifies the full multi-step data pipeline:
//                      1. totalCredentialTypes() → token ID range
//                      2. getCredentialType(id) batch read → filter by issuer
//                      3. totalSupply(id) batch read → issuedCount per type
//                      4. IPFS metadata fetch via MSW → hydrated credential types
//                    Also tests aggregate stat computation and loading/error states.
// First Written on : Tuesday, 24-Mar-2026
// Last Written on  : Wednesday, 25-Mar-2026

import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MOCK_ADDRESS, MOCK_ADDRESS_2, MOCK_CONTRACT, makeQueryClient, TestProviders } from "../test-utils";
import React from "react";
import { useOrganizerCredentialTypes } from "@/hooks/useOrganizerCredentialTypes";

// ── Wagmi mock ────────────────────────────────────────────────────────────────

const mockUseConnection = vi.fn();
const mockUseReadContract = vi.fn();
const mockUseReadContracts = vi.fn();
const mockUseChainId = vi.fn();

vi.mock("wagmi", () => ({
  useConnection: () => mockUseConnection(),
  useReadContract: () => mockUseReadContract(),
  useReadContracts: (config: unknown) => mockUseReadContracts(config),
  useChainId: () => mockUseChainId(),
}));

vi.mock("@becp/shared/contract", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@becp/shared/contract")>();
  return { ...actual, getContractAddress: vi.fn(() => MOCK_CONTRACT) };
});

// ── IPFS MSW server ───────────────────────────────────────────────────────────

const MOCK_METADATA_URI = "ipfs://QmTestCredentialTypeMetadata";
const MOCK_METADATA_URL = `https://gateway.pinata.cloud/ipfs/QmTestCredentialTypeMetadata`;

const MOCK_METADATA = {
  name: "DevMatch 2024 Hackathon",
  description: "24-hour hackathon credential",
  image: "ipfs://QmBadgeImage",
  achievementType: "Extracurricular",
  criteria: { narrative: "Place in top 3 teams" },
  becp_version: "1.0.0",
  becp_issuer_name: "APUBCC",
  becp_issuer_address: MOCK_ADDRESS,
  becp_activity_date: "2024-11-14",
  becp_activity_category: "hackathon",
  becp_activity_duration_hours: 24,
  becp_soulbound: true,
  becp_skills: [
    { id: "fullstack-dev", label: "Full-Stack Development", category: "technical", weight: 8 },
    { id: "problem-solving", label: "Problem Solving", category: "soft", weight: 8 },
  ],
};

const server = setupServer(http.get(MOCK_METADATA_URL, () => HttpResponse.json(MOCK_METADATA)));

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCredentialTypeResult(
  issuer: `0x${string}`,
  metadataURI = MOCK_METADATA_URI,
  active = true,
  registeredAt = BigInt(1700000000),
) {
  return {
    status: "success" as const,
    result: { issuer, metadataURI, active, registeredAt },
  };
}

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(TestProviders, { queryClient: makeQueryClient() }, children);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useOrganizerCredentialTypes", () => {
  beforeEach(() => {
    mockUseChainId.mockReturnValue(11155420);
    mockUseConnection.mockReturnValue({ address: MOCK_ADDRESS });
    // Default: contract has 0 types registered
    mockUseReadContract.mockReturnValue({ data: 0n, isLoading: false, isError: false, refetch: vi.fn() });
    mockUseReadContracts.mockReturnValue({ data: undefined, isLoading: false, isError: false, refetch: vi.fn() });
  });

  describe("loading states", () => {
    it("isLoading is true while totalCredentialTypes is in flight", () => {
      mockUseReadContract.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: vi.fn() });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("isLoading is true while getCredentialType batch reads are in flight", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: vi.fn() });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("returns empty credential types and zero stats when contract has no registered types", () => {
      mockUseReadContract.mockReturnValue({ data: 0n, isLoading: false, isError: false, refetch: vi.fn() });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.credentialTypes).toHaveLength(0);
      expect(result.current.stats.totalTypes).toBe(0);
      expect(result.current.stats.totalIssued).toBe(0n);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("error states", () => {
    it("isError is true when totalCredentialTypes read fails", () => {
      mockUseReadContract.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: vi.fn() });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.isError).toBe(true);
    });

    it("isError is true when getCredentialType batch read fails", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: vi.fn() });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.isError).toBe(true);
    });
  });

  describe("issuer filtering", () => {
    it("returns only credential types where issuer matches the connected wallet", () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      // Token 1 belongs to MOCK_ADDRESS, token 2 belongs to a different wallet
      mockUseReadContracts
        .mockReturnValueOnce({
          data: [makeCredentialTypeResult(MOCK_ADDRESS), makeCredentialTypeResult(MOCK_ADDRESS_2)],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        })
        // Supply read for the one owned type
        .mockReturnValue({
          data: [{ status: "success", result: 5n }],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.credentialTypes).toHaveLength(1);
      expect(result.current.credentialTypes[0].issuer).toBe(MOCK_ADDRESS);
    });

    it("returns empty list when no credential types belong to connected wallet", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts.mockReturnValue({
        data: [makeCredentialTypeResult(MOCK_ADDRESS_2)],
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.credentialTypes).toHaveLength(0);
    });

    it("performs issuer comparison case-insensitively", () => {
      const upperAddress = MOCK_ADDRESS.toUpperCase() as `0x${string}`;
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts
        .mockReturnValueOnce({
          data: [makeCredentialTypeResult(upperAddress)],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        })
        .mockReturnValue({
          data: [{ status: "success", result: 0n }],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.credentialTypes).toHaveLength(1);
    });
  });

  describe("issuedCount from totalSupply", () => {
    it("attaches issuedCount from totalSupply read to each credential type", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts
        .mockReturnValueOnce({
          data: [makeCredentialTypeResult(MOCK_ADDRESS)],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        })
        .mockReturnValue({
          data: [{ status: "success", result: 42n }],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.credentialTypes[0].issuedCount).toBe(42n);
    });

    it("defaults issuedCount to 0n when totalSupply read result is not success", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts
        .mockReturnValueOnce({
          data: [makeCredentialTypeResult(MOCK_ADDRESS)],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        })
        .mockReturnValue({
          data: [{ status: "failure", result: undefined }],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.credentialTypes[0].issuedCount).toBe(0n);
    });
  });

  describe("aggregate stats", () => {
    it("computes totalTypes, activeTypes and totalIssued from owned credential types", () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      mockUseReadContracts
        .mockReturnValueOnce({
          data: [
            makeCredentialTypeResult(MOCK_ADDRESS, MOCK_METADATA_URI, true),
            makeCredentialTypeResult(MOCK_ADDRESS, MOCK_METADATA_URI, false), // inactive
          ],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        })
        .mockReturnValue({
          data: [
            { status: "success", result: 10n },
            { status: "success", result: 5n },
          ],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        });

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      expect(result.current.stats.totalTypes).toBe(2);
      expect(result.current.stats.activeTypes).toBe(1);
      expect(result.current.stats.totalIssued).toBe(15n);
    });
  });

  describe("IPFS metadata hydration", () => {
    // Both tests need useReadContracts to consistently return the right data for
    // BOTH calls the hook makes (getCredentialType batch AND totalSupply batch)
    // across all re-renders. mockReturnValueOnce desynchronises when the hook
    // re-renders: the credential type result is consumed and replaced by the
    // supply result on subsequent renders, emptying ownedTypes and making
    // credentialTypes[0] undefined. Instead we inspect the contracts array to
    // determine which batch call is being made and return the appropriate data.
    function setupContractMocks(issuer: `0x${string}` = MOCK_ADDRESS) {
      mockUseReadContracts.mockImplementation(({ contracts }: { contracts?: { functionName?: string }[] }) => {
        if (!contracts?.length) return { data: undefined, isLoading: false, isError: false, refetch: vi.fn() };
        const fn = contracts[0]?.functionName;
        if (fn === "getCredentialType") {
          return {
            data: [makeCredentialTypeResult(issuer, MOCK_METADATA_URI)],
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
          };
        }
        // totalSupply call
        return {
          data: [{ status: "success", result: 3n }],
          isLoading: false,
          isError: false,
          refetch: vi.fn(),
        };
      });
    }

    it("fetches and attaches IPFS metadata for owned credential types", async () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      setupContractMocks();

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      await waitFor(() => expect(result.current.credentialTypes[0]?.metadata).not.toBeNull(), { timeout: 5000 });

      const meta = result.current.credentialTypes[0].metadata;
      expect(meta?.name).toBe("DevMatch 2024 Hackathon");
      expect(meta?.becp_activity_category).toBe("hackathon");
      expect(meta?.becp_skills).toHaveLength(2);
    });

    it("sets metadata to null and isMetadataLoading to false when IPFS fetch fails", async () => {
      server.use(http.get(MOCK_METADATA_URL, () => HttpResponse.json({ error: "Not found" }, { status: 404 })));

      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      setupContractMocks();

      const { result } = renderHook(() => useOrganizerCredentialTypes(), { wrapper });

      // Wait for ownedTypes to populate (credentialTypes[0] exists), then wait
      // for the metadata query to settle after exhausting its retries (retry: 2
      // in the hook) — isMetadataLoading becomes false when TanStack Query
      // reaches error status.
      await waitFor(
        () => {
          const ct = result.current.credentialTypes[0];
          expect(ct).toBeDefined();
          expect(ct.isMetadataLoading).toBe(false);
        },
        { timeout: 15000 },
      );

      expect(result.current.credentialTypes[0].metadata).toBeNull();
    });
  });
});

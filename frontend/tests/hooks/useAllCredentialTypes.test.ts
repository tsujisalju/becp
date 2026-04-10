// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/hooks/useAllCredentialTypes.test.ts
// Description      : Unit tests for the useAllCredentialTypes hook (student events marketplace).
//                    Verifies the full multi-step pipeline:
//                      1. totalCredentialTypes() → token ID range
//                      2. getCredentialType(id) batch → filter to active: true only
//                      3. totalSupply(id) batch → issuedCount per active type
//                      4. hasCredential(id, address) batch → isEarned flag (wallet-optional)
//                      5. useQueries → IPFS metadata fetch per active type
//                    Also tests aggregate stats and the isEarned/disconnected wallet cases.
// First Written on : Friday, 10-Apr-2026
// Last Written on  : Friday, 10-Apr-2026

import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MOCK_ADDRESS, MOCK_ADDRESS_2, MOCK_CONTRACT, makeQueryClient, TestProviders } from "../test-utils";
import React from "react";
import { useAllCredentialTypes } from "@/hooks/useAllCredentialTypes";

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

// ── IPFS metadata fixtures ────────────────────────────────────────────────────

const META_URI_1 = "ipfs://QmEventTypeMetadata1";
const META_URL_1 = "https://gateway.pinata.cloud/ipfs/QmEventTypeMetadata1";

const META_URI_2 = "ipfs://QmEventTypeMetadata2";
const META_URL_2 = "https://gateway.pinata.cloud/ipfs/QmEventTypeMetadata2";

const METADATA_1 = {
  name: "DevMatch 2024 Hackathon",
  description: "24-hour hackathon",
  image: "ipfs://QmBadge1",
  achievementType: "Extracurricular",
  criteria: { narrative: "Place in top 3" },
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

const METADATA_2 = {
  name: "Web3 Workshop",
  description: "Intro to blockchain",
  image: "ipfs://QmBadge2",
  achievementType: "Extracurricular",
  criteria: { narrative: "Complete workshop" },
  becp_version: "1.0.0",
  becp_issuer_name: "APU Tech Club",
  becp_issuer_address: MOCK_ADDRESS_2,
  becp_activity_date: "2025-01-20",
  becp_activity_category: "workshop",
  becp_activity_duration_hours: 4,
  becp_soulbound: true,
  becp_skills: [
    { id: "blockchain-dev", label: "Blockchain Development", category: "technical", weight: 9 },
  ],
};

// ── MSW server ────────────────────────────────────────────────────────────────

const server = setupServer(
  http.get(META_URL_1, () => HttpResponse.json(METADATA_1)),
  http.get(META_URL_2, () => HttpResponse.json(METADATA_2)),
);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Helpers ───────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(TestProviders, { queryClient: makeQueryClient() }, children);
}

function makeCredentialTypeResult(
  issuer: `0x${string}`,
  metadataURI: string,
  active = true,
  registeredAt = 1700000000n,
) {
  return {
    status: "success" as const,
    result: { issuer, metadataURI, active, registeredAt },
  };
}

// Sets up useReadContracts to dispatch by functionName across all three
// batch calls in the hook (getCredentialType, totalSupply, hasCredential).
function setupReadContracts({
  credentialTypes = [makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1)],
  supplies = [5n],
  earnedFlags = [false],
  typesLoading = false,
  typesError = false,
}: {
  credentialTypes?: ReturnType<typeof makeCredentialTypeResult>[];
  supplies?: bigint[];
  earnedFlags?: boolean[];
  typesLoading?: boolean;
  typesError?: boolean;
} = {}) {
  mockUseReadContracts.mockImplementation((config: { contracts?: { functionName?: string }[] }) => {
    if (!config?.contracts?.length) return { data: undefined, isLoading: false, isError: false, refetch: vi.fn() };
    const fn = config.contracts[0]?.functionName;

    if (fn === "getCredentialType") {
      return { data: credentialTypes, isLoading: typesLoading, isError: typesError, refetch: vi.fn() };
    }
    if (fn === "totalSupply") {
      return {
        data: supplies.map((s) => ({ status: "success" as const, result: s })),
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      };
    }
    if (fn === "hasCredential") {
      return {
        data: earnedFlags.map((e) => ({ status: "success" as const, result: e })),
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      };
    }
    return { data: undefined, isLoading: false, isError: false, refetch: vi.fn() };
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useAllCredentialTypes", () => {
  beforeEach(() => {
    mockUseChainId.mockReturnValue(11155420);
    mockUseConnection.mockReturnValue({ address: MOCK_ADDRESS });
    mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
    setupReadContracts();
  });

  describe("loading states", () => {
    it("isLoading is true while totalCredentialTypes is fetching", () => {
      mockUseReadContract.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: vi.fn() });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("isLoading is true while getCredentialType batch is fetching", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({ typesLoading: true });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("returns empty events when there are no credential types registered", () => {
      mockUseReadContract.mockReturnValue({ data: 0n, isLoading: false, isError: false, refetch: vi.fn() });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("error states", () => {
    it("isError is true when totalCredentialTypes read fails", () => {
      mockUseReadContract.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: vi.fn() });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.isError).toBe(true);
    });

    it("isError is true when getCredentialType batch read fails", () => {
      mockUseReadContract.mockReturnValue({ data: 1n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({ typesError: true });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.isError).toBe(true);
    });
  });

  describe("active type filtering", () => {
    it("returns only credential types where active is true", () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({
        credentialTypes: [
          makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1, true),
          makeCredentialTypeResult(MOCK_ADDRESS_2, META_URI_2, false), // inactive
        ],
        supplies: [5n], // only for the one active type
        earnedFlags: [false],
      });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].active).toBe(true);
    });

    it("returns empty events when all registered types are inactive", () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({
        credentialTypes: [
          makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1, false),
          makeCredentialTypeResult(MOCK_ADDRESS_2, META_URI_2, false),
        ],
        supplies: [],
        earnedFlags: [],
      });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events).toHaveLength(0);
    });
  });

  describe("issuedCount from totalSupply", () => {
    it("attaches issuedCount from the totalSupply batch result", () => {
      setupReadContracts({ supplies: [42n], earnedFlags: [false] });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events[0].issuedCount).toBe(42n);
    });

    it("defaults issuedCount to 0n when the supply read returns failure", () => {
      mockUseReadContracts.mockImplementation((config: { contracts?: { functionName?: string }[] }) => {
        const fn = config?.contracts?.[0]?.functionName;
        if (fn === "getCredentialType") {
          return { data: [makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1)], isLoading: false, isError: false, refetch: vi.fn() };
        }
        if (fn === "totalSupply") {
          return { data: [{ status: "failure", result: undefined }], isLoading: false, isError: false, refetch: vi.fn() };
        }
        if (fn === "hasCredential") {
          return { data: [{ status: "success", result: false }], isLoading: false, isError: false, refetch: vi.fn() };
        }
        return { data: undefined, isLoading: false, isError: false, refetch: vi.fn() };
      });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events[0].issuedCount).toBe(0n);
    });
  });

  describe("isEarned flag", () => {
    it("isEarned is true when hasCredential returns true for the connected wallet", () => {
      setupReadContracts({ earnedFlags: [true] });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events[0].isEarned).toBe(true);
    });

    it("isEarned is false when hasCredential returns false", () => {
      setupReadContracts({ earnedFlags: [false] });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events[0].isEarned).toBe(false);
    });

    it("isEarned is false when no wallet is connected (hasCredential query disabled)", () => {
      mockUseConnection.mockReturnValue({ address: undefined });
      setupReadContracts({ earnedFlags: [] });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.events[0].isEarned).toBe(false);
    });
  });

  describe("IPFS metadata hydration", () => {
    it("fetches and attaches metadata for each active credential type", async () => {
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      await waitFor(() => expect(result.current.events[0]?.metadata).not.toBeNull(), { timeout: 5000 });
      expect(result.current.events[0].metadata?.name).toBe("DevMatch 2024 Hackathon");
      expect(result.current.events[0].metadata?.becp_activity_category).toBe("hackathon");
    });

    it("hydrates metadata for two active types independently", async () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({
        credentialTypes: [
          makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1),
          makeCredentialTypeResult(MOCK_ADDRESS_2, META_URI_2),
        ],
        supplies: [5n, 2n],
        earnedFlags: [false, false],
      });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      await waitFor(
        () => expect(result.current.events.filter((e) => e.metadata !== null)).toHaveLength(2),
        { timeout: 5000 },
      );
      expect(result.current.events[0].metadata?.name).toBe("DevMatch 2024 Hackathon");
      expect(result.current.events[1].metadata?.name).toBe("Web3 Workshop");
    });

    it("sets metadata to null when IPFS fetch fails", async () => {
      server.use(http.get(META_URL_1, () => HttpResponse.json({ error: "not found" }, { status: 404 })));
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      await waitFor(
        () => {
          const ev = result.current.events[0];
          expect(ev).toBeDefined();
          expect(ev.isMetadataLoading).toBe(false);
        },
        { timeout: 15000 },
      );
      expect(result.current.events[0].metadata).toBeNull();
    });
  });

  describe("aggregate stats", () => {
    it("totalEvents equals the number of active credential types", () => {
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.stats.totalEvents).toBe(1);
    });

    it("categoryCount counts distinct categories from loaded metadata", async () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({
        credentialTypes: [
          makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1),
          makeCredentialTypeResult(MOCK_ADDRESS_2, META_URI_2),
        ],
        supplies: [5n, 2n],
        earnedFlags: [false, false],
      });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      // metadata_1: hackathon, metadata_2: workshop → 2 distinct categories
      await waitFor(
        () => expect(result.current.events.filter((e) => e.metadata !== null)).toHaveLength(2),
        { timeout: 5000 },
      );
      expect(result.current.stats.categoryCount).toBe(2);
    });

    it("totalSkillsAvailable counts distinct skill IDs across all active types", async () => {
      mockUseReadContract.mockReturnValue({ data: 2n, isLoading: false, isError: false, refetch: vi.fn() });
      setupReadContracts({
        credentialTypes: [
          makeCredentialTypeResult(MOCK_ADDRESS, META_URI_1),
          makeCredentialTypeResult(MOCK_ADDRESS_2, META_URI_2),
        ],
        supplies: [5n, 2n],
        earnedFlags: [false, false],
      });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      // metadata_1 skills: fullstack-dev, problem-solving
      // metadata_2 skills: blockchain-dev
      // Total unique: 3
      await waitFor(
        () => expect(result.current.events.filter((e) => e.metadata !== null)).toHaveLength(2),
        { timeout: 5000 },
      );
      expect(result.current.stats.totalSkillsAvailable).toBe(3);
    });

    it("stats are zero when there are no active events", () => {
      mockUseReadContract.mockReturnValue({ data: 0n, isLoading: false, isError: false, refetch: vi.fn() });
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(result.current.stats.totalEvents).toBe(0);
      expect(result.current.stats.categoryCount).toBe(0);
      expect(result.current.stats.totalSkillsAvailable).toBe(0);
    });
  });

  describe("refetch", () => {
    it("exposes a refetch function", () => {
      const { result } = renderHook(() => useAllCredentialTypes(), { wrapper });
      expect(typeof result.current.refetch).toBe("function");
    });
  });
});

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/hooks/useOrganizerRequests.test.ts
// Description      : Unit tests for the useOrganizerRequests hook.
//                    Verifies the off-chain fetch pipeline:
//                      1. GET /api/organizer-request → OrganizerRequest[]
//                      2. Filter into pending, approved sub-arrays
//                    MSW intercepts the API route. No wagmi dependency.
// First Written on : Friday, 10-Apr-2026
// Last Written on  : Friday, 10-Apr-2026

import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { makeQueryClient, TestProviders } from "../test-utils";
import React from "react";
import { useOrganizerRequests, type OrganizerRequest } from "@/hooks/useOrganizerRequests";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_REQUESTS: OrganizerRequest[] = [
  {
    address: "0xAAA0000000000000000000000000000000000001",
    displayName: "Alice",
    organization: "Alpha Club",
    reason: "I organise hackathons",
    requestedAt: "2026-03-01T10:00:00Z",
    status: "pending",
  },
  {
    address: "0xBBB0000000000000000000000000000000000002",
    displayName: "Bob",
    organization: "Beta Society",
    reason: "Annual workshop series",
    requestedAt: "2026-02-15T09:00:00Z",
    status: "approved",
  },
  {
    address: "0xCCC0000000000000000000000000000000000003",
    displayName: "Carol",
    organization: "Gamma Guild",
    reason: "Events manager",
    requestedAt: "2026-01-10T08:00:00Z",
    status: "rejected",
  },
  {
    address: "0xDDD0000000000000000000000000000000000004",
    displayName: "Dave",
    organization: "Delta Forum",
    reason: "Tech talks",
    requestedAt: "2026-03-20T11:00:00Z",
    status: "pending",
  },
];

// ── MSW server ────────────────────────────────────────────────────────────────

const server = setupServer(
  http.get("/api/organizer-request", () => HttpResponse.json(MOCK_REQUESTS)),
);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Helpers ───────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(TestProviders, { queryClient: makeQueryClient() }, children);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useOrganizerRequests", () => {
  describe("loading state", () => {
    it("isLoading is true before the first fetch completes", () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("isLoading settles to false after a successful fetch", async () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });

  describe("error state", () => {
    it("isError is true when the API returns a non-ok response", async () => {
      server.use(http.get("/api/organizer-request", () => HttpResponse.json({ error: "Server error" }, { status: 500 })));
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(true);
    });

    it("all arrays default to empty on error", async () => {
      server.use(http.get("/api/organizer-request", () => HttpResponse.json({ error: "Server error" }, { status: 500 })));
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.all).toHaveLength(0);
      expect(result.current.pending).toHaveLength(0);
      expect(result.current.approved).toHaveLength(0);
    });
  });

  describe("successful fetch — all array", () => {
    it("returns all requests in the all array regardless of status", async () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.all).toHaveLength(4);
    });

    it("returns empty arrays when no requests exist", async () => {
      server.use(http.get("/api/organizer-request", () => HttpResponse.json([])));
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.all).toHaveLength(0);
      expect(result.current.pending).toHaveLength(0);
      expect(result.current.approved).toHaveLength(0);
    });
  });

  describe("filtering by status", () => {
    it("pending contains only requests with status 'pending'", async () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.pending).toHaveLength(2);
      expect(result.current.pending.every((r) => r.status === "pending")).toBe(true);
    });

    it("approved contains only requests with status 'approved'", async () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.approved).toHaveLength(1);
      expect(result.current.approved[0].displayName).toBe("Bob");
    });

    it("rejected requests do not appear in pending or approved", async () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const listedAddresses = [...result.current.pending, ...result.current.approved].map((r) => r.displayName);
      expect(listedAddresses).not.toContain("Carol");
    });

    it("pending is empty when all requests are approved", async () => {
      server.use(
        http.get("/api/organizer-request", () =>
          HttpResponse.json(MOCK_REQUESTS.map((r) => ({ ...r, status: "approved" }))),
        ),
      );
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.pending).toHaveLength(0);
      expect(result.current.approved).toHaveLength(4);
    });
  });

  describe("refetch", () => {
    it("exposes a refetch function", async () => {
      const { result } = renderHook(() => useOrganizerRequests(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(typeof result.current.refetch).toBe("function");
    });
  });
});

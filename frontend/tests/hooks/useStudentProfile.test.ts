// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/hooks/useStudentProfile.test.ts
// Description      : Unit tests for the useStudentProfile hook.
//                    Uses MSW to intercept /api/profile/:address fetch calls,
//                    verifying loading states, cache updates after saveProfile,
//                    and displayName fallback behaviour.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Sunday, 15-Mar-2026

import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MOCK_ADDRESS, makeQueryClient, TestProviders } from "../test-utils";
import React from "react";

// ── Wagmi mock ────────────────────────────────────────────────────────────────

const mockUseConnection = vi.fn();

vi.mock("wagmi", () => ({
  useConnection: () => mockUseConnection(),
}));

// ── MSW server ────────────────────────────────────────────────────────────────

const PROFILE_URL = `/api/profile/${MOCK_ADDRESS.toLowerCase()}`;

const MOCK_PROFILE = {
  address: MOCK_ADDRESS.toLowerCase(),
  displayName: "Qayyum",
  bio: "Software engineering student",
  careerGoal: "Blockchain Developer",
  createdAt: "2026-03-14T00:00:00.000Z",
  updatedAt: "2026-03-14T00:00:00.000Z",
};

const server = setupServer(
  http.get(PROFILE_URL, () => HttpResponse.json(MOCK_PROFILE)),
  http.put(PROFILE_URL, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      ...MOCK_PROFILE,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Helpers ───────────────────────────────────────────────────────────────────

import { useStudentProfile } from "@/hooks/useStudentProfile";

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(TestProviders, { queryClient: makeQueryClient() }, children);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useStudentProfile", () => {
  describe("disconnected wallet", () => {
    it("does not fetch and returns undefined profile when address is not available", () => {
      mockUseConnection.mockReturnValue({ address: undefined });

      const { result } = renderHook(() => useStudentProfile(), { wrapper });

      expect(result.current.profile).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("connected wallet", () => {
    beforeEach(() => {
      mockUseConnection.mockReturnValue({ address: MOCK_ADDRESS });
    });

    it("fetches and returns the profile from the API", async () => {
      const { result } = renderHook(() => useStudentProfile(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.profile?.displayName).toBe("Qayyum");
      expect(result.current.profile?.careerGoal).toBe("Blockchain Developer");
    });

    it("uses displayName from profile when available", async () => {
      const { result } = renderHook(() => useStudentProfile(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.displayName).toBe("Qayyum");
    });

    it("falls back to truncated wallet address when profile has no displayName", async () => {
      server.use(http.get(PROFILE_URL, () => HttpResponse.json({ ...MOCK_PROFILE, displayName: undefined })));

      const { result } = renderHook(() => useStudentProfile(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Should be a truncated address like 0xf39F…2266
      expect(result.current.displayName).toMatch(/^0x[a-fA-F0-9]{4}/);
      expect(result.current.displayName).toContain("…");
    });

    it("returns null profile when API returns 404", async () => {
      server.use(http.get(PROFILE_URL, () => HttpResponse.json({ error: "Not found" }, { status: 404 })));

      const { result } = renderHook(() => useStudentProfile(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.profile).toBeNull();
    });

    it("updates the query cache after saveProfile resolves without a refetch", async () => {
      const qc = makeQueryClient();

      const { result } = renderHook(() => useStudentProfile(), {
        wrapper: ({ children }) => React.createElement(TestProviders, { queryClient: qc }, children),
      });

      await waitFor(() => expect(result.current.profile?.displayName).toBe("Qayyum"));

      await act(async () => {
        await result.current.saveProfile({ displayName: "Updated Name" });
      });

      await waitFor(() => {
        expect(result.current.profile?.displayName).toBe("Updated Name");
      });
    });

    it("throws and surfaces error when saveProfile PUT fails", async () => {
      server.use(http.put(PROFILE_URL, () => HttpResponse.json({ error: "Server error" }, { status: 500 })));

      const { result } = renderHook(() => useStudentProfile(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(
        act(async () => {
          await result.current.saveProfile({ displayName: "Will Fail" });
        }),
      ).rejects.toThrow();
    });
  });
});

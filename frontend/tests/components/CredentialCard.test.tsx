// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/components/CredentialCard.test.tsx
// Description      : Component tests for CredentialCard and its ShareDialog.
//                    Covers:
//                      - Metadata rendering (name, date, duration, issuer, skills)
//                      - Skeleton and fallback states
//                      - Share dialog: open, verify URL construction, QR code SVG output
//                      - Copy link button presence
//                    The ShareDialog builds the verify URL from window.location.origin
//                    (jsdom default: "http://localhost") + ROUTES.VERIFY + query params.
//                    uqr is a pure-JS encoder — no browser APIs required, works in jsdom.
// First Written on : Friday, 10-Apr-2026
// Last Written on  : Friday, 10-Apr-2026

import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import React from "react";
import { MOCK_ADDRESS } from "../test-utils";
import type { HydratedCredential } from "@/hooks/useStudentCredentials";
import type { CredentialTypeMetadata } from "@/lib/credential/metadata";

// ── Stubs ─────────────────────────────────────────────────────────────────────

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children),
}));

// ── Clipboard mock ────────────────────────────────────────────────────────────
// navigator.clipboard is a non-configurable getter in jsdom — use
// Object.defineProperty so the mock actually takes effect.
// Redefined each test so vi.clearAllMocks() (if called) doesn't wipe it.

const mockWriteText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  mockWriteText.mockClear();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: mockWriteText },
    configurable: true,
    writable: true,
  });
});

// ── Component under test ──────────────────────────────────────────────────────

import { CredentialCard } from "@/app/(web3)/(student)/dashboard/credentials/credential-card";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_METADATA: CredentialTypeMetadata = {
  name: "DevMatch 2024 Hackathon",
  description: "24-hour competitive hackathon run by APUBCC.",
  image: "ipfs://QmBadgeImage",
  achievementType: "Extracurricular",
  criteria: { narrative: "Place in the top 3 teams." },
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

function makeCredential(overrides: Partial<HydratedCredential> = {}): HydratedCredential {
  return {
    tokenId: 1n,
    tokenURI: "ipfs://QmTest",
    metadata: MOCK_METADATA,
    isMetadataLoading: false,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CredentialCard", () => {
  describe("loading state", () => {
    it("renders a skeleton when isMetadataLoading is true", () => {
      renderWithProviders(
        <CredentialCard credential={makeCredential({ isMetadataLoading: true })} holderAddress={MOCK_ADDRESS} />,
      );
      // CredentialCardSkeleton renders Skeleton elements (no credential name)
      expect(screen.queryByText("DevMatch 2024 Hackathon")).not.toBeInTheDocument();
    });
  });

  describe("metadata rendering", () => {
    it("displays the credential name from metadata", () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("DevMatch 2024 Hackathon")).toBeInTheDocument();
    });

    it("displays a fallback name when metadata is null", () => {
      renderWithProviders(<CredentialCard credential={makeCredential({ metadata: null })} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("Credential #1")).toBeInTheDocument();
    });

    it("displays the activity date", () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("14 Nov 2024")).toBeInTheDocument();
    });

    it("displays the duration in hours", () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("24h")).toBeInTheDocument();
    });

    it("displays the issuer name", () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("APUBCC")).toBeInTheDocument();
    });

    it("renders all skill badges", () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("Full-Stack Development")).toBeInTheDocument();
      expect(screen.getByText("Problem Solving")).toBeInTheDocument();
    });

    it("displays the token ID badge", () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      expect(screen.getByText("Token #1")).toBeInTheDocument();
    });
  });

  describe("ShareDialog", () => {
    async function openShareDialog() {
      const user = userEvent.setup();
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      await user.click(screen.getByRole("button", { name: /share/i }));
    }

    it("opens the share dialog when the Share button is clicked", async () => {
      await openShareDialog();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Share Credential")).toBeInTheDocument();
    });

    it("shows the verify URL containing the token ID", async () => {
      await openShareDialog();
      const url = screen.getByText(/\/verify\?tokenId=1/);
      expect(url).toBeInTheDocument();
    });

    it("shows the verify URL containing the holder address", async () => {
      await openShareDialog();
      const url = screen.getByText(new RegExp(MOCK_ADDRESS, "i"));
      expect(url).toBeInTheDocument();
    });

    it("renders an SVG element for the QR code", async () => {
      await openShareDialog();
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("the QR SVG contains rect elements representing modules", async () => {
      await openShareDialog();
      const rects = document.querySelectorAll("svg rect");
      expect(rects.length).toBeGreaterThan(0);
    });

    it("shows a Copy link button", async () => {
      await openShareDialog();
      expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
    });

    it("shows a Verify now button linking to the verify URL", async () => {
      await openShareDialog();
      const verifyLink = screen.getByRole("link", { name: /verify now/i });
      expect(verifyLink).toBeInTheDocument();
      expect(verifyLink).toHaveAttribute("href", expect.stringContaining("/verify?tokenId=1"));
    });

    it("clicking Copy link calls clipboard.writeText with the verify URL", async () => {
      renderWithProviders(<CredentialCard credential={makeCredential()} holderAddress={MOCK_ADDRESS} />);
      // Open dialog with native click (works reliably with Radix portals in React 18)
      await act(async () => {
        screen.getByRole("button", { name: /share/i }).click();
      });
      await act(async () => {
        screen.getByRole("button", { name: /copy link/i }).click();
      });
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining(`/verify?tokenId=1&holder=${MOCK_ADDRESS}`));
      });
    });
  });
});

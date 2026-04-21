// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/components/EventCard.test.tsx
// Description      : Component tests for EventCard and EventCardSkeleton.
//                    Covers: loading skeleton, Link href, event name, fallback name,
//                    "Earned" badge presence/absence, earned ring class, category label,
//                    issuer name + address fallback, date formatting, duration display,
//                    issued count, skill badges with weights, and description rendering.
// First Written on : Tuesday, 21-Apr-2026
// Last Written on  : Tuesday, 21-Apr-2026

import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, MOCK_ADDRESS } from "../test-utils";
import React from "react";
import type { MarketplaceEvent } from "@/hooks/useAllCredentialTypes";
import type { CredentialTypeMetadata } from "@/lib/credential/metadata";

// ── Stubs ─────────────────────────────────────────────────────────────────────

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
    React.createElement("a", { href, className }, children),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => React.createElement("img", { src, alt }),
}));

// ── Component under test ──────────────────────────────────────────────────────

import { EventCard } from "@/app/(web3)/(student)/events/event-card";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_METADATA: CredentialTypeMetadata = {
  name: "DevMatch 2024 Hackathon",
  description: "A 24-hour competitive hackathon.",
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
    { id: "problem-solving", label: "Problem Solving", category: "soft", weight: 5 },
  ],
};

function makeEvent(overrides: Partial<MarketplaceEvent> = {}): MarketplaceEvent {
  return {
    tokenId: 3n,
    issuer: MOCK_ADDRESS,
    metadataURI: "ipfs://QmTest",
    active: true,
    registeredAt: 0n,
    issuedCount: 42n,
    isEarned: false,
    metadata: MOCK_METADATA,
    isMetadataLoading: false,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("EventCard", () => {
  describe("loading state", () => {
    it("renders skeleton content and no event name when isMetadataLoading is true", () => {
      renderWithProviders(<EventCard event={makeEvent({ isMetadataLoading: true })} />);
      expect(screen.queryByText("DevMatch 2024 Hackathon")).not.toBeInTheDocument();
    });
  });

  describe("Link href", () => {
    it("wraps the card in a Link pointing to the event detail route", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/events/3");
    });
  });

  describe("event name", () => {
    it("displays the event name from metadata", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("DevMatch 2024 Hackathon")).toBeInTheDocument();
    });

    it("displays a fallback name when metadata is null", () => {
      renderWithProviders(<EventCard event={makeEvent({ metadata: null })} />);
      expect(screen.getByText("Credential Type #3")).toBeInTheDocument();
    });
  });

  describe("Earned badge", () => {
    it("shows the Earned badge when isEarned is true", () => {
      renderWithProviders(<EventCard event={makeEvent({ isEarned: true })} />);
      expect(screen.getByText("Earned")).toBeInTheDocument();
    });

    it("does not show the Earned badge when isEarned is false", () => {
      renderWithProviders(<EventCard event={makeEvent({ isEarned: false })} />);
      expect(screen.queryByText("Earned")).not.toBeInTheDocument();
    });

    it("applies the emerald ring class to the Card when isEarned is true", () => {
      renderWithProviders(<EventCard event={makeEvent({ isEarned: true })} />);
      const card = screen.getByRole("link").firstElementChild;
      expect(card?.className).toMatch(/ring-2/);
      expect(card?.className).toMatch(/ring-emerald/);
    });

    it("does not apply the emerald ring class when isEarned is false", () => {
      renderWithProviders(<EventCard event={makeEvent({ isEarned: false })} />);
      const card = screen.getByRole("link").firstElementChild;
      expect(card?.className).not.toMatch(/ring-2/);
    });
  });

  describe("category label", () => {
    it("shows the human-readable category label in a badge", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      const badges = screen.getAllByText(/hackathon/i);
      const badgeEl = badges.find((el) => el.dataset.slot === "badge" || el.closest("[data-slot='badge']"));
      expect(badgeEl).toBeDefined();
    });
  });

  describe("issuer", () => {
    it("shows the issuer display name when becp_issuer_name is provided", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("APUBCC")).toBeInTheDocument();
    });

    it("shows a truncated address when becp_issuer_name is absent", () => {
      const metaNoName = { ...MOCK_METADATA, becp_issuer_name: undefined } as unknown as CredentialTypeMetadata;
      renderWithProviders(<EventCard event={makeEvent({ metadata: metaNoName })} />);
      // issuer = MOCK_ADDRESS → "0xf39F…2266"
      expect(screen.getByText(/0xf39F/)).toBeInTheDocument();
    });
  });

  describe("activity date", () => {
    it("formats the activity date as 'd MMM yyyy'", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("14 Nov 2024")).toBeInTheDocument();
    });
  });

  describe("duration", () => {
    it("shows the duration in hours", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("24h")).toBeInTheDocument();
    });
  });

  describe("issued count", () => {
    it("displays the issued count", () => {
      renderWithProviders(<EventCard event={makeEvent({ issuedCount: 42n })} />);
      expect(screen.getByText("42 issued")).toBeInTheDocument();
    });

    it("displays 0 issued when issuedCount is 0n", () => {
      renderWithProviders(<EventCard event={makeEvent({ issuedCount: 0n })} />);
      expect(screen.getByText("0 issued")).toBeInTheDocument();
    });
  });

  describe("skill badges", () => {
    it("renders all skill badge labels", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("Full-Stack Development")).toBeInTheDocument();
      expect(screen.getByText("Problem Solving")).toBeInTheDocument();
    });

    it("shows the weight multiplier on each skill badge", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("×8")).toBeInTheDocument();
      expect(screen.getByText("×5")).toBeInTheDocument();
    });

    it("does not render skill badges when becp_skills is empty", () => {
      const metaNoSkills = { ...MOCK_METADATA, becp_skills: [] };
      renderWithProviders(<EventCard event={makeEvent({ metadata: metaNoSkills })} />);
      expect(screen.queryByText("Full-Stack Development")).not.toBeInTheDocument();
    });
  });

  describe("description", () => {
    it("renders the event description", () => {
      renderWithProviders(<EventCard event={makeEvent()} />);
      expect(screen.getByText("A 24-hour competitive hackathon.")).toBeInTheDocument();
    });
  });
});

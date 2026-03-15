// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/components/RoleGuard.test.tsx
// Description      : Component tests for RoleGuard.
//                    Verifies that the guard renders children for the correct role,
//                    shows a skeleton while loading, and redirects to the right
//                    destination for disconnected or mismatched wallets.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Sunday, 15-Mar-2026

import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, makeRouterMock } from "../test-utils";
import { RoleGuard } from "@/components/auth/RoleGuard";
import React from "react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockRouter = makeRouterMock();

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

// useRole is mocked at the module level. Each test overrides its return value.
const mockUseRole = vi.fn();

vi.mock("@/hooks/useRole", () => ({
  useRole: () => mockUseRole(),
}));

// BECPLogo is an SVG that requires image handling — replace with a stub
vi.mock("@/components/logo/becp-logo", () => ({
  default: () => React.createElement("div", { "data-testid": "becp-logo" }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("RoleGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the portal skeleton while role is loading", () => {
    mockUseRole.mockReturnValue({
      role: "student",
      isConnected: true,
      isLoading: true,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["student"]}>
        <div>Protected content</div>
      </RoleGuard>,
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(screen.getByText(/verifying credentials/i)).toBeInTheDocument();
  });

  it("renders children when role matches allowedRoles", () => {
    mockUseRole.mockReturnValue({
      role: "student",
      isConnected: true,
      isLoading: false,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["student"]}>
        <div>Student dashboard content</div>
      </RoleGuard>,
    );

    expect(screen.getByText("Student dashboard content")).toBeInTheDocument();
  });

  it("redirects to /connect when wallet is not connected", () => {
    mockUseRole.mockReturnValue({
      role: "student",
      isConnected: false,
      isLoading: false,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["student"]}>
        <div>Protected content</div>
      </RoleGuard>,
    );

    expect(mockRouter.replace).toHaveBeenCalledWith("/connect");
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects an organizer attempting to access the student dashboard to /organizer", () => {
    mockUseRole.mockReturnValue({
      role: "organizer",
      isConnected: true,
      isLoading: false,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["student"]}>
        <div>Student only</div>
      </RoleGuard>,
    );

    expect(mockRouter.replace).toHaveBeenCalledWith("/organizer");
    expect(screen.queryByText("Student only")).not.toBeInTheDocument();
  });

  it("redirects a student attempting to access the admin portal to /dashboard", () => {
    mockUseRole.mockReturnValue({
      role: "student",
      isConnected: true,
      isLoading: false,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["university_admin"]}>
        <div>Admin only</div>
      </RoleGuard>,
    );

    expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects a university_admin away from the organizer portal to /admin", () => {
    mockUseRole.mockReturnValue({
      role: "university_admin",
      isConnected: true,
      isLoading: false,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["organizer"]}>
        <div>Organizer only</div>
      </RoleGuard>,
    );

    expect(mockRouter.replace).toHaveBeenCalledWith("/admin");
  });

  it("does not redirect when allowedRoles contains multiple roles and role matches one of them", () => {
    mockUseRole.mockReturnValue({
      role: "university_admin",
      isConnected: true,
      isLoading: false,
    });

    renderWithProviders(
      <RoleGuard allowedRoles={["university_admin", "organizer"]}>
        <div>Shared content</div>
      </RoleGuard>,
    );

    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(screen.getByText("Shared content")).toBeInTheDocument();
  });
});

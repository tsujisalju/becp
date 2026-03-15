// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/components/ProfileEditForm.test.tsx
// Description      : Component tests for ProfileEditForm.
//                    Covers skeleton loading state, form population from fetched profile,
//                    dirty/clean state tracking, save interactions and toast feedback.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Sunday, 15-Mar-2026

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import React from "react";

// ── sonner mock ───────────────────────────────────────────────────────────────
// ProfileEditForm calls toast.success / toast.error. We capture these calls
// without needing a real toast renderer.

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => mockToastSuccess(msg),
    error: (msg: string) => mockToastError(msg),
  },
}));

// ── useStudentProfile mock ────────────────────────────────────────────────────

const mockSaveProfile = vi.fn();
const mockUseStudentProfile = vi.fn();

vi.mock("@/hooks/useStudentProfile", () => ({
  useStudentProfile: () => mockUseStudentProfile(),
}));

// ── wagmi mock (useConnection used by profile hook indirectly) ────────────────

vi.mock("wagmi", () => ({
  useConnection: () => ({
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  }),
}));

// ── Component under test ──────────────────────────────────────────────────────

import ProfileEditForm from "@/app/(web3)/(student)/dashboard/profile/profile-edit-form";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_PROFILE = {
  address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as `0x${string}`,
  displayName: "Qayyum",
  bio: "Software engineering student",
  careerGoal: "Blockchain Developer",
  createdAt: "2026-03-14T00:00:00.000Z",
  updatedAt: "2026-03-14T00:00:00.000Z",
};

function profileLoaded(overrides = {}) {
  mockUseStudentProfile.mockReturnValue({
    profile: { ...MOCK_PROFILE, ...overrides },
    isLoading: false,
    isSaving: false,
    saveProfile: mockSaveProfile,
    displayName: "Qayyum",
  });
}

function profileLoading() {
  mockUseStudentProfile.mockReturnValue({
    profile: undefined,
    isLoading: true,
    isSaving: false,
    saveProfile: mockSaveProfile,
    displayName: "0xf39F…2266",
  });
}

function profileNull() {
  mockUseStudentProfile.mockReturnValue({
    profile: null,
    isLoading: false,
    isSaving: false,
    saveProfile: mockSaveProfile,
    displayName: "0xf39F…2266",
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProfileEditForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("shows skeleton placeholders while profile is loading", () => {
      profileLoading();
      renderWithProviders(<ProfileEditForm />);

      // Skeletons are rendered instead of the form
      expect(screen.queryByLabelText(/display name/i)).not.toBeInTheDocument();
      // The shimmer skeletons should be present (they render as divs)
      const skeletons = document.querySelectorAll(".shimmer");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("form population", () => {
    it("populates display name, bio and career goal from loaded profile", async () => {
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      await waitFor(() => {
        expect(screen.getByDisplayValue("Qayyum")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Software engineering student")).toBeInTheDocument();
      });
    });

    it("renders the wallet address field as disabled", () => {
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      const walletField = screen.getByDisplayValue(MOCK_PROFILE.address);
      expect(walletField).toBeDisabled();
    });

    it("shows empty fields when there is no existing profile", () => {
      profileNull();
      renderWithProviders(<ProfileEditForm />);

      const displayNameInput = screen.getByLabelText(/display name/i);
      expect(displayNameInput).toHaveValue("");
    });
  });

  describe("dirty state", () => {
    it("save button is disabled when form is not dirty", () => {
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton).toBeDisabled();
    });

    it('shows "Up to date" indicator when form is clean and profile exists', () => {
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      expect(screen.getByText(/up to date/i)).toBeInTheDocument();
    });

    it("enables the save button after a field is changed", async () => {
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      const user = userEvent.setup();
      const displayNameInput = screen.getByLabelText(/display name/i);

      await user.clear(displayNameInput);
      await user.type(displayNameInput, "New Name");

      expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();
    });
  });

  describe("save interaction", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("calls saveProfile with trimmed display name on submit", async () => {
      mockSaveProfile.mockResolvedValue({
        ...MOCK_PROFILE,
        displayName: "  Trimmed  ".trim(),
      });
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      await user.clear(screen.getByLabelText(/display name/i));
      await user.type(screen.getByLabelText(/display name/i), "  New Name  ");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockSaveProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: "New Name" }));
      });
    });

    it("shows a success toast after saving", async () => {
      mockSaveProfile.mockResolvedValue(MOCK_PROFILE);
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      await user.clear(screen.getByLabelText(/display name/i));
      await user.type(screen.getByLabelText(/display name/i), "Changed");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("Profile saved");
      });
    });

    it("shows an error toast when saveProfile rejects", async () => {
      mockSaveProfile.mockRejectedValue(new Error("Network error"));
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      await user.clear(screen.getByLabelText(/display name/i));
      await user.type(screen.getByLabelText(/display name/i), "Will fail");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(expect.stringMatching(/failed to save profile/i));
      });
    });

    it('save button shows "Saving..." while submission is in progress', async () => {
      mockSaveProfile.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(MOCK_PROFILE), 200)));
      profileLoaded();
      renderWithProviders(<ProfileEditForm />);

      await user.clear(screen.getByLabelText(/display name/i));
      await user.type(screen.getByLabelText(/display name/i), "In progress");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      expect(mockSaveProfile).toHaveBeenCalled();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
    });
  });
});

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/components/VerifyForm.test.tsx
// Description      : Component tests for the VerifyForm component.
//                    Covers field validation, submit button gating, loading state,
//                    and all three result states (valid / invalid / error).
//                    useReadContracts is mocked per-test to control chain responses.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Sunday, 15-Mar-2026

import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import React from "react";

// ── Wagmi mock ────────────────────────────────────────────────────────────────

const mockUseReadContracts = vi.fn();

vi.mock("wagmi", () => ({
  useReadContracts: () => mockUseReadContracts(),
}));

// ── next/link stub ────────────────────────────────────────────────────────────

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children),
}));

// ── Component under test ──────────────────────────────────────────────────────

import VerifyForm from "@/app/verify/verify-form";

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_TOKEN_ID = "1";
const VALID_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const VALID_URI = "ipfs://QmTestHash123";

// ── Helpers ───────────────────────────────────────────────────────────────────

function idleContracts() {
  mockUseReadContracts.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
  });
}

function validContracts() {
  mockUseReadContracts.mockReturnValue({
    data: [{ result: 1n }, { result: VALID_URI }],
    isLoading: false,
    isError: false,
  });
}

function invalidContracts() {
  // balance of 0 — credential not held by this address
  mockUseReadContracts.mockReturnValue({
    data: [{ result: 0n }, { result: undefined }],
    isLoading: false,
    isError: false,
  });
}

function errorContracts() {
  mockUseReadContracts.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: true,
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VerifyForm", () => {
  beforeEach(() => {
    idleContracts();
    vi.clearAllMocks();
  });

  describe("initial render", () => {
    it("renders both input fields and the submit button", () => {
      renderWithProviders(<VerifyForm />);

      expect(screen.getByLabelText(/token id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/holder wallet address/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /verify on-chain/i })).toBeInTheDocument();
    });

    it("pre-fills fields from initialTokenId and initialAddress props", () => {
      renderWithProviders(<VerifyForm initialTokenId="42" initialAddress={VALID_ADDRESS} />);

      expect(screen.getByLabelText(/token id/i)).toHaveValue("42");
      expect(screen.getByLabelText(/holder wallet address/i)).toHaveValue(VALID_ADDRESS);
    });

    it("submit button is disabld when fields have not been filled", async () => {
      renderWithProviders(<VerifyForm />);
      const user = userEvent.setup();
      const tokenInput = screen.getByLabelText(/token id/i);
      await user.type(tokenInput, "a");
      await user.clear(tokenInput);
      await user.tab();
      await waitFor(() => expect(screen.getByRole("button", { name: /verify on-chain/i })).toBeDisabled());
    });
  });

  describe("field validation", () => {
    it("shows an error for a non-numeric Token ID after the field is blurred", async () => {
      renderWithProviders(<VerifyForm />);
      const user = userEvent.setup();

      const tokenInput = screen.getByLabelText(/token id/i);
      await user.type(tokenInput, "abc");
      await user.tab(); // blur

      await waitFor(() => expect(screen.getByText(/token id must be a number/i)).toBeInTheDocument());
    });

    it("shows an error for an invalid Ethereum address after the field is blurred", async () => {
      renderWithProviders(<VerifyForm />);
      const user = userEvent.setup();

      const addressInput = screen.getByLabelText(/holder wallet address/i);
      await user.type(addressInput, "not-an-address");
      await user.tab();

      await waitFor(() => expect(screen.getByText(/invalid ethereum address/i)).toBeInTheDocument());
    });

    it("submit button remains disabled while fields are invalid", async () => {
      renderWithProviders(<VerifyForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/token id/i), "abc");
      await user.type(screen.getByLabelText(/holder wallet address/i), "not-an-address");

      expect(screen.getByRole("button", { name: /verify on-chain/i })).toBeDisabled();
    });

    it("submit button is enabled when both fields are valid", async () => {
      renderWithProviders(<VerifyForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/token id/i), VALID_TOKEN_ID);
      await user.type(screen.getByLabelText(/holder wallet address/i), VALID_ADDRESS);

      expect(screen.getByRole("button", { name: /verify on-chain/i })).toBeEnabled();
    });
  });

  it('shows "Verifying..." while the contract read is in flight', async () => {
    mockUseReadContracts.mockReturnValue({ data: undefined, isLoading: true, isError: false });

    renderWithProviders(<VerifyForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/token id/i), VALID_TOKEN_ID);
    await user.type(screen.getByLabelText(/holder wallet address/i), VALID_ADDRESS);

    await act(async () => {
      fireEvent.submit(document.querySelector("form")!);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent(/verifying/i));
  });

  describe("result states", () => {
    it("shows the verified success panel when balance > 0 and uri is returned", async () => {
      validContracts();
      renderWithProviders(<VerifyForm />);

      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/token id/i), VALID_TOKEN_ID);
      await user.type(screen.getByLabelText(/holder wallet address/i), VALID_ADDRESS);

      await act(async () => {
        fireEvent.submit(document.querySelector("form")!);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => expect(screen.getByText(/credential verified/i)).toBeInTheDocument());
    });

    it("shows the not found panel when balance is 0", async () => {
      invalidContracts();
      renderWithProviders(<VerifyForm />);

      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/token id/i), VALID_TOKEN_ID);
      await user.type(screen.getByLabelText(/holder wallet address/i), VALID_ADDRESS);

      await act(async () => {
        fireEvent.submit(document.querySelector("form")!);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => expect(screen.getByText(/credential not found/i)).toBeInTheDocument());
    });

    it("shows the network error panel when useReadContracts returns isError", async () => {
      errorContracts();
      renderWithProviders(<VerifyForm />);

      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/token id/i), VALID_TOKEN_ID);
      await user.type(screen.getByLabelText(/holder wallet address/i), VALID_ADDRESS);

      await act(async () => {
        fireEvent.submit(document.querySelector("form")!);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => expect(screen.getByText(/network error/i)).toBeInTheDocument());
    });

    it("shows no result panel in idle state before any submission", () => {
      renderWithProviders(<VerifyForm />);

      expect(screen.queryByText(/credential verified/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/credential not found/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
    });
  });
});

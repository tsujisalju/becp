// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/test-utils.tsx
// Description      : Shared render wrapper and mock factories for BECP frontend tests.
//                    Provides a renderWithProviders helper that wraps components with
//                    QueryClient and mocked Wagmi context so individual test files
//                    don't need to repeat provider boilerplate.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Wednesday, 25-Mar-2026

import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

// ── QueryClient factory ───────────────────────────────────────────────────────
// Each test gets a fresh QueryClient with retries disabled so failed queries
// fail immediately rather than retrying three times and slowing down the suite.

export function makeQueryClient(overrides?: { queries?: { retry?: number } }) {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, ...overrides?.queries },
      mutations: { retry: false },
    },
  });
}

// ── Provider wrapper ──────────────────────────────────────────────────────────

interface WrapperProps {
  children?: React.ReactNode;
  queryClient?: QueryClient;
}

export function TestProviders({ children, queryClient }: WrapperProps) {
  const client = queryClient ?? makeQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// ── renderWithProviders ───────────────────────────────────────────────────────

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export function renderWithProviders(ui: React.ReactElement, { queryClient, ...options }: RenderWithProvidersOptions = {}) {
  const client = queryClient ?? makeQueryClient();
  return render(ui, {
    wrapper: ({ children }) => <TestProviders queryClient={client}>{children}</TestProviders>,
    ...options,
  });
}

// ── Wagmi mock factories ──────────────────────────────────────────────────────
// useRole, useBECPContract, useStudentProfile and VerifyForm all depend on
// Wagmi hooks. Rather than spinning up a full WagmiProvider (which requires a
// real or simulated chain), we vi.mock() the wagmi module in each test file
// and use these factories to produce consistent mock return values.

export const MOCK_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;
export const MOCK_ADDRESS_2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;
export const MOCK_CONTRACT = "0x2E576e8f9CFfc44DCa5d8a19E63E300C2b59dF3f" as `0x${string}`;

/** Simulates a connected wallet with no special roles (student) */
export function mockConnectedStudent() {
  return {
    address: MOCK_ADDRESS,
    isConnected: true,
    isConnecting: false,
    isReconnecting: false,
    isDisconnected: false,
  };
}

/** Simulates a disconnected wallet */
export function mockDisconnected() {
  return {
    address: undefined,
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    isDisconnected: true,
  };
}

/** Simulates wallet still reconnecting on page load */
export function mockReconnecting() {
  return {
    address: undefined,
    isConnected: false,
    isConnecting: false,
    isReconnecting: true,
    isDisconnected: false,
  };
}

// ── next/navigation mock ──────────────────────────────────────────────────────
// RoleGuard calls useRouter().replace(). Tests that render RoleGuard need
// this mock in scope. Import and call setupRouterMock() at the top of the
// describe block.

export function makeRouterMock() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };
}

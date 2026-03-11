"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/layout.tsx
// Description      : Layout component for routes in (web3) route group. Applies Wagmi and Rainbowkit providers for wallet integration and contract execution.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Tuesday, 10-Mar-2026

import { ReactNode } from "react";
import Web3Providers from "./web3-providers";

export default function Web3Layout({ children }: { children: ReactNode }) {
  return (
    <Web3Providers>{children}</Web3Providers>
  )
}

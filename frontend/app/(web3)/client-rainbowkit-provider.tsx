"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/client-rainbowkit-provider.tsx
// Description      : Client RainbowKit Provider wrapper that is called dynamically in (web3)/layout.tsx to guarantee client-side execution.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Tuesday, 10-Mar-2026

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";

export default function ClientRainbowKitProvider({ children }: { children: ReactNode }) {
  return <RainbowKitProvider theme={lightTheme({
    accentColor: "#009966",
    borderRadius: "medium",
    fontStack: "system"
  })}>
    {children}
  </RainbowKitProvider>
}

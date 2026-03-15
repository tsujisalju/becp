"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/web3-providers.tsx
// Description      : Include all Wagmi, React Query and Rainbowkit providers into one reusable wrapper component.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Tuesday, 10-Mar-2026

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi/config";
import dynamic from "next/dynamic";

export default function Web3Providers({ children }: { children: ReactNode }) {
  const ClientRainbowKitProvider = dynamic(() => import("./client-rainbowkit-provider"), { ssr: false });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ClientRainbowKitProvider>{children}</ClientRainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

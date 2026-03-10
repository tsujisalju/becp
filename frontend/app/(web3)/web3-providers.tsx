"use client";

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
        <ClientRainbowKitProvider>
          {children}
        </ClientRainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

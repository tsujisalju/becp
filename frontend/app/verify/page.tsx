"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/verify/page.tsx
// Description      : Public verify page for anyone to verify a credential on the blockchain.
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Sunday, 15-Mar-2026

import BECPLogo from "@/components/logo/becp-logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import VerifyForm from "./verify-form";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function VerifyPage() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="relative grid w-screen h-screen place-items-center bg-chart-1">
          <div className="noise-overlay"></div>
          <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
            <BECPLogo className="w-48 z-10" />
            <Card className="w-full relative">
              <CardHeader>
                <CardTitle>Verify a Credential</CardTitle>
                <CardDescription>
                  Enter the token ID and wallet address to verify a BECP credential on-chain. No wallet required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VerifyForm />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full text-center text-muted-foreground text-xs">
                  Verification reads directly on the Optimism blockchain.{" "}
                  <Link
                    href="https://sepolia-optimism.etherscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View on explorer →
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

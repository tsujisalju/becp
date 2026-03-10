"use client";

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";

export default function ClientRainbowKitProvider({children}: {children: ReactNode}) {
  return <RainbowKitProvider theme={lightTheme({
    accentColor: "#009966",
    borderRadius: "medium",
    fontStack: "system"
  })}>
    {children}
  </RainbowKitProvider>
}

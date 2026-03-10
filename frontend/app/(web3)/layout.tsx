"use client";

import { ReactNode } from "react";
import Web3Providers from "./web3-providers";

export default function Web3Layout({ children } : {children: ReactNode}) {
  return (
    <Web3Providers>{ children }</Web3Providers>
  )
}

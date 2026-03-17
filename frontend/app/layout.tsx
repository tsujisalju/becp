// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/layout.tsx
// Description      : Layout component for entire route hierarchy. Applies fonts and metadata.
// First Written on : Saturday, 7-Mar-2026
// Last Modified on : Tuesday, 17-Mar-2026

import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/sonner";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BECP",
  description: "Blockchain Extracurricular Credentials Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-serif", robotoSlab.variable)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

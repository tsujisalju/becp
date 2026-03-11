"use client";

import { Button } from "@/components/ui/button";
// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/credentials/page.tsx
// Description      : Page contents for dashboard credentials. Shows list of credentials owned by the student.
// First Written on : Wednesday, 11-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import PageHeader from "../../page-header";

export default function CredentialsPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="My Credentials" desc="Your on-chain extracurricular certificates, owned in your wallet." />
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Hackathon', 'Workshop', 'Leadership', 'Volunteer'].map((label, i) => (
          <Button
            key={label}
            variant={i === 0 ? "default" : "outline"}
            size={"sm"}
            className={`rounded-full transition-colors`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

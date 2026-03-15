"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/page.tsx
// Description      : Page contents for organizer portal - overview
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { FileClock, FileCog, FilePlay, FilePlus, FileUp, Users } from "lucide-react";

const QUICK_STATS = [
  {
    label: "Active Events",
    value: "-",
    icon: <FilePlay />,
    note: "This semester",
  },
  {
    label: "Credentials issued",
    value: "-",
    icon: <FileUp />,
    note: "Total on-chain",
  },
  {
    label: "Participants",
    value: "-",
    icon: <Users />,
    note: "Registered",
  },
  {
    label: "Credential Types",
    value: "-",
    icon: <FileCog />,
    note: "Registered",
  },
];

export default function OrganizerPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="Organizer Portal" desc="Manage events and issue blockchain credentials to participants." />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {QUICK_STATS.map((stat) => (
          <Card key={`overview-${stat.label}`}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.note}</CardDescription>
              <CardAction>{stat.icon}</CardAction>
            </CardHeader>
            <CardContent>
              <span className="font-bold text-2xl">{stat.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardAction>
              <FileClock />
            </CardAction>
          </CardHeader>
          <CardContent>
            <span className="text-muted-foreground">Coming soon</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Issue</CardTitle>
            <CardAction>
              <FilePlus />
            </CardAction>
          </CardHeader>
          <CardContent>
            <span className="text-muted-foreground">Coming soon</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/layout.tsx
// Description      : Page contents for dashboard overview. Shows quick statistics on credentials and activity participation.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Friday, 13-Mar-2026
//
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CalendarCheck2, FileBadge, Footprints, GalleryVertical, Target } from "lucide-react";
import PageHeader from "../page-header";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useConnection } from "wagmi";

const QUICK_STATS = [
  {
    label: "Credentials",
    value: "-",
    icon: <FileBadge />,
    note: "On-Chain",
  },
  {
    label: "Skills tracked",
    value: "-",
    icon: <Award />,
    note: "Across Credentials",
  },
  {
    label: "Activity hours",
    value: "-",
    icon: <Footprints />,
    note: "Total Logged",
  },
  {
    label: "Events joined",
    value: "-",
    icon: <CalendarCheck2 />,
    note: "Registered"
  }
]

function RandomGreeting(displayName: string) {
  const greetings = [
    `Welcome, ${displayName}!`,
    `Hello, ${displayName}!`,
    `What's good, ${displayName}?`,
    `Ready or not, ${displayName}?`
  ]
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export default function DashboardPage() {
  const { profile } = useStudentProfile();
  const { address } = useConnection();
  const displayName = profile?.displayName ?? `${address?.slice(0, 4)}...${address?.slice(-4)}`

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title={RandomGreeting(displayName)} desc="View your skill portfolio and credentials at a glance." />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {
          QUICK_STATS.map((stat) => (
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
          ))
        }
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skill Progress</CardTitle>
            <CardDescription>Based on Career Goals</CardDescription>
            <CardAction><Target /></CardAction>
          </CardHeader>
          <CardContent>
            <span className="text-muted-foreground">Coming soon</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Credentials</CardTitle>
            <CardAction><GalleryVertical /></CardAction>
          </CardHeader>
          <CardContent>
            <span className="text-muted-foreground">Coming soon</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

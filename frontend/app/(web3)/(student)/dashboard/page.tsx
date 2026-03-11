"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/layout.tsx
// Description      : Page contents for dashboard overview. Shows quick statistics on credentials and activity participation.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026
//
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CalendarCheck2, FileBadge, Footprints, GalleryVertical, Target } from "lucide-react";
import PageHeader from "../page-header";

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

export default function DashboardPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="My Dashboard" desc="Your skill portfolio and credential overview." />
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

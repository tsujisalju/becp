// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/admin/page.tsx
// Description      : Page contents for admin portal - overview
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { CalendarClock, Calendars, FileBadge, FileClock, FilePlus, Users } from "lucide-react";

const QUICK_STATS = [
  {
    label: "Active Organizers",
    value: "-",
    icon: <Calendars />,
    note: "Approved",
  },
  {
    label: "Total Credentials",
    value: "-",
    icon: <FileBadge />,
    note: "Platform-wide",
  },
  {
    label: "Students onboarded",
    value: "-",
    icon: <Users />,
    note: "Unique wallets",
  },
  {
    label: "Pending approvals",
    value: "-",
    icon: <CalendarClock />,
    note: "Awaiting review",
  },
];

export default function AdminPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="University Admin" desc="Manage organizer approvals, oversight, and platform configuration" />
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
            <CardTitle>Organizer Management</CardTitle>
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
            <CardTitle>Platform Activity</CardTitle>
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

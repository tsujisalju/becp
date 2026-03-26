"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/admin/page.tsx
// Description      : University admin portal overview. Shows platform-wide stats and a
//                    quick-action section for pending organizer approvals.
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPlatformStats } from "@/hooks/useAdminPlatformStats";
import { useOrganizerRequests } from "@/hooks/useOrganizerRequests";
import { ROUTES } from "@becp/shared";
import { format } from "date-fns";
import { CalendarClock, Calendars, FileBadge, FileClock, FileCog, PauseCircle } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { totalTypes, totalIssued, activeOrganizers, pendingApprovals, isPaused, isLoading } =
    useAdminPlatformStats();
  const { pending } = useOrganizerRequests();

  const statCards = [
    {
      label: "Active Organizers",
      value: isLoading ? null : activeOrganizers,
      icon: <Calendars />,
      note: "Approved",
    },
    {
      label: "Credential Types",
      value: isLoading ? null : totalTypes,
      icon: <FileCog />,
      note: "Registered on-chain",
    },
    {
      label: "Total Credentials Issued",
      value: isLoading ? null : totalIssued.toString(),
      icon: <FileBadge />,
      note: "Platform-wide",
    },
    {
      label: "Pending Approvals",
      value: isLoading ? null : pendingApprovals,
      icon: <CalendarClock />,
      note: "Awaiting review",
    },
  ];

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="University Admin" desc="Manage organizer approvals, oversight, and platform configuration" />

      {isPaused && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-2 text-sm text-destructive max-w-lg">
          <PauseCircle className="size-4 shrink-0" />
          <span>Platform is currently <strong>paused</strong>. Credential issuance is halted.</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={`overview-${stat.label}`}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.note}</CardDescription>
              <CardAction>{stat.icon}</CardAction>
            </CardHeader>
            <CardContent>
              {stat.value === null ? (
                <Skeleton className="h-8 w-10" />
              ) : (
                <span className="font-bold text-2xl">{stat.value}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending approvals quick-list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pending Organizer Approvals
              {!isLoading && pendingApprovals > 0 && (
                <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-700" variant="secondary">
                  {pendingApprovals}
                </Badge>
              )}
            </CardTitle>
            <CardAction>
              <FileClock />
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending applications.</p>
            ) : (
              <div className="space-y-2">
                {pending.slice(0, 3).map((req) => (
                  <div key={req.address} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{req.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{req.organization}</p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(req.requestedAt), "d MMM")}
                    </p>
                  </div>
                ))}
                {pending.length > 3 && (
                  <p className="text-xs text-muted-foreground">+{pending.length - 3} more</p>
                )}
                <Button asChild size="sm" variant="outline" className="mt-2">
                  <Link href={ROUTES.ADMIN_ORGANIZERS}>Manage all →</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform activity summary */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-5/6" />
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credential types</span>
                  <span className="font-medium">{totalTypes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credentials issued</span>
                  <span className="font-medium">{totalIssued.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active organizers</span>
                  <span className="font-medium">{activeOrganizers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform</span>
                  <Badge variant={isPaused ? "destructive" : "secondary"} className={isPaused ? "" : "bg-emerald-100 text-emerald-700"}>
                    {isPaused ? "Paused" : "Active"}
                  </Badge>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full mt-2">
                  <Link href={ROUTES.ADMIN_CREDENTIALS}>View credentials →</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

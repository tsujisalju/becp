"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/page.tsx
// Description      : Organizer portal overview. Displays live on-chain stats and
//                    a summary of recently registered credential types.
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Thursday, 19-Mar-2026

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizerCredentialTypes } from "@/hooks/useOrganizerCredentialTypes";
import { ROUTES } from "@becp/shared";
import { Clock, FileBadge, FileClock, FileCog, FilePlay, FileUp, Plus } from "lucide-react";
import Link from "next/link";

export default function OrganizerPage() {
  const { credentialTypes, stats, isLoading } = useOrganizerCredentialTypes();
  const recentTypes = [...credentialTypes].sort((a, b) => Number(b.registeredAt - a.registeredAt)).slice(0, 3);

  return (
    <div className="px-6 flex flex-col space-y-6">
      <PageHeader title="Organizer Portal" desc="Manage events and issue blockchain credentials to participants." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Events",
            value: isLoading ? null : stats.activeTypes,
            icon: <FilePlay />,
            note: "This semester",
          },
          {
            label: "Credentials issued",
            value: isLoading ? null : stats.totalIssued.toString(),
            icon: <FileBadge />,
            note: "Total on-chain",
          },
          {
            label: "Credential Types",
            value: isLoading ? null : stats.totalTypes,
            icon: <FileCog />,
            note: "Registered",
          },
          {
            label: "Latest Token ID",
            value: isLoading
              ? null
              : credentialTypes.length > 0
                ? `#${credentialTypes[credentialTypes.length - 1].tokenId.toString()}`
                : "-",
            icon: <FileClock />,
            note: "Most recent",
          },
        ].map((stat) => (
          <Card key={`overview-${stat.label}`}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.note}</CardDescription>
              <CardAction>{stat.icon}</CardAction>
            </CardHeader>
            <CardContent>
              {stat.value === null ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="font-bold text-2xl">{stat.value}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Credential Types</CardTitle>
            <CardAction>
              <Clock />
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No credential types registered yet.</p>
            ) : (
              <div className="space-y-2">
                {recentTypes.map((ct) => (
                  <div
                    key={ct.tokenId.toString()}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{ct.metadata?.name ?? `Token #${ct.tokenId}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {ct.issuedCount.toString()} issued · Token #{ct.tokenId.toString()}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="xs" className="shrink-0 ml-2">
                      <Link href={`/organizer/issue?tokenId=${ct.tokenId}`}>Issue</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.ORGANIZER_EVENTS}>View all</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardAction>
              <Plus />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Button asChild className="w-full">
                <Link href={`${ROUTES.ORGANIZER_EVENTS}?view=create`}>
                  <FileCog />
                  Register Credential Type
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={ROUTES.ORGANIZER_ISSUE}>
                  <FileUp />
                  Issue Credentials
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

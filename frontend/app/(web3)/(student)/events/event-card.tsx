"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/events/event-card.tsx
// Description      : Card component for a single event in the student events marketplace.
//                    Shows credential type metadata (name, organizer, category, date,
//                    duration, skills) from the student's discovery perspective.
//                    Displays an "Already Earned" badge when the connected student
//                    already holds this credential type.
// First Written on : Wednesday, 25-Mar-2026
// Last Modified on : Sunday, 19-Apr-2026

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceEvent } from "@/hooks/useAllCredentialTypes";
import { CATEGORY_LABELS, ipfsToHttp, SKILL_CATEGORY_COLOURS } from "@becp/shared";
import { format } from "date-fns";
import { Award, Calendar, CalendarDays, CircleCheck, Clock, ExternalLink, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1.5 flex-wrap mt-2">
          <Skeleton className="h-5 w-18 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-28" />
      </CardFooter>
    </Card>
  );
}

interface EventCardProps {
  event: MarketplaceEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { metadata, isMetadataLoading, isEarned, issuedCount } = event;

  if (isMetadataLoading) {
    return <EventCardSkeleton />;
  }

  return (
    <Card className={`relative overflow-hidden pt-0 ${isEarned ? "ring-2 ring-emerald-400/60 border-emerald-200" : ""}`}>
      <>
        <div className="absolute inset-0 z-30 aspect-3/1" />
        <div className="relative z-20 aspect-3/1 w-full flex items-center justify-center bg-black/5">
          {metadata?.becp_event_image ? (
            <Image src={ipfsToHttp(metadata.becp_event_image)} alt={metadata.name} fill className="object-cover" />
          ) : (
            <Calendar className="size-8 opacity-50" />
          )}
        </div>
      </>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{metadata?.name ?? `Credential Type #${event.tokenId}`}</CardTitle>
          {isEarned && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CircleCheck className="size-3" />
              Earned
            </span>
          )}
        </div>
        <CardDescription>
          <div className="flex items-center gap-2 flex-wrap">
            {metadata?.becp_activity_category && (
              <Badge variant="outline">
                {CATEGORY_LABELS[metadata.becp_activity_category] ?? metadata.becp_activity_category}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">
                {metadata?.becp_issuer_name ?? `${event.issuer.slice(0, 6)}…${event.issuer.slice(-4)}`}
              </span>
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {metadata?.description && <p className="text-sm text-muted-foreground line-clamp-2">{metadata.description}</p>}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {metadata?.becp_activity_date && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {format(new Date(metadata.becp_activity_date), "d MMM yyyy")}
            </span>
          )}
          {metadata?.becp_activity_duration_hours != null && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {metadata.becp_activity_duration_hours}h
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {Number(issuedCount)} issued
          </span>
        </div>

        {metadata?.becp_skills && metadata.becp_skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {metadata.becp_skills.map((skill) => (
              <span
                key={skill.id}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  SKILL_CATEGORY_COLOURS[skill.category] ?? "bg-muted text-muted-foreground"
                }`}
              >
                <Award className="mr-1 size-2.5" />
                {skill.label}
                <span className="ml-1 opacity-60">×{skill.weight}</span>
              </span>
            ))}
          </div>
        )}
      </CardContent>

      {metadata?.external_url && (
        <CardFooter className="grow items-end">
          <div className="w-full flex flex-row justify-between">
            <Button asChild variant="outline" size="sm">
              <Link href={metadata.external_url} target="_blank" rel="noopener noreferrer">
                Event Page
                <ExternalLink />
              </Link>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

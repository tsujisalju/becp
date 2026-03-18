"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/organizer/events/credential-type-card.tsx
// Description      : Card component displaying a single registered credential type
//                    in the organizer events list view.
// First Written on : Wednesday, 18-Mar-2026
// Last Modified on : Wednesday, 18-Mar-2026

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HydratedCredentialType } from "@/hooks/useOrganizerCredentialTypes";
import { CHAIN, ipfsToHttp } from "@becp/shared";
import { format } from "date-fns";
import { CalendarDays, CheckCircle, Clock, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  competition: "Competition",
  volunteer: "Volunteer Work",
  club_leadership: "Club Leadership",
  conference: "Conference",
  bootcamp: "Bootcamp",
  sports: "Sports",
  community_service: "Community Service",
  other: "Other",
};

const SKILL_CATEGORY_COLOURS: Record<string, string> = {
  technical: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  soft: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  leadership: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  creative: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  domain: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

interface CredentialTypeCardProps {
  credentialType: HydratedCredentialType;
}

export function CredentialTypeCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/4 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-1.5 flex-wrap">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CredentialTypeCard({ credentialType }: CredentialTypeCardProps) {
  const { tokenId, metadataURI, active, registeredAt, metadata, isMetadataLoading } = credentialType;

  const explorerUrl = `${CHAIN.OP_SEPOLIA.blockExplorer}/address/${credentialType.issuer}`;
  const ipfsUrl = ipfsToHttp(metadataURI);

  if (isMetadataLoading) {
    return <CredentialTypeCardSkeleton />;
  }

  return (
    <Card className={!active ? "opacity-60" : ""}>
      <CardHeader>
        <CardTitle>{metadata?.name ?? `Credential Type #${tokenId}`}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 flex-wrap -ml-1">
            <Badge variant="secondary" className="font-mono">
              Token #{tokenId.toString()}
            </Badge>
            {metadata?.becp_activity_category && (
              <Badge variant="outline">
                {CATEGORY_LABELS[metadata.becp_activity_category] ?? metadata.becp_activity_category}
              </Badge>
            )}
          </div>
        </CardDescription>
        <CardAction>
          <div className="flex flex-row space-x-2 items-center">
            <Badge className={`${active ? "bg-emerald-50 text-emerald-700" : "bg-muted"}`}>
              {active ? (
                <>
                  <CheckCircle className="size-3" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="size-3" />
                  Inactive
                </>
              )}
            </Badge>
            <Badge variant="secondary">Credentials issued: {"-"}</Badge>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          {metadata?.description && <p className="text-sm text-muted-foreground line-clamp-2">{metadata.description}</p>}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {metadata?.becp_activity_date && (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                {format(new Date(metadata.becp_activity_date), "d MMM yyyy")}
              </span>
            )}
            {metadata?.becp_activity_duration_hours && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {metadata.becp_activity_duration_hours}h
              </span>
            )}
            <span className="flex items-center gap-1">
              Registered {format(new Date(Number(registeredAt) * 1000), "d MMM yyyy")}
            </span>
          </div>
          {metadata?.becp_skills && metadata.becp_skills.length > 0 && (
            <div className="-ml-1 flex flex-wrap gap-1.5">
              {metadata.becp_skills.map((skill) => (
                <Badge
                  key={skill.id}
                  className={`${SKILL_CATEGORY_COLOURS[skill.category] ?? "bg-muted text-muted-foreground"}`}
                >
                  {skill.label}
                  <span className="ml-1 opacity-60">x{skill.weight}</span>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="grow items-end">
        <div className="w-full flex flex-row justify-between">
          <Button asChild size="sm">
            <Link href={`/organizer/issue?tokenId=${tokenId.toString()}`}>Issue Credential</Link>
          </Button>
          <div className="flex flex-row space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
                Explorer
                <ExternalLink />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                Metadata (IPFS)
                <ExternalLink />
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HydratedCredential } from "@/hooks/useStudentCredentials";
import { CATEGORY_LABELS, CHAIN, ipfsToHttp, SKILL_CATEGORY_COLOURS } from "@becp/shared";
import { format } from "date-fns";
import { Award, CalendarDays, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/credentials/credential-card.tsx
// Description      : Card component that displays a single BECP credential owned by the student.
//                    Shows credential name, activity metadata, skill tags, and links to
//                    the block explorer and IPFS metadata.
// First Written on : Thursday, 20-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026

export function CredentialCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1.5 flex-wrap mt-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h84 w-28" />
      </CardFooter>
    </Card>
  );
}

interface CredentialCardProps {
  credential: HydratedCredential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const { tokenId, tokenURI, metadata, isMetadataLoading } = credential;

  if (isMetadataLoading) {
    return <CredentialCardSkeleton />;
  }

  const explorerUrl = `${CHAIN.OP_SEPOLIA.blockExplorer}/token/${tokenId.toString()}`;
  const ipfsUrl = tokenURI ? ipfsToHttp(tokenURI) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award />
          <span>{metadata?.name ?? `Credential #${tokenId}`}</span>
        </CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
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
            {metadata?.becp_issuer_name && (
              <span className="text-muted-foreground">
                Issued by <span className="font-medium text-foreground">{metadata.becp_issuer_name}</span>
              </span>
            )}
          </div>
          {metadata?.becp_skills && metadata.becp_skills.length > 0 && (
            <div className="-ml-1 flex flex-wrap gap-1.5">
              {metadata.becp_skills.map((skill) => (
                <Badge key={skill.id} className={SKILL_CATEGORY_COLOURS[skill.category] ?? "bg-muted text-muted-foreground"}>
                  {skill.label}
                  <span className="ml-1 opacity-60">×{skill.weight}</span>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="grow items-end">
        <div className="w-full flex flex-row justify-between">
          <Button asChild size="sm">
            <Link href={`/verify?tokenId=${tokenId.toString()}`}>Verify</Link>
          </Button>
          <div className="flex flex-row space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
                Explorer
                <ExternalLink />
              </Link>
            </Button>
            {ipfsUrl && (
              <Button asChild variant="ghost" size="sm">
                <Link href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                  Metadata (IPFS)
                  <ExternalLink />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/organizer/events/credential-type-card.tsx
// Description      : Card component displaying a single registered credential type
//                    in the organizer events list view. Clicking the card opens a
//                    right-side drawer with full event details.
// First Written on : Wednesday, 18-Mar-2026
// Last Modified on : Monday, 20-Apr-2026

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { HydratedCredentialType } from "@/hooks/useOrganizerCredentialTypes";
import { addressExplorerUrl, CATEGORY_LABELS, ipfsToHttp, SKILL_CATEGORY_COLOURS } from "@becp/shared";
import { format } from "date-fns";
import { CalendarDays, CheckCircle, Clock, ExternalLink, X, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const explorerUrl = addressExplorerUrl(credentialType.issuer);
  const ipfsUrl = ipfsToHttp(metadataURI);

  if (isMetadataLoading) {
    return <CredentialTypeCardSkeleton />;
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <Card
        className={`relative overflow-hidden pt-0 cursor-pointer hover:shadow-md transition-shadow ${!active ? "opacity-60" : ""}`}
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-2/1 w-full flex items-center justify-center bg-muted">
          {metadata?.becp_event_image && (
            <>
              <Image
                src={ipfsToHttp(metadata.becp_event_image)}
                alt={metadata.name}
                fill
                className="object-cover opacity-50 blur-sm"
              />
              <Image src={ipfsToHttp(metadata.becp_event_image)} alt={metadata.name} fill className="object-contain" />
            </>
          )}
        </div>
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
              <Badge variant="secondary">Credentials issued: {credentialType.issuedCount.toString()}</Badge>
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
                    <span className="ml-1 opacity-60">×{skill.weight}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        {/* stopPropagation on the footer prevents button clicks from opening the drawer */}
        <CardFooter className="grow items-end" onClick={(e) => e.stopPropagation()}>
          <div className="w-full flex flex-row justify-between">
            <Button asChild size="sm">
              <Link href={`/organizer/issue?tokenId=${tokenId.toString()}`}>Issue Credential</Link>
            </Button>
            <div className="flex flex-row space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
                  Explorer
                  <ExternalLink />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                  Metadata (IPFS)
                  <ExternalLink />
                </Link>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <DrawerContent>
        <DrawerHeader className="flex flex-row items-start justify-between border-b pb-4">
          <div>
            <DrawerTitle>{metadata?.name ?? `Credential Type #${tokenId}`}</DrawerTitle>
            <div className="flex items-center gap-2 flex-wrap mt-1.5">
              <Badge variant="secondary" className="font-mono">Token #{tokenId.toString()}</Badge>
              {metadata?.becp_activity_category && (
                <Badge variant="outline">
                  {CATEGORY_LABELS[metadata.becp_activity_category] ?? metadata.becp_activity_category}
                </Badge>
              )}
              <Badge className={`${active ? "bg-emerald-50 text-emerald-700" : "bg-muted"}`}>
                {active ? <><CheckCircle className="size-3" />Active</> : <><XCircle className="size-3" />Inactive</>}
              </Badge>
            </div>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0"><X /></Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {metadata?.becp_event_image && (
            <div className="relative w-full aspect-2/1 rounded-lg overflow-hidden bg-muted">
              <Image src={ipfsToHttp(metadata.becp_event_image)} alt={metadata.name} fill className="object-cover opacity-50 blur-sm" />
              <Image src={ipfsToHttp(metadata.becp_event_image)} alt={metadata.name} fill className="object-contain" />
            </div>
          )}
          {metadata?.description && (
            <p className="text-sm leading-relaxed">{metadata.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
            <span>Registered {format(new Date(Number(registeredAt) * 1000), "d MMM yyyy")}</span>
            <span>
              Issued to <span className="font-medium text-foreground">{credentialType.issuedCount.toString()}</span> student{Number(credentialType.issuedCount) !== 1 ? "s" : ""}
            </span>
          </div>
          {metadata?.becp_skills && metadata.becp_skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {metadata.becp_skills.map((skill) => (
                  <Badge key={skill.id} className={SKILL_CATEGORY_COLOURS[skill.category] ?? "bg-muted text-muted-foreground"}>
                    {skill.label}
                    <span className="ml-1 opacity-60">×{skill.weight}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t flex-row flex-wrap gap-2 items-center">
          <Button asChild size="sm">
            <Link href={`/organizer/issue?tokenId=${tokenId.toString()}`}>Issue Credential</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
              Explorer <ExternalLink />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={ipfsUrl} target="_blank" rel="noopener noreferrer">
              Metadata (IPFS) <ExternalLink />
            </Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

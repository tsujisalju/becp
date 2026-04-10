"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/credentials/credential-card.tsx
// Description      : Card component that displays a single BECP credential owned by the student.
//                    Shows credential name, activity metadata, skill tags, and links to
//                    the block explorer and IPFS metadata. Includes a Share dialog that
//                    generates a QR code for the recruiter verification link.
// First Written on : Thursday, 20-Mar-2026
// Last Modified on : Friday, 10-Apr-2026

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { HydratedCredential } from "@/hooks/useStudentCredentials";
import { CATEGORY_LABELS, CHAIN, ipfsToHttp, ROUTES, SKILL_CATEGORY_COLOURS } from "@becp/shared";
import { format } from "date-fns";
import { encode } from "uqr";
import { Award, CalendarDays, Check, Clock, Copy, ExternalLink, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  holderAddress?: `0x${string}`;
}

function QRCodeSVG({ value, size = 200 }: { value: string; size?: number }) {
  const qr = encode(value);
  const moduleSize = size / qr.size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      {qr.data.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * moduleSize}
              y={y * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function ShareDialog({ tokenId, holderAddress }: { tokenId: bigint; holderAddress?: `0x${string}` }) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = holderAddress
    ? `${origin}${ROUTES.VERIFY}?tokenId=${tokenId.toString()}&holder=${holderAddress}`
    : `${origin}${ROUTES.VERIFY}?tokenId=${tokenId.toString()}`;

  function handleCopy() {
    navigator.clipboard.writeText(verifyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Credential</DialogTitle>
          <DialogDescription>
            Recruiters can scan this QR code or open the link to verify this credential on-chain — no wallet required.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-lg border bg-white p-4">
            <QRCodeSVG value={verifyUrl} size={200} />
          </div>
          <div className="w-full space-y-2">
            <p className="text-xs text-muted-foreground break-all font-mono bg-muted rounded-md px-3 py-2">{verifyUrl}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
                {copied ? <Check className="text-emerald-600" /> : <Copy />}
                {copied ? "Copied!" : "Copy link"}
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href={verifyUrl} target="_blank" rel="noopener noreferrer">
                  Verify now
                  <ExternalLink />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CredentialCard({ credential, holderAddress }: CredentialCardProps) {
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
          <ShareDialog tokenId={tokenId} holderAddress={holderAddress} />
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

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/recent-credentials-list.tsx
// Description      : Compact list of the student's most recently issued credentials,
//                    shown in the dashboard overview sidebar card. Displays up to 5
//                    credentials with name, category badge, and a link to the full gallery.
// First Written on : Friday, 20-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026
//
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { HydratedCredential } from "@/hooks/useStudentCredentials";
import { CATEGORY_LABELS, ROUTES } from "@becp/shared";
import { Award, FileQuestionMark, MoveRight } from "lucide-react";
import Link from "next/link";

export function RecentCredentialsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="size-7 rounded-md shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface RecentCredentialsListProps {
  credentials: HydratedCredential[];
  isLoading: boolean;
  maxItems?: number;
}

export function RecentCredentialsList({ credentials, isLoading, maxItems = 5 }: RecentCredentialsListProps) {
  if (isLoading) return <RecentCredentialsListSkeleton />;

  const recent = credentials.slice(0, maxItems);

  if (recent.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestionMark />
          </EmptyMedia>
          <EmptyTitle className="text-sm text-muted-foreground">No credentials yet</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      {recent.map((cred) => {
        const cat = cred.metadata?.becp_activity_category;
        return (
          <div key={cred.tokenId.toString()} className="flex items-start gap-3">
            <Award />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{cred.metadata?.name ?? `Credential #${cred.tokenId}`}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground font-mono">#{cred.tokenId.toString()}</span>
                {cat && <Badge variant="outline">{CATEGORY_LABELS[cat] ?? cat}</Badge>}
              </div>
            </div>
          </div>
        );
      })}
      {credentials.length > maxItems && (
        <Button asChild variant="ghost" size="sm" className="w-full mt-1">
          <Link href={ROUTES.CREDENTIALS}>
            View all {credentials.length} credentials
            <MoveRight />
          </Link>
        </Button>
      )}
    </div>
  );
}

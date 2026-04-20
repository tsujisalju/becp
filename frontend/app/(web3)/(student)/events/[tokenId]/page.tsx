"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/events/[tokenId]/page.tsx
// Description      : Event detail page for the student events marketplace.
//                    Shows the full credential type information: description, skills
//                    awarded, organizer details, issued count, and an earned/attend CTA.
// First Written on : Sunday, 20-Apr-2026
// Last Modified on : Sunday, 20-Apr-2026

import { useBreadcrumbLabel } from "@/components/ui/breadcrumb-label-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import PageHeader from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCredentialTypes } from "@/hooks/useAllCredentialTypes";
import { CATEGORY_LABELS, ipfsToHttp, nftExplorerUrl, addressExplorerUrl, ROUTES, SKILL_CATEGORY_COLOURS, SKILL_LEVELS } from "@becp/shared";
import { format } from "date-fns";
import { ArrowLeft, Award, CalendarDays, CircleCheck, Clock, ExternalLink, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function DetailSkeleton() {
  return (
    <div className="px-6 flex flex-col space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams<{ tokenId: string }>();
  const router = useRouter();
  const { events, isLoading } = useAllCredentialTypes();
  const { setLeafLabel } = useBreadcrumbLabel();

  const event = events.find((e) => e.tokenId.toString() === params.tokenId);
  const m = event?.metadata ?? null;

  useEffect(() => {
    if (m?.name) setLeafLabel(m.name);
    return () => setLeafLabel(null);
  }, [m?.name, setLeafLabel]);

  if (isLoading) return <DetailSkeleton />;

  if (!event) {
    return (
      <div className="px-6 flex flex-col space-y-6 pb-10">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Award />
            </EmptyMedia>
            <EmptyTitle>Event not found</EmptyTitle>
            <EmptyDescription>This event does not exist or is no longer active.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href={ROUTES.EVENTS}>Back to Events</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const category = m?.becp_activity_category
    ? (CATEGORY_LABELS[m.becp_activity_category] ?? m.becp_activity_category)
    : undefined;

  const explorerUrl = nftExplorerUrl(event.tokenId);
  const issuerExplorerUrl = addressExplorerUrl(event.issuer);
  const issuerShort = `${event.issuer.slice(0, 6)}…${event.issuer.slice(-4)}`;

  return (
    <div className="px-6 flex flex-col space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft />
        </Button>
        <PageHeader title={m?.name ?? `Event #${event.tokenId}`} desc={category} />
      </div>
      <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
        {m?.becp_event_image && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden">
            <Image src={ipfsToHttp(m.becp_event_image)} alt={m.name} fill className="object-cover opacity-50 blur-sm" />
            <Image src={ipfsToHttp(m.becp_event_image)} alt={m.name} fill className="object-contain" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  About this event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{m?.description ?? "No description available."}</p>
              </CardContent>
            </Card>

            {m?.becp_skills && m.becp_skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Skills awarded
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {m.becp_skills.map((skill) => (
                      <span
                        key={skill.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          SKILL_CATEGORY_COLOURS[skill.category] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Award className="size-3" />
                        {skill.label}
                        <span className="opacity-60">×{skill.weight}</span>
                      </span>
                    ))}
                  </div>
                  {/* Skill level legend */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1 border-t">
                    {Object.values(SKILL_LEVELS).map((cfg) => (
                      <span key={cfg.label} className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                        {cfg.label}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Event details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {m?.becp_issuer_name && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Issuing organisation</p>
                    <p className="font-medium">{m.becp_issuer_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Issuer address</p>
                  <Link
                    href={issuerExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    {issuerShort}
                  </Link>
                </div>
                {m?.becp_activity_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-3.5 shrink-0" />
                    {format(new Date(m.becp_activity_date), "d MMM yyyy")}
                  </div>
                )}
                {m?.becp_activity_duration_hours != null && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    {m.becp_activity_duration_hours} hour{m.becp_activity_duration_hours !== 1 ? "s" : ""}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-3.5 shrink-0" />
                  {Number(event.issuedCount)} student{Number(event.issuedCount) !== 1 ? "s" : ""} issued
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                {event.isEarned ? (
                  <>
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                      <CircleCheck className="size-4 shrink-0" />
                      <span className="font-medium">You&apos;ve earned this credential</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={ROUTES.CREDENTIALS}>View in My Credentials</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    {m?.external_url ? (
                      <Button asChild className="w-full">
                        <Link href={m.external_url} target="_blank" rel="noopener noreferrer">
                          Attend this event
                          <ExternalLink />
                        </Link>
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-1">
                        Participate in this event to earn the credential.
                      </p>
                    )}
                  </>
                )}

                <Separator />

                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
                    Block Explorer
                    <ExternalLink />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

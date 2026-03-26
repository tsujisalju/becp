"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/credentials/page.tsx
// Description      : Student credential gallery page. Reads all credential token IDs from
//                    the BECPCredential contract via getStudentCredentials(address), fetches
//                    IPFS metadata for each, and renders them as filterable cards.
//                    Also displays a skill score summary and top skills preview at the top.
// First Written on : Wednesday, 11-Mar-2026
// Last Modified on : Wednesday, 26-Mar-2026

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentCredentials } from "@/hooks/useStudentCredentials";
import { ROUTES, SKILL_LEVELS } from "@becp/shared";
import { useConnection } from "wagmi";
import { AlertCircle, Award, Clock, Download, FileBadge, FileQuestionMark, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CredentialCard, CredentialCardSkeleton } from "./credential-card";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PortfolioPDFDocument } from "./portfolio-pdf";

type FilterOption = "all" | string;

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hackathon", label: "Hackathon" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Competition" },
  { value: "club_leadership", label: "Leadership" },
  { value: "volunteer", label: "Volunteer" },
  { value: "conference", label: "Conference" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "community_service", label: "Community" },
  { value: "other", label: "Other" },
];

const LEVEL_BADGE_COLOURS: Record<string, string> = {
  beginner: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  advanced: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  expert: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

function SkillScoreSummary() {
  const { skillScores, stats, isLoading } = useStudentCredentials();

  if (isLoading) {
    return (
      <div className="grid gric-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <FileBadge className="text-emerald-600" />,
      value: stats.totalCredentials,
      label: "Credentials",
    },
    {
      icon: <Award className=" text-violet-600" />,
      value: stats.uniqueSkillCount,
      label: "Skills tracked",
    },
    {
      icon: <Clock className="text-blue-600" />,
      value: stats.totalActivityHours + "h",
      label: "Activity hours",
    },
    {
      icon: <Trophy className="text-amber-600" />,
      value: skillScores.filter((s) => s.level === "expert" || s.level === "advanced").length,
      label: "Advanced and higher skills",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {statCards.map(({ icon, value, label }) => (
        <Card key={label}>
          <CardContent>
            <div className="flex items-center gap-1.5 mb-1">
              {icon}
              <span className="text-2xl font-bold">{value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TopSkillsPreview() {
  const { skillScores, isLoading } = useStudentCredentials();

  if (isLoading || skillScores.length === 0) return null;

  const topSkills = skillScores.slice(0, 5);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Top Skills</p>
      <div className="flex flex-wrap gap-2">
        {topSkills.map(({ skill, level, totalScore }) => (
          <div key={skill.id} className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
            <span className="size-2 rounded-full" style={{ backgroundColor: SKILL_LEVELS[level].color }} />
            <span className="font-medium">{skill.label}</span>
            <Award className={`rounded-full size-4 ${LEVEL_BADGE_COLOURS[level] ?? ""}`} />
            <span className="text-muted-foreground">{Math.round(totalScore)}pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestionMark />
          </EmptyMedia>
          <EmptyTitle>{filtered ? "No credentials in this category" : "No credentials yet"}</EmptyTitle>
          <EmptyDescription>
            {filtered
              ? "Try a different filter of view all credentials."
              : "Participate in extracurricular activities and have an orgnizer issue you a credential."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {filtered ? (
            <Button onClick={onClear}>View all</Button>
          ) : (
            <Button asChild>
              <Link href={ROUTES.EVENTS}>Explore events</Link>
            </Button>
          )}
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default function CredentialsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const { credentials, skillScores, stats, isLoading, isError, refetch } = useStudentCredentials();
  const { address } = useConnection();
  const { profile } = useStudentProfile();
  const displayName = profile?.displayName ?? (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Student");

  const filtered = credentials.filter((c) => {
    if (activeFilter === "all") return true;
    return c.metadata?.becp_activity_category === activeFilter;
  });

  const countByCategory = credentials.reduce<Record<string, number>>((acc, c) => {
    const cat = c.metadata?.becp_activity_category;
    if (cat) acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});

  const activeFilters = FILTER_OPTIONS.filter((opt) => opt.value === "all" || (countByCategory[opt.value] ?? 0) > 0);

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="My Credentials" desc="Your on-chain extracurricular certificates, owned in your wallet." />
      {!isLoading && credentials.length > 0 && address && (
        <Button asChild className="w-max">
          <PDFDownloadLink
            document={
              <PortfolioPDFDocument
                displayName={displayName}
                address={address}
                credentials={credentials}
                skillScores={skillScores}
                stats={stats}
              />
            }
            fileName={`becp-portfolio-${address.slice(0, 8)}.pdf`}
          >
            {({ loading }) => (
              <>
                <Download />
                <span>{loading ? "Preparing..." : "Download Portfolio"}</span>
              </>
            )}
          </PDFDownloadLink>
        </Button>
      )}

      <SkillScoreSummary />
      <TopSkillsPreview />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Failed to load credentials</AlertTitle>
          <AlertDescription className="text-xs">
            Could not read credentials from the blockchain. Check your connection.
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      )}

      {!isError && (
        <div className="flex flex-wrap items-center gap-2">
          {(isLoading ? FILTER_OPTIONS.slice(0, 1) : activeFilters).map(({ value, label }) => {
            const count = value === "all" ? credentials.length : (countByCategory[value] ?? 0);
            const isActive = activeFilter === value;
            return (
              <Button
                key={value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="rounded-full transition-colors gap-1.5"
                onClick={() => setActiveFilter(value)}
              >
                {label}
                {!isLoading && count > 0 && (
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CredentialCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filtered={activeFilter !== "all"} onClear={() => setActiveFilter("all")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((credential) => (
            <CredentialCard key={credential.tokenId.toString()} credential={credential} holderAddress={address} />
          ))}
        </div>
      )}
    </div>
  );
}

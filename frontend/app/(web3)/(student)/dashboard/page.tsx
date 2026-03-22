"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/layout.tsx
// Description      : Page contents for dashboard overview. Shows quick statistics on credentials and activity participation.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BadgeQuestionMark,
  CalendarCheck2,
  FileBadge,
  Footprints,
  GalleryVertical,
  MoveRight,
  Target,
} from "lucide-react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useConnection } from "wagmi";
import PageHeader from "@/components/ui/page-header";
import { ROUTES, SKILL_LEVELS } from "@becp/shared";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentCredentials } from "@/hooks/useStudentCredentials";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecentCredentialsList } from "./recent-credentials-list";
import { SkillProgressChart } from "./skill-progress-chart";

function randomGreeting(displayName: string) {
  const greetings = [
    `Welcome, ${displayName}!`,
    `Hello, ${displayName}!`,
    `Ready to level up, ${displayName}?`,
    `Keep going, ${displayName}!`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function LevelLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {Object.entries(SKILL_LEVELS).map(([key, cfg]) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
          <span className="text-muted-foreground">
            {cfg.label}{" "}
            <span className="text-foreground/50">
              ({cfg.min === 0 ? "0" : cfg.min}
              {cfg.max === Infinity ? "+" : "-" + cfg.max} pts)
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  note: string;
  icon: ReactNode;
  isLoading: boolean;
}

function StatCard({ label, value, note, icon, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{note}</CardDescription>
        <CardAction>{icon}</CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-14" /> : <span className="font-bold text-2xl">{value}</span>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { profile } = useStudentProfile();
  const { address } = useConnection();
  const { credentials, skillScores, stats, isLoading } = useStudentCredentials();
  const displayName = profile?.displayName ?? `${address?.slice(0, 4)}...${address?.slice(-4)}`;

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title={randomGreeting(displayName)} desc="View your skill portfolio and credentials at a glance." />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Credentials"
          value={stats.totalCredentials}
          note="On-Chain"
          icon={<FileBadge />}
          isLoading={isLoading}
        />
        <StatCard
          label="Skills tracked"
          value={stats.uniqueSkillCount}
          note="Across Credentials"
          icon={<Award />}
          isLoading={isLoading}
        />
        <StatCard
          label="Activity hours"
          value={stats.totalActivityHours + "h"}
          note="Total Logged"
          icon={<Footprints />}
          isLoading={isLoading}
        />
        <StatCard
          label="Events joined"
          value={stats.totalCredentials}
          note="Completed"
          icon={<CalendarCheck2 />}
          isLoading={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skill Progress</CardTitle>
            <CardDescription>
              {profile?.careerGoal ? `towards your goal as a ${profile.careerGoal}` : "Aggregated from your credentials"}
            </CardDescription>
            <CardAction>
              <Target />
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-65 w-full" />
            ) : skillScores.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BadgeQuestionMark />
                  </EmptyMedia>
                  <EmptyTitle>No skills tracked yet</EmptyTitle>
                  <EmptyDescription>Start earning credentials to see your progress here.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <SkillProgressChart skillScores={skillScores} />
            )}
          </CardContent>
          {skillScores.length > 0 && (
            <CardFooter>
              <div className="w-full flex items-center justify-between gap-3">
                <LevelLegend />
                <Button asChild variant="outline" size="sm">
                  <Link href={ROUTES.CREDENTIALS}>
                    View all credentials
                    <MoveRight />
                  </Link>
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Credentials</CardTitle>
            <CardAction>
              <GalleryVertical />
            </CardAction>
          </CardHeader>
          <CardContent>
            <RecentCredentialsList credentials={credentials} isLoading={isLoading} maxItems={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

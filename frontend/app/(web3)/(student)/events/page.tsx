"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/events/page.tsx
// Description      : Student events marketplace page. Shows all active credential types
//                    registered on the BECP contract across all organizers. Students can
//                    browse events, filter by category or search by name, and see which
//                    credentials they have already earned.
//                    Note: there is no on-chain event registration — students attend events
//                    and organizers issue credentials afterwards via batchIssueCredential.
// First Written on : Wednesday, 11-Mar-2026
// Last Modified on : Friday, 10-Apr-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCredentialTypes } from "@/hooks/useAllCredentialTypes";
import { CATEGORY_LABELS } from "@becp/shared";
import { AlertCircle, Award, BookOpen, CalendarSearch, LayoutGrid, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EventCard, EventCardSkeleton } from "./event-card";

const CATEGORY_FILTERS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

type FilterOption = "all" | string;

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent>
            <Skeleton className="h-6 w-10 mb-1" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsBar({
  totalEvents,
  categoryCount,
  totalSkillsAvailable,
  isLoading,
}: {
  totalEvents: number;
  categoryCount: number;
  totalSkillsAvailable: number;
  isLoading: boolean;
}) {
  if (isLoading) return <StatsSkeleton />;
  const statCards = [
    { icon: <CalendarSearch className="text-violet-600" />, value: totalEvents, label: "Active events" },
    { icon: <LayoutGrid className="text-blue-600" />, value: categoryCount, label: "Categories" },
    { icon: <Award className="text-emerald-600" />, value: totalSkillsAvailable, label: "Skills available" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
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

export default function EventsPage() {
  const { events, stats, isLoading, isError, refetch } = useAllCredentialTypes();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [isRefetching, setIsRefetching] = useState(false);

  function handleRefetch() {
    refetch();
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 1000);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesCategory = activeFilter === "all" || e.metadata?.becp_activity_category === activeFilter;
      const matchesSearch =
        !q ||
        (e.metadata?.name ?? "").toLowerCase().includes(q) ||
        (e.metadata?.becp_issuer_name ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [events, activeFilter, search]);

  // Only show filter pills for categories present in loaded events
  const presentCategories = useMemo(
    () =>
      new Set<string>(events.flatMap((e) => (e.metadata?.becp_activity_category ? [e.metadata.becp_activity_category] : []))),
    [events],
  );

  const activeFilters = [
    { value: "all" as const, label: "All" },
    ...CATEGORY_FILTERS.filter((f) => presentCategories.has(f.value)),
  ];

  const countByCategory = useMemo(
    () =>
      events.reduce<Record<string, number>>((acc, e) => {
        const cat = e.metadata?.becp_activity_category;
        if (cat) acc[cat] = (acc[cat] ?? 0) + 1;
        return acc;
      }, {}),
    [events],
  );

  const isFiltered = activeFilter !== "all" || search.trim().length > 0;

  return (
    <div className="px-6 flex flex-col space-y-4">
      <div className="flex items-start justify-between gap-3">
        <PageHeader title="Events" desc="Discover extracurricular events and the credentials you can earn by participating." />
      </div>

      <StatsBar
        totalEvents={stats.totalEvents}
        categoryCount={stats.categoryCount}
        totalSkillsAvailable={stats.totalSkillsAvailable}
        isLoading={isLoading}
      />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Failed to load events</AlertTitle>
          <AlertDescription className="text-xs">
            Could not read credential types from the blockchain. Check your network connection.
          </AlertDescription>
        </Alert>
      )}

      {!isError && (
        <>
          {/* Search */}
          <div className="flex flex-row gap-4 items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events or organizers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleRefetch}
              disabled={isLoading || isRefetching}
              aria-label="Refresh"
            >
              <RefreshCw className={isLoading || isRefetching ? "animate-spin" : ""} />
            </Button>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(isLoading ? [{ value: "all" as const, label: "All" }] : activeFilters).map(({ value, label }) => {
              const count = value === "all" ? events.length : (countByCategory[value] ?? 0);
              const isActive = activeFilter === value;
              return (
                <Button
                  key={value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="rounded-full gap-1.5"
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                  {!isLoading && count > 0 && (
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookOpen />
                </EmptyMedia>
                <EmptyTitle>{isFiltered ? "No matching events" : "No events yet"}</EmptyTitle>
                <EmptyDescription>
                  {isFiltered
                    ? "Try a different category or search term."
                    : "No events have been registered yet. Check back later."}
                </EmptyDescription>
              </EmptyHeader>
              {isFiltered && (
                <EmptyContent>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setActiveFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((event) => (
                <EventCard key={event.tokenId.toString()} event={event} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

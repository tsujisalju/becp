"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/components/ui/dashboard-header.tsx
// Description      : Dashboard header with a dynamic breadcrumb that derives items from the
//                    current pathname, making it scale automatically with new routes.
// First Written on : Saturday, 7-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useBreadcrumbLabel } from "@/components/ui/breadcrumb-label-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Label shown when the segment appears as an ancestor (clickable link).
 *
 * To support a new route, just add its path segment as a key here.
 * e.g. adding a `/dashboard/settings` route only requires: settings: "Settings"
 */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  credentials: "Credentials",
  profile: "Profile",
  events: "Events",
  organizer: "Organizer Portal",
  issue: "Issue Credential",
  admin: "Admin",
  verify: "Verify",
};

/**
 * Override label used ONLY when the segment is the last crumb (the current page).
 * This keeps ancestor link labels unchanged while giving leaf nodes a friendlier name.
 *
 * Example: /dashboard alone should read "Overview", not "Dashboard",
 *          but "Dashboard" remains the correct ancestor label in deeper routes.
 */
const LEAF_LABEL_OVERRIDES: Record<string, string> = {
  dashboard: "Overview",
};

/** Converts a raw URL segment (e.g. a kebab-case slug or token ID) to Title Case. */
function toTitleCase(str: string): string {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Resolves the human-readable label for a segment. */
function getLabel(segment: string, isLeaf: boolean): string {
  if (isLeaf && segment in LEAF_LABEL_OVERRIDES) {
    return LEAF_LABEL_OVERRIDES[segment];
  }
  return SEGMENT_LABELS[segment] ?? toTitleCase(segment);
}

interface Crumb {
  href: string;
  label: string;
  isLeaf: boolean;
}

/**
 * Derives an ordered list of breadcrumb items from a pathname string.
 *
 * "/dashboard/credentials/42" →
 *   [
 *     { href: "/dashboard",                  label: "Dashboard",   isLeaf: false },
 *     { href: "/dashboard/credentials",      label: "Credentials", isLeaf: false },
 *     { href: "/dashboard/credentials/42",   label: "42",          isLeaf: true  },
 *   ]
 */
function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const isLeaf = index === segments.length - 1;
    return {
      href: "/" + segments.slice(0, index + 1).join("/"),
      label: getLabel(segment, isLeaf),
      isLeaf,
    };
  });
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);
  const { leafLabel } = useBreadcrumbLabel();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map(({ href, label, isLeaf }, index) => (
              <Fragment key={href}>
                {/* Separator sits between items, never before the first */}
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}

                {/* Ancestor items collapse on small screens; the current page is always visible */}
                <BreadcrumbItem className={!isLeaf ? "hidden md:block" : undefined}>
                  {isLeaf ? <BreadcrumbPage>{isLeaf && leafLabel ? leafLabel : label}</BreadcrumbPage> : <BreadcrumbLink href={href}>{label}</BreadcrumbLink>}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

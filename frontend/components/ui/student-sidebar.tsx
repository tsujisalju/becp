"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/components/ui/student-sidebar.tsx
// Description      : Sidebar component for student dashboard. Provide navigation and wallet connection status.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import BECPLogo from "@/components/logo/becp-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@becp/shared";
import { CalendarFold, CircleUser, FileBadge, SquareChartGantt } from "lucide-react";
import Link from "next/link";
import ConnectWalletSidebar from "./connect-wallet-sidebar";

const items = [
  {
    title: "Overview",
    url: ROUTES.DASHBOARD,
    icon: <SquareChartGantt />,
  },
  {
    title: "Credentials",
    url: ROUTES.CREDENTIALS,
    icon: <FileBadge />,
  },
  {
    title: "Events",
    url: ROUTES.EVENTS,
    icon: <CalendarFold />,
  },
  {
    title: "Profile",
    url: ROUTES.PROFILE,
    icon: <CircleUser />,
  },
];

export function StudentSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-16 bg-chart-1 pointer-events-none">
              <BECPLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <ConnectWalletSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}

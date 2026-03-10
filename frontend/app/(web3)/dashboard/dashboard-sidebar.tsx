"use client";

import BECPLogo from "@/components/logo/becp-logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ROUTES } from "@becp/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CalendarFold, CircleUser, FileBadge, SquareChartGantt } from "lucide-react";

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
      icon: <CalendarFold />
    },
    {
      title: "Profile",
      url: ROUTES.PROFILE,
      icon: <CircleUser />
    },
  ]

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-16 bg-chart-1 hover:bg-chart-2">
              <BECPLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
          <SidebarMenu className="p-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <ConnectButton chainStatus={"none"} accountStatus={"avatar"} showBalance={false}/>
      </SidebarFooter>
    </Sidebar>
  )
}

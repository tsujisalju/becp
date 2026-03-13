// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/organizer/layout.tsx
// Description      : Layout for organizer portal
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { RoleGuard } from "@/components/auth/RoleGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "@/components/ui/dashboard-header";
import { ReactNode } from "react";
import { OrganizerSidebar } from "@/components/ui/organizer-sidebar";

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["organizer"]}>
      <TooltipProvider>
        <SidebarProvider>
          <OrganizerSidebar />
          <SidebarInset>
            <DashboardHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </RoleGuard >
  )
}

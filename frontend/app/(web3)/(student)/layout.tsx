"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/layout.tsx
// Description      : Layout for dashboard overview. Provides sidebar.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { RoleGuard } from "@/components/auth/RoleGuard";
import { BreadcrumbLabelProvider } from "@/components/ui/breadcrumb-label-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/ui/student-sidebar";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "@/components/ui/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <TooltipProvider>
        <BreadcrumbLabelProvider>
          <SidebarProvider>
            <StudentSidebar />
            <SidebarInset>
              <DashboardHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbLabelProvider>
      </TooltipProvider>
    </RoleGuard>
  );
}

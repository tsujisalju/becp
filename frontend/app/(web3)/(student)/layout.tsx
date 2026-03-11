"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/layout.tsx
// Description      : Layout for dashboard overview. Provides sidebar.
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import { RoleGuard } from "@/components/auth/RoleGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./student-sidebar";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "./dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <TooltipProvider>
        <SidebarProvider>
          <StudentSidebar />
          <SidebarInset>
            <DashboardHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </RoleGuard>
  );
}

"use client";

import { useRole } from "@/hooks/useRole";
// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/components/auth/RoleGuard.tsx
// Description      : Prevent unauthorized role from accessing certain pages
// First Written on : Sunday, 10-Mar-2026
// Last Modified on :

import { ROUTES, UserRole } from "@becp/shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BECPLogo from "../logo/becp-logo";
import { Spinner } from "../ui/spinner";

const ROLE_HOME: Record<UserRole, string> = {
  student:          ROUTES.DASHBOARD,
  organizer:        ROUTES.ORGANIZER_PORTAL,
  university_admin: ROUTES.ADMIN,
  recruiter:        ROUTES.VERIFY,
}

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

function PortalSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <BECPLogo className="w-48" />
        <Spinner />
        <p className="text-sm text-muted-foreground font-medium">Verifying credentials…</p>
      </div>
    </div>
  )
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { role, isConnected, isLoading } = useRole();

  useEffect(() => {
    if (isLoading) return;
    if (!isConnected) { router.replace(ROUTES.CONNECT); console.log("not connected"); return };
    if (!allowedRoles.includes(role)) { router.replace(ROLE_HOME[role]) };
  }, [isConnected, isLoading, role, allowedRoles, router]);

  if (isLoading || !isConnected || !allowedRoles.includes(role)) {
    return <PortalSkeleton />
  }

  return <>{children}</>
}

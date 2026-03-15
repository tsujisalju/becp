"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/connect/page.tsx
// Description      : Connect page for connecting wallet and redirecting to role-specific home pages
// First Written on : Tuesday, 10-Mar-2026
// Last Modified on : Friday, 13-Mar-2026

import BECPLogo from "@/components/logo/becp-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectWallet from "@/components/ui/connect-wallet";
import { Spinner } from "@/components/ui/spinner";
import { useRole } from "@/hooks/useRole";
import { ROUTES, UserRole } from "@becp/shared";
import { BookOpenText, Calendars, University } from "lucide-react";
import Link from "next/link";
import { cloneElement, ReactElement } from "react";

const ROLE_HOME: Record<UserRole, string> = {
  student: ROUTES.DASHBOARD,
  organizer: ROUTES.ORGANIZER_PORTAL,
  university_admin: ROUTES.ADMIN,
  recruiter: ROUTES.VERIFY,
};

interface RoleItem {
  role: UserRole;
  icon: ReactElement<{ className?: string }>;
  label: string;
  desc: string;
}

const ROLE_ITEMS: RoleItem[] = [
  {
    role: "student",
    icon: <BookOpenText />,
    label: "Student",
    desc: "View and share your credential portfolio",
  },
  {
    role: "organizer",
    icon: <Calendars />,
    label: "Organizer",
    desc: "Issue certificates to event participants",
  },
  {
    role: "university_admin",
    icon: <University />,
    label: "University",
    desc: "Manage organizer approvals and oversight",
  },
];

export default function ConnectPage() {
  const { role, isConnected, isLoading } = useRole();
  const connectedRole = ROLE_ITEMS.find((item) => item.role == role);

  return (
    <div className="relative grid w-screen h-screen place-items-center bg-chart-1">
      <div className="noise-overlay"></div>
      <div className="w-full max-w-lg flex flex-col items-center space-y-4">
        <BECPLogo className="w-48 z-10" />
        <Card className="relative">
          <CardHeader>
            <CardTitle>Connect your wallet</CardTitle>
            <CardDescription>
              Your wallet address is your identity on BECP. Your role is determined automatically from on-chain permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="font-bold">Who is this for?</h2>
            <div className="flex flex-row">
              {ROLE_ITEMS.map((role) => (
                <div key={role.label}>
                  <div className="flex flex-col space-y-2 justify-center items-center p-4 text-center">
                    {cloneElement(role.icon, { className: "w-8 h-8" })}
                    <p className="font-bold">{role.label}</p>
                    <p>{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full flex flex-row justify-around">
              <ConnectWallet />
              {isConnected && (
                <Button disabled={isLoading}>
                  {!isLoading && connectedRole ? (
                    <Link className="flex flex-row space-x-2 items-center" href={ROLE_HOME[role]}>
                      {connectedRole.icon} <span>Proceed as {connectedRole.label}</span>
                    </Link>
                  ) : (
                    <>
                      <Spinner data-icon="inline-start" /> Detecting role
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="w-full text-center text-muted-foreground text-xs">
              Recruiter?{" "}
              <Link href="/verify" className="underline">
                No wallet needed to verify credentials →
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

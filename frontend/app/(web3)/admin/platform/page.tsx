// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/admin/platform/page.tsx
// Description      : Page contents for admin portal - platform
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { FileChartLine, FileCog, GraduationCap } from "lucide-react";

export default function AdminPlatformPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader
        title="Platform Overview"
        desc="Platform-wide credential issuance activity and audit log."
      />
      <div className="grid sm:grid-cols-3 gap-4 stagger">
        {[
          { label: 'Total types registered', value: '—', icon: <FileCog />, note: 'Credential types' },
          { label: 'Total credentials issued', value: '—', icon: <FileChartLine />, note: 'Across all organizers' },
          { label: 'Unique credential holders', value: '—', icon: <GraduationCap />, note: 'Student wallets' },
        ].map(({ label, value, icon, note }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>{note}</CardDescription>
              <CardAction>{icon}</CardAction>
            </CardHeader>
            <CardContent>
              <span className="font-bold text-2xl">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Issuance Log</CardTitle>
        </CardHeader>
      </Card>
      <div className="flex flex-col space-y-4 mt-4">
        <h2 className="text-xl font-bold">Emergency Controls</h2>
        <Card>
          <CardHeader>
            <CardTitle>Platform Pause</CardTitle>
            <CardDescription>Pausing the contract prevents all credential issuance until unpaused.
              Use only in emergencies (e.g. discovered vulnerability). This calls{' '}
              <code className="font-mono bg-secondary px-1 rounded text-xs">pause()</code> on
              the BECPCredential contract, protected by <code className="font-mono bg-secondary px-1 rounded text-xs">DEFAULT_ADMIN_ROLE</code>.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button variant="destructive">Pause platform</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

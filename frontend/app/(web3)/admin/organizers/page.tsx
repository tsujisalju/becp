// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/admin/organizers/page.tsx
// Description      : Page contents for admin portal - organizers
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { CalendarClock, Calendars, Info, Plus } from "lucide-react";

export default function AdminOrganizersPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader
        title="Organizer Management"
        desc="Approve organizer wallets to issue credentials on behalf of your university."
      />
      <Button className="w-max"><Plus />Approve Organizer</Button>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals<Badge className="ml-2 bg-amber-100 dark:bg-amber-950 text-amber-700" variant="secondary">0</Badge></CardTitle>
          <CardAction><CalendarClock /></CardAction>
        </CardHeader>
        <CardContent>
          <span className="text-muted-foreground">Coming soon</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Organizers</CardTitle>
          <CardAction><Calendars /></CardAction>
        </CardHeader>
        <CardContent>
          <span className="text-muted-foreground">Coming soon</span>
        </CardContent>
      </Card>
      <Alert className="bg-muted max-w-lg">
        <Info />
        <AlertTitle>On-chain role management</AlertTitle>
        <AlertDescription>Approving an organizer calls <code className="font-mono bg-secondary px-1 rounded text-xs">approveOrganizer(address)</code> on
          the BECPCredential contract, granting them <code className="font-mono bg-secondary px-1 rounded text-xs">ISSUER_ROLE</code>.
          Revoking calls <code className="font-mono bg-secondary px-1 rounded text-xs">revokeOrganizer(address)</code> and
          immediately prevents further credential issuance from that wallet.</AlertDescription>
      </Alert>
    </div>
  )
}

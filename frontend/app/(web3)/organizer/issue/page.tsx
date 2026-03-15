// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/issue/page.tsx
// Description      : Page contents for organizer portal - issue credentials
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { Info } from "lucide-react";

export default function OrganizerIssuePage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader
        title="Issue Credentials"
        desc="Mint credentials to event participants directly on the Optimism blockchain."
      />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>1. Select Credential Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Add Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>3. Review & Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming Soon</p>
        </CardContent>
      </Card>
      <Alert className="max-w-lg border-amber-200 bg-amber-50 text-amber-900">
        <Info />
        <AlertTitle>On-chain action</AlertTitle>
        <AlertDescription className="text-xs">
          Issuing credentials writes to the Optimism blockchain. Your connected wallet must hold the{" "}
          <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded text-xs">ISSUER_ROLE</code> on the
          BECPCredential contract. Each batch issuance requires a single transaction, regardless of how many recipients are
          included.
        </AlertDescription>
      </Alert>
    </div>
  );
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/admin/organizers/page.tsx
// Description      : Admin organizer management page. Shows pending organizer role applications
//                    (from the off-chain JSON store) and the current list of approved organizers.
//                    Admin can approve/reject applications and revoke existing organizer roles.
//                    Approve and revoke call approveOrganizer/revokeOrganizer on-chain; the
//                    off-chain store is then patched to reflect the new status.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useBECPContract } from "@/hooks/useBECPContract";
import { OrganizerRequest, useOrganizerRequests } from "@/hooks/useOrganizerRequests";
import { format } from "date-fns";
import { CalendarClock, Calendars, Check, Info, Plus, UserMinus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";

async function patchRequestStatus(address: string, status: string) {
  const res = await fetch(`/api/organizer-request/${address}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update request status");
}

function ApproveDialog({ request, onApproved }: { request: OrganizerRequest; onApproved: () => void }) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const contract = useBECPContract();
  const { mutateAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function handleApprove() {
    if (!contract || !publicClient) return;
    setIsProcessing(true);
    try {
      toast.loading("Waiting for wallet signature…", { id: "approve" });
      const txHash = await mutateAsync({
        ...contract,
        functionName: "approveOrganizer",
        args: [request.address as `0x${string}`],
      });
      toast.loading("Confirming transaction…", { id: "approve" });
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      await patchRequestStatus(request.address, "approved");
      toast.success(`${request.displayName} approved as organizer.`, { id: "approve" });
      setOpen(false);
      onApproved();
    } catch (e) {
      toast.error(
        e instanceof Error && e.message.includes("User rejected")
          ? "Transaction rejected."
          : "Approval failed. Please try again.",
        { id: "approve" },
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
          <Check />
          Approve
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Approve Organizer</DialogTitle>
          <DialogDescription>
            This will call{" "}
            <code className="font-mono bg-secondary px-1 rounded text-xs">
              approveOrganizer({request.address.slice(0, 6)}…)
            </code>{" "}
            on-chain, granting <span className="font-medium">{request.displayName}</span> the{" "}
            <code className="font-mono bg-secondary px-1 rounded text-xs">ISSUER_ROLE</code>.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm space-y-1 py-1">
          <p>
            <span className="text-muted-foreground">Organization:</span> {request.organization}
          </p>
          <p>
            <span className="text-muted-foreground">Wallet:</span> <span className="font-mono text-xs">{request.address}</span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isProcessing}>
            {isProcessing ? <Spinner /> : <Check />}
            Confirm approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RevokeDialog({ request, onRevoked }: { request: OrganizerRequest; onRevoked: () => void }) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const contract = useBECPContract();
  const { mutateAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function handleRevoke() {
    if (!contract || !publicClient) return;
    setIsProcessing(true);
    try {
      toast.loading("Waiting for wallet signature…", { id: "revoke" });
      const txHash = await mutateAsync({
        ...contract,
        functionName: "revokeOrganizer",
        args: [request.address as `0x${string}`],
      });
      toast.loading("Confirming transaction…", { id: "revoke" });
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      await patchRequestStatus(request.address, "revoked");
      toast.success(`${request.displayName}'s organizer role has been revoked.`, { id: "revoke" });
      setOpen(false);
      onRevoked();
    } catch (e) {
      toast.error(
        e instanceof Error && e.message.includes("User rejected")
          ? "Transaction rejected."
          : "Revocation failed. Please try again.",
        { id: "revoke" },
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/5">
          <UserMinus />
          Revoke
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Revoke Organizer Role</DialogTitle>
          <DialogDescription>
            This will call{" "}
            <code className="font-mono bg-secondary px-1 rounded text-xs">revokeOrganizer({request.address.slice(0, 6)}…)</code>{" "}
            on-chain, immediately preventing <span className="font-medium">{request.displayName}</span> from issuing further
            credentials.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRevoke} disabled={isProcessing}>
            {isProcessing ? <Spinner /> : <UserMinus />}
            Confirm revocation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DirectApproveDialog({ onApproved }: { onApproved: () => void }) {
  const [open, setOpen] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [touched, setTouched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const contract = useBECPContract();
  const { mutateAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const isValidAddress = isAddress(addressInput.trim());
  const showError = touched && !isValidAddress;

  async function handleApprove() {
    if (!contract || !publicClient || !isValidAddress) return;
    const addr = addressInput.trim() as `0x${string}`;
    setIsProcessing(true);
    try {
      toast.loading("Waiting for wallet signature…", { id: "direct-approve" });
      const txHash = await mutateAsync({
        ...contract,
        functionName: "approveOrganizer",
        args: [addr],
      });
      toast.loading("Confirming transaction…", { id: "direct-approve" });
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      // Upsert off-chain record for tracking
      await fetch("/api/organizer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addr,
          displayName: `${addr.slice(0, 6)}…${addr.slice(-4)}`,
          organization: "—",
          reason: "Directly approved by admin",
        }),
      }).catch(() => {});
      await patchRequestStatus(addr.toLowerCase(), "approved").catch(() => {});
      toast.success(`${addr.slice(0, 6)}…${addr.slice(-4)} approved as organizer.`, { id: "direct-approve" });
      setOpen(false);
      setAddressInput("");
      onApproved();
    } catch (e) {
      toast.error(
        e instanceof Error && e.message.includes("User rejected")
          ? "Transaction rejected."
          : "Approval failed. Please try again.",
        { id: "direct-approve" },
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-max">
          <Plus />
          Approve Organizer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Approve Organizer Directly</DialogTitle>
          <DialogDescription>
            Enter a wallet address to grant <code className="font-mono bg-secondary px-1 rounded text-xs">ISSUER_ROLE</code>{" "}
            without requiring a prior application.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={showError}>
            <FieldLabel>Wallet Address</FieldLabel>
            <Input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="0x…"
            />
            {showError && <FieldError errors={[{ message: "Invalid Ethereum address" }]} />}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={!isValidAddress || isProcessing}>
            {isProcessing ? <Spinner /> : <Check />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrganizersPage() {
  const { pending, approved, isLoading, refetch } = useOrganizerRequests();

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader
        title="Organizer Management"
        desc="Approve organizer wallets to issue credentials on behalf of your university."
      />

      <DirectApproveDialog onApproved={refetch} />

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pending Approvals
            {!isLoading && (
              <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-700" variant="secondary">
                {pending.length}
              </Badge>
            )}
          </CardTitle>
          <CardAction>
            <CalendarClock />
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending applications.</p>
          ) : (
            <div className="divide-y">
              {pending.map((req) => (
                <div key={req.address} className="py-3 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{req.displayName}</p>
                    <p className="text-xs text-muted-foreground">{req.organization}</p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">{req.address}</p>
                    {req.reason && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">{`"${req.reason}"`}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied {format(new Date(req.requestedAt), "d MMM yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <ApproveDialog request={req} onApproved={refetch} />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={async () => {
                        await patchRequestStatus(req.address, "rejected");
                        toast.success(`${req.displayName}'s application rejected.`);
                        refetch();
                      }}
                    >
                      <X />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Organizers */}
      <Card>
        <CardHeader>
          <CardTitle>Active Organizers</CardTitle>
          <CardAction>
            <Calendars />
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">No approved organizers yet.</p>
          ) : (
            <div className="divide-y">
              {approved.map((req) => (
                <div key={req.address} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{req.displayName}</p>
                    <p className="text-xs text-muted-foreground">{req.organization}</p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">{req.address}</p>
                  </div>
                  <RevokeDialog request={req} onRevoked={refetch} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-muted max-w-lg">
        <Info />
        <AlertTitle>On-chain role management</AlertTitle>
        <AlertDescription>
          Approving an organizer calls{" "}
          <code className="font-mono bg-secondary px-1 rounded text-xs">approveOrganizer(address)</code> on the BECPCredential
          contract, granting them <code className="font-mono bg-secondary px-1 rounded text-xs">ISSUER_ROLE</code>. Revoking
          calls <code className="font-mono bg-secondary px-1 rounded text-xs">revokeOrganizer(address)</code> and immediately
          prevents further credential issuance from that wallet.
        </AlertDescription>
      </Alert>
    </div>
  );
}

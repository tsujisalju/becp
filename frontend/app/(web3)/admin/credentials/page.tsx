"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/admin/credentials/page.tsx
// Description      : Admin credentials overview page. Shows platform-wide issuance stats,
//                    a form to revoke a specific credential (tokenId + recipient), and an
//                    emergency pause/unpause control. Pause requires DEFAULT_ADMIN_ROLE;
//                    revoke requires UNIVERSITY_ADMIN_ROLE.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useBECPContract } from "@/hooks/useBECPContract";
import { useAdminPlatformStats } from "@/hooks/useAdminPlatformStats";
import { useRole } from "@/hooks/useRole";
import { useForm } from "@tanstack/react-form";
import { FileChartLine, FileCog, GraduationCap, PauseCircle, PlayCircle, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";

function PauseControl({ isPaused, isAdmin }: { isPaused: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const contract = useBECPContract();
  const { mutateAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function handleToggle() {
    if (!contract || !publicClient) return;
    setIsProcessing(true);
    const toastId = "pause-toggle";
    try {
      toast.loading(isPaused ? "Unpausing platform…" : "Pausing platform…", { id: toastId });
      const txHash = await mutateAsync({
        ...contract,
        functionName: isPaused ? "unpause" : "pause",
        args: [],
      });
      toast.loading("Confirming transaction…", { id: toastId });
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      toast.success(isPaused ? "Platform unpaused successfully." : "Platform paused. Credential issuance is halted.", {
        id: toastId,
      });
      setOpen(false);
    } catch (e) {
      toast.error(
        e instanceof Error && e.message.includes("User rejected")
          ? "Transaction rejected."
          : "Transaction failed. Please try again.",
        { id: toastId },
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isPaused ? "outline" : "destructive"} disabled={!isAdmin}>
          {isPaused ? <PlayCircle /> : <PauseCircle />}
          {isPaused ? "Unpause Platform" : "Pause Platform"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isPaused ? "Unpause Platform" : "Pause Platform"}</DialogTitle>
          <DialogDescription>
            {isPaused
              ? "This will call unpause() and resume all credential issuance on the platform."
              : "This will call pause() and immediately halt all credential issuance. Only use in emergencies."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant={isPaused ? "default" : "destructive"} onClick={handleToggle} disabled={isProcessing}>
            {isProcessing ? <Spinner /> : isPaused ? <PlayCircle /> : <PauseCircle />}
            {isPaused ? "Confirm unpause" : "Confirm pause"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RevokeValues {
  tokenId: string;
  recipient: string;
  reason: string;
}

function RevokeCredentialForm() {
  const contract = useBECPContract();
  const { mutateAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const form = useForm({
    defaultValues: { tokenId: "", recipient: "", reason: "" } as RevokeValues,
    onSubmit: async ({ value }) => {
      if (!contract || !publicClient) return;
      const toastId = "revoke-credential";
      try {
        toast.loading("Waiting for wallet signature…", { id: toastId });
        const txHash = await mutateAsync({
          ...contract,
          functionName: "revokeCredential",
          args: [BigInt(value.tokenId.trim()), value.recipient.trim() as `0x${string}`, value.reason.trim()],
        });
        toast.loading("Confirming transaction…", { id: toastId });
        await publicClient.waitForTransactionReceipt({ hash: txHash });
        toast.success(`Credential #${value.tokenId} revoked from ${value.recipient.slice(0, 6)}…`, { id: toastId });
        form.reset();
      } catch (e) {
        toast.error(
          e instanceof Error && e.message.includes("User rejected")
            ? "Transaction rejected."
            : "Revocation failed. Please try again.",
          { id: toastId },
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="tokenId"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return { message: "Token ID is required" };
              if (!/^\d+$/.test(value.trim())) return { message: "Token ID must be a number" };
              return undefined;
            },
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Token ID</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. 1"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription className="text-xs">The ERC-1155 token type ID of the credential to revoke.</FieldDescription>
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="recipient"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return { message: "Recipient address is required" };
              if (!isAddress(value.trim())) return { message: "Invalid Ethereum address" };
              return undefined;
            },
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Recipient Wallet</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="0x…"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription className="text-xs">The student wallet address holding this credential.</FieldDescription>
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="reason"
          validators={{
            onChange: ({ value }) => (!value.trim() ? { message: "A reason is required for the audit log" } : undefined),
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Fraudulent activity — credential was issued in error"
                  rows={3}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button type="submit" variant="destructive" disabled={!canSubmit || isSubmitting} className="w-max">
              {isSubmitting ? <Spinner /> : <ShieldAlert />}
              {isSubmitting ? "Revoking…" : "Revoke Credential"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

export default function AdminCredentialsPage() {
  const { totalTypes, totalIssued, isPaused, isLoading } = useAdminPlatformStats();
  const { isAdmin } = useRole();

  const statCards = [
    { label: "Total types registered", value: isLoading ? null : totalTypes, icon: <FileCog />, note: "Credential types" },
    {
      label: "Total credentials issued",
      value: isLoading ? null : totalIssued.toString(),
      icon: <FileChartLine />,
      note: "Across all organizers",
    },
    {
      label: "Platform status",
      value: isLoading ? null : isPaused ? "Paused" : "Active",
      icon: <GraduationCap />,
      note: isPaused ? "Issuance halted" : "Issuance enabled",
    },
  ];

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="Credentials Overview" desc="Platform-wide credential issuance activity and emergency controls." />

      {isPaused && (
        <Alert variant="destructive" className="max-w-2xl">
          <PauseCircle className="size-4" />
          <AlertTitle>Platform is paused</AlertTitle>
          <AlertDescription className="text-xs">
            All credential issuance is currently halted. Unpause to resume operations.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon, note }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>{note}</CardDescription>
              <CardAction>{icon}</CardAction>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <span className="font-bold text-2xl">{value}</span>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revoke Credential */}
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Revoke a Credential</CardTitle>
          <CardDescription>
            Permanently revoke a specific credential from a student wallet. This action is irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevokeCredentialForm />
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <div className="flex flex-col space-y-4 mt-4">
        <h2 className="text-xl font-bold">Emergency Controls</h2>
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Platform Pause</CardTitle>
            <CardDescription>
              {isPaused
                ? "The platform is currently paused. Unpause to resume credential issuance."
                : "Pausing the contract prevents all credential issuance until unpaused. Use only in emergencies (e.g. discovered vulnerability)."}{" "}
              Calls <code className="font-mono bg-secondary px-1 rounded text-xs">{isPaused ? "unpause()" : "pause()"}</code> on
              the BECPCredential contract, protected by{" "}
              <code className="font-mono bg-secondary px-1 rounded text-xs">DEFAULT_ADMIN_ROLE</code>.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            {!isAdmin && <p className="text-xs text-muted-foreground mr-4">Requires DEFAULT_ADMIN_ROLE</p>}
            <PauseControl isPaused={isPaused} isAdmin={isAdmin} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/issue/page.tsx
// Description      : Credential issuance page. Three-step flow:
//                    1. Select credential type from the organizer's registered types
//                    2. Add recipient wallet addresses (one per line, validated)
//                    3. Review and call batchIssueCredential on the contract
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useBECPContract } from "@/hooks/useBECPContract";
import { HydratedCredentialType, useOrganizerCredentialTypes } from "@/hooks/useOrganizerCredentialTypes";
import { BECP_CREDENTIAL_ABI, CATEGORY_LABELS, CHAIN, SKILL_CATEGORY_COLOURS } from "@becp/shared";
import { format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, CircleCheck, Clock, FileCog, Info, Users, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { isAddress, parseEventLogs } from "viem";
import { useConnection, usePublicClient, useWriteContract } from "wagmi";

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-2 w-full max-w-2xl">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className={`flex items-center gap-2 ${i + 1 < steps.length ? "grow" : ""}`}>
            <div
              className={`flex items-center gap-1.5 text-sm font-medium ${isActive ? "text-foreground" : isDone ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              <span
                className={`flex items-center justify-center rounded-full text-xs font-bold h-5 w-5 shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <CircleCheck /> : stepNum}
              </span>
              <span className="hidden sm:inline w-max">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-full ${stepNum < current ? "bg-emerald-400" : "bg-border"}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CredentialTypeSelector({
  credentialTypes,
  isLoading,
  selected,
  onSelect,
}: {
  credentialTypes: HydratedCredentialType[];
  isLoading: boolean;
  selected: HydratedCredentialType | null;
  onSelect: (ct: HydratedCredentialType) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  const activeTypes = credentialTypes.filter((ct) => ct.active);

  if (activeTypes.length === 0) {
    return (
      <Alert>
        <Info />
        <AlertTitle>No credential types available</AlertTitle>
        <AlertDescription className="text-xs">
          You have no active registered credential types. Go to My Events to register one first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {activeTypes.map((ct) => {
        const isSelected = selected?.tokenId === ct.tokenId;
        return (
          <button
            key={ct.tokenId.toString()}
            type="button"
            onClick={() => onSelect(ct)}
            className={`w-full rounded-lg border text-left p-4 transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-muted-foreground/40 hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1.5 min-w-0">
                <p className="font-medium text-sm truncate">{ct.metadata?.name ?? `Credential Type #${ct.tokenId}`}</p>
                <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                  <Badge variant="secondary" className="font-mono text-xs">
                    Token #{ct.tokenId.toString()}
                  </Badge>
                  {ct.metadata?.becp_activity_category && (
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[ct.metadata.becp_activity_category] ?? ct.metadata.becp_activity_category}
                    </Badge>
                  )}

                  {ct.metadata?.becp_activity_date && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3" />
                      {format(new Date(ct.metadata.becp_activity_date), "d MMM yyyy")}
                    </span>
                  )}
                  {ct.metadata?.becp_activity_duration_hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {ct.metadata.becp_activity_duration_hours}h
                    </span>
                  )}
                </div>
              </div>
              {isSelected && <CircleCheck />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface ParsedRecipient {
  raw: string;
  address: `0x${string}` | null;
  isValid: boolean;
  isDuplicate: boolean;
}

function parseRecipients(raw: string): ParsedRecipient[] {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  return lines.map((line) => {
    const valid = isAddress(line);
    const normalised = valid ? line.toLowerCase() : null;
    const isDuplicate = valid && normalised !== null && seen.has(normalised);
    if (normalised) seen.add(normalised);
    return { raw: line, address: valid ? (line as `0x${string}`) : null, isValid: valid, isDuplicate };
  });
}

function RecipientInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = useMemo(() => parseRecipients(value), [value]);
  const validCount = parsed.filter((r) => r.isValid && !r.isDuplicate).length;
  const invalidCount = parsed.filter((r) => !r.isValid).length;
  const duplicateCount = parsed.filter((r) => r.isDuplicate).length;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-inpt overflow-hidden">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"0xABC123...\n0xDEF456...\n0x789GHI..."}
          rows={8}
          spellCheck={false}
          className="rounded-t-lg rounded-b-none"
        />
        <div className="border-t border-input bg-muted/40 px-3 py-2 flex items-center gap-3 text-xs  text-muted-foreground">
          <span className="text-emerald-600">{validCount} valid</span>
          {invalidCount > 0 && <span className="text-destructive">{invalidCount} invalid</span>}
          {duplicateCount > 0 && <span className="text-amber-600">{duplicateCount} duplicate</span>}
          <span className="ml-auto">{parsed.length} total</span>
        </div>
      </div>
      {parsed.some((r) => !r.isValid || r.isDuplicate) && (
        <div className="space-y-1">
          {parsed.map((r, i) =>
            !r.isValid ? (
              <p key={i} className="text-xs text-destructive flex items-center gap-1.5">
                <XCircle className="size-3 shrink-0" />
                Line {i + 1}:{" "}
                <span className="font-mono">
                  {r.raw.slice(0, 20)}
                  {r.raw.length > 20 ? "..." : ""}
                </span>{" "}
                is not a valid Ethereum address
              </p>
            ) : r.isDuplicate ? (
              <p key={i} className="text-xs text-amber-600 flex items-center gap-1.5">
                <Info className="size-3 shrink-0" />
                Line {i + 1}: duplicate, will be skipped
              </p>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

function ReviewPanel({ credentialType, recipients }: { credentialType: HydratedCredentialType; recipients: `0x${string}`[] }) {
  const meta = credentialType.metadata;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Credential Type</CardTitle>
          <CardAction>
            <FileCog />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 p-4 border rounded-lg">
            <p className="font-semibold">{meta?.name ?? `Token #${credentialType.tokenId}`}</p>
            <div className="-ml-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="font-mono">
                Token #{credentialType.tokenId.toString()}
              </Badge>
              {meta?.becp_activity_category && (
                <Badge variant="outline">{CATEGORY_LABELS[meta.becp_activity_category] ?? meta.becp_activity_category}</Badge>
              )}
              {meta?.becp_activity_date && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  {format(new Date(meta.becp_activity_date), "d MMM yyyy")}
                </span>
              )}
              {meta?.becp_activity_duration_hours && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {meta.becp_activity_duration_hours}h
                </span>
              )}
            </div>
            {meta?.becp_skills && meta.becp_skills.length > 0 && (
              <div className="-ml-1 flex flex-wrap gap-1.5">
                {meta.becp_skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${SKILL_CATEGORY_COLOURS[skill.category] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {skill.label}
                    <span className="ml-1 opacity-60">×{skill.weight}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recipients ({recipients.length})</CardTitle>
          <CardAction>
            <Users />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {recipients.map((addr, i) => (
              <p key={addr} className="text-xs font-mono text-muted-foreground">
                {i + 1}. {addr}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 text-sm">
        <span className="font-semibold">1 transaction</span> will mint{" "}
        <span className="font-semibold">
          {recipients.length} soulbound credential{recipients.length !== 1 ? "s" : ""}
        </span>{" "}
        on <span className="font-semibold">Optimism Sepolia</span>.
      </div>
    </div>
  );
}

const STEPS = ["Select Type", "Add Recipients", "Review & Issue"];

export default function OrganizerIssuePage() {
  const searchParams = useSearchParams();
  const tokenIdParam = searchParams.get("tokenId");

  const { credentialTypes, isLoading: isTypesLoading } = useOrganizerCredentialTypes();

  const [step, setStep] = useState<number>(tokenIdParam ? 2 : 1);
  const [manualSelectedType, setManualSelectedType] = useState<HydratedCredentialType | null>(null);
  const preselectedType = useMemo(
    () => credentialTypes.find((ct) => ct.tokenId.toString() === tokenIdParam && ct.active) ?? null,
    [credentialTypes, tokenIdParam],
  );

  const selectedType = manualSelectedType ?? preselectedType;
  if (tokenIdParam && !isTypesLoading && preselectedType === null && step === 2 && manualSelectedType === null) {
    toast.warning(`Credential type #${tokenIdParam} not found or is inactive.`);
    setStep(1);
  }

  const { address } = useConnection();
  const contract = useBECPContract();
  const publicClient = usePublicClient();
  const { mutateAsync } = useWriteContract();
  const [recipientInput, setRecipientInput] = useState("");
  const [isIssuing, setIsIssuing] = useState<boolean>(false);

  const validRecipients = useMemo<`0x${string}`[]>(
    () =>
      parseRecipients(recipientInput)
        .filter((r) => r.isValid && !r.isDuplicate)
        .map((r) => r.address!),
    [recipientInput],
  );

  const hasInvalidLines = useMemo(() => parseRecipients(recipientInput).some((r) => !r.isValid), [recipientInput]);

  async function handleIssue() {
    if (!contract || !publicClient || !selectedType || validRecipients.length === 0) return;
    setIsIssuing(true);
    let txHash: `0x${string}`;

    try {
      toast.loading("Waiting for wallet signature...", { id: "issue" });
      txHash = await mutateAsync({
        ...contract,
        functionName: "batchIssueCredential",
        args: [selectedType.tokenId, validRecipients],
      });
    } catch (e) {
      toast.error(
        e instanceof Error && e.message.includes("User rejected")
          ? "Transaction rejected."
          : "Transaction failed. Please try again.",
        { id: "issue" },
      );
      setIsIssuing(false);
      return;
    }

    try {
      toast.loading("Confirmation transaction...", { id: "issue" });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      const logs = parseEventLogs({
        abi: BECP_CREDENTIAL_ABI,
        eventName: "CredentialIssued",
        logs: receipt.logs,
      });
      const issuedCount = logs.length;
      const explorerUrl = `${CHAIN.OP_SEPOLIA.blockExplorer}/tx/${txHash}`;
      toast.success(`${issuedCount} credential${issuedCount !== 1 ? "s" : ""} issued successfully.`, {
        id: "issue",
        action: { label: "View tx", onClick: () => window.open(explorerUrl, "_blank") },
      });
      setRecipientInput("");
      setStep(1);
      setManualSelectedType(null);
    } catch {
      toast.warning(`Transaction submitted (${txHash.slice(0, 10)}…) but confirmation could not be read. Check the explorer.`, {
        id: "issue",
      });
    } finally {
      setIsIssuing(false);
    }
  }

  const canProceedStep1 = selectedType !== null;
  const canProceedStep2 = validRecipients.length > 0 && !hasInvalidLines;

  return (
    <div className="px-6 flex flex-col space-y-6">
      <PageHeader
        title="Issue Credentials"
        desc="Mint credentials to event participants directly on the Optimism blockchain."
      />
      <StepIndicator current={step} steps={STEPS} />

      {step === 1 && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="font-semibold text-lg">Select a credential type to issue</h2>
          <CredentialTypeSelector
            credentialTypes={credentialTypes}
            isLoading={isTypesLoading}
            selected={selectedType}
            onSelect={setManualSelectedType}
          />
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Enter recipient wallet addresses</h2>
            <Badge variant="secondary" className="text-xs font-mono">
              {selectedType?.metadata?.name ?? `Token #${selectedType?.tokenId}`}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste one Ethereum wallet address per line. Duplicates and invalid addresses are filtered automatically.
          </p>
          <RecipientInput value={recipientInput} onChange={setRecipientInput} />
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft /> Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && selectedType && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="font-semibold text-lg">Review and confirm issuance</h2>
          <ReviewPanel credentialType={selectedType} recipients={validRecipients} />
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Info />
            <AlertTitle>On-chain action</AlertTitle>
            <AlertDescription className="text-xs">
              Issuing credentials calls{" "}
              <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded text-xs">
                batchIssueCredential(tokenId, recipients[])
              </code>{" "}
              on the BECPCredential contract. Your wallet must hold{" "}
              <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded text-xs">ISSUER_ROLE</code>. This is a
              single transaction regardless of recipient count and cannot be undone.
            </AlertDescription>
          </Alert>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)} disabled={isIssuing}>
              <ChevronLeft />
              Back
            </Button>
            <Button onClick={handleIssue} disabled={isIssuing || !address}>
              {isIssuing ? (
                <>
                  <Spinner />
                  Issuing...
                </>
              ) : (
                <>
                  Issue {validRecipients.length} credential{validRecipients.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

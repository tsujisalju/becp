"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/events/page.tsx
// Description      : Organizer events page. Full credential type registration flow:
//                    form → metadata build → IPFS upload → contract write →
//                    wait for confirmation → extract tokenId from logs.
//                    List view shows all credential types registered by the connected
//                    organizer, hydrated with IPFS metadata.
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Wednesday, 18-Mar-2026

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import PageHeader from "@/components/ui/page-header";
import { ChevronLeft, FileQuestionMark, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import CredentialTypeForm, { CredentialTypeFormValues } from "./credential-type-form";
import { toast } from "sonner";
import { useConnection, usePublicClient, useWriteContract } from "wagmi";
import { buildCredentialTypeMetadata, uploadCredentialTypeMetadata } from "@/lib/credential/metadata";
import { useBECPContract } from "@/hooks/useBECPContract";
import { parseEventLogs } from "viem";
import { BECP_CREDENTIAL_ABI } from "@becp/shared";
import { useOrganizerCredentialTypes } from "@/hooks/useOrganizerCredentialTypes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CredentialTypeCard, CredentialTypeCardSkeleton } from "./credential-type-card";

type View = "list" | "create";

export default function OrganizerEventsPage() {
  const [view, setView] = useState<View>("list");
  const { address } = useConnection();
  const contract = useBECPContract();
  const publicClient = usePublicClient();
  const { mutateAsync } = useWriteContract(); //writeContractAsync is deprecated, use mutateAsync instead
  const { credentialTypes, isLoading, isError, refetch } = useOrganizerCredentialTypes();
  const [isRefetching, setIsRefetching] = useState<boolean>(false); //fake refetching state for input feedback

  function handleRefetch() {
    refetch();
    setIsRefetching(true);
    setTimeout(() => {
      setIsRefetching(false);
    }, 1000);
  }

  async function handleRegister(values: CredentialTypeFormValues) {
    if (!address) {
      toast.error("Wallet not connected.");
      throw new Error("Wallet not connected");
    }
    if (!contract) {
      toast.error("Contract not available on this network.");
      throw new Error("Contract not available");
    }

    if (!publicClient) {
      toast.error("Public client not available.");
      throw new Error("Public client not available");
    }

    const metadata = buildCredentialTypeMetadata({
      name: values.name,
      description: values.description,
      activityCategory: values.activityCategory as Parameters<typeof buildCredentialTypeMetadata>[0]["activityCategory"],
      activityDate: values.activityDate!,
      durationHours: Number(values.durationHours),
      issuerName: values.issuerName,
      externalUrl: values.externalUrl,
      skills: values.skills,
      issuerAddress: address as `0x${string}`,
    });

    let ipfsUri: string;
    try {
      toast.loading("Uploading metadata to IPFS...", { id: "ipfs-upload" });
      ipfsUri = await uploadCredentialTypeMetadata(metadata);
      toast.success(`Metadata pinned: ${ipfsUri}`, { id: "ipfs-upload" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "IPFS upload failed. Please try again.", { id: "ipfs-upload" });
      throw e;
    }
    let txHash: `0x${string}`;
    try {
      toast.loading("Waiting for wallet signature...", { id: "register" });
      txHash = await mutateAsync({
        ...contract,
        functionName: "registerCredentialType",
        args: [ipfsUri],
      });
    } catch (e) {
      toast.error(
        e instanceof Error && e.message.includes("User rejected")
          ? "Transaction rejected."
          : "Transaction failed. Please try again.",
        { id: "register" },
      );
      throw e;
    }

    try {
      toast.loading("Confirming transaction...", { id: "register" });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      const logs = parseEventLogs({
        abi: BECP_CREDENTIAL_ABI,
        eventName: "CredentialTypeRegistered",
        logs: receipt.logs,
      });

      const tokenId = logs[0]?.args?.tokenId;

      toast.success(
        tokenId !== undefined
          ? `Credential type registered - Token ID #${tokenId}`
          : "Credential type registered successfully.",
        { id: "register" },
      );
    } catch {
      toast.warning(
        `Transaction submitted (${txHash.slice(0, 10)}...) but confirmation could not be read. Check the explorer.`,
        { id: "register" },
      );
    }
    refetch();
    setView("list");
  }

  if (view === "create") {
    return (
      <div className="px-6 flex flex-col space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => setView("list")}>
            <ChevronLeft />
          </Button>
          <PageHeader
            title="Register Credential Type"
            desc="Define the information for a new on-chain credential type for your event."
          />
        </div>
        <CredentialTypeForm onSubmit={handleRegister} onCancel={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="My Events" desc="Events you have created and their credential issuance status." />
      <div className="flex gap-2">
        <Button className="w-max" onClick={() => setView("create")}>
          <Plus />
          Create Credential Type
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRefetch}
          disabled={isLoading || isRefetching}
          aria-label="Refresh"
        >
          <RefreshCw className={isLoading || isRefetching ? "animate-spin" : ""} />
        </Button>
      </div>
      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load credential types</AlertTitle>
          <AlertDescription className="text-xs">
            Could not read from the contract. Check your network connection and try refreshing.
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <CredentialTypeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && credentialTypes.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <FileQuestionMark />
            </EmptyMedia>
            <EmptyTitle>No Credential Types Yet</EmptyTitle>
            <EmptyDescription>No credential types registered yet. Create one to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex flex-row space-x-2 justify-center">
            <Button onClick={() => setView("create")}>Create Credential Type</Button>
          </EmptyContent>
        </Empty>
      )}

      {!isLoading && credentialTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credentialTypes.map((ct) => (
            <CredentialTypeCard key={ct.tokenId.toString()} credentialType={ct} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/events/page.tsx
// Description      : Page contents for organizer portal - events
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Tuesday, 17-Mar-2026

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import PageHeader from "@/components/ui/page-header";
import { ChevronLeft, FileQuestionMark, Plus } from "lucide-react";
import { useState } from "react";
import CredentialTypeForm, { CredentialTypeFormValues } from "./credential-type-form";
import { toast } from "sonner";
import { useConnection } from "wagmi";
import { buildCredentialTypeMetadata, uploadCredentialTypeMetadata } from "@/lib/credential/metadata";

type View = "list" | "create";

export default function OrganizerEventsPage() {
  const [view, setView] = useState<View>("list");
  const { address } = useConnection();

  async function handleRegister(values: CredentialTypeFormValues) {
    if (!address) {
      toast.error("Wallet not connected.");
      return;
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
    // call registerCredentialType from deployed contract
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
      <Button className="w-max" onClick={() => setView("create")}>
        <Plus />
        Create Credential Type
      </Button>
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
    </div>
  );
}

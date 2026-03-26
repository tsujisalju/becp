"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/apply-organizer/page.tsx
// Description      : Page for students to apply for organizer (ISSUER_ROLE) access.
//                    Submits an off-chain request to /api/organizer-request that the university
//                    admin reviews. On approval the admin calls approveOrganizer(address) on-chain.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useForm } from "@tanstack/react-form";
import { CheckCircle, ClockAlert, Info, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConnection } from "wagmi";

interface ApplicationValues {
  displayName: string;
  organization: string;
  reason: string;
}

type SubmitState = "idle" | "submitting" | "success" | "already_submitted";

export default function ApplyOrganizerPage() {
  const { address } = useConnection();
  const { profile, isLoading: isProfileLoading } = useStudentProfile();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [existingRequest, setExistingRequest] = useState<{ status: string } | null>(null);

  // Check if a request already exists for this address
  useEffect(() => {
    if (!address) return;
    fetch("/api/organizer-request")
      .then((r) => r.json())
      .then((requests: { address: string; status: string }[]) => {
        const existing = requests.find((r) => r.address === address.toLowerCase());
        if (existing && (existing.status === "pending" || existing.status === "approved")) {
          setExistingRequest(existing);
          setSubmitState("already_submitted");
        }
      })
      .catch(() => {});
  }, [address]);

  const form = useForm({
    defaultValues: {
      displayName: "",
      organization: "",
      reason: "",
    } as ApplicationValues,
    onSubmit: async ({ value }) => {
      if (!address) return;
      setSubmitState("submitting");
      try {
        const res = await fetch("/api/organizer-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            displayName: value.displayName.trim(),
            organization: value.organization.trim(),
            reason: value.reason.trim(),
          }),
        });
        if (res.status === 409) {
          const data = await res.json();
          setExistingRequest(data.existing);
          setSubmitState("already_submitted");
          return;
        }
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Submission failed");
        }
        setSubmitState("success");
        toast.success("Application submitted! The university admin will review your request.");
      } catch (err) {
        setSubmitState("idle");
        toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
      }
    },
  });

  // Pre-fill displayName from profile once loaded
  useEffect(() => {
    if (profile?.displayName && !form.state.values.displayName) {
      form.setFieldValue("displayName", profile.displayName);
    }
  }, [profile, form]);

  if (submitState === "success") {
    return (
      <div className="px-6 flex flex-col space-y-4">
        <PageHeader title="Apply as Organizer" desc="Request the ISSUER_ROLE to register and issue credentials." />
        <Alert className="border-emerald-200 bg-emerald-50 max-w-lg">
          <CheckCircle className="text-emerald-600" />
          <AlertTitle className="text-emerald-800">Application submitted</AlertTitle>
          <AlertDescription className="text-emerald-700 text-xs">
            Your request is pending review by the university admin. You will receive the organizer role once approved.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (submitState === "already_submitted") {
    const isPending = existingRequest?.status === "pending";
    return (
      <div className="px-6 flex flex-col space-y-4">
        <PageHeader title="Apply as Organizer" desc="Request the ISSUER_ROLE to register and issue credentials." />
        <Alert className={isPending ? "border-amber-200 bg-amber-50 max-w-lg" : "border-emerald-200 bg-emerald-50 max-w-lg"}>
          <ClockAlert className={isPending ? "text-amber-600" : "text-emerald-600"} />
          <AlertTitle className={isPending ? "text-amber-800" : "text-emerald-800"}>
            {isPending ? "Application pending review" : "Already approved"}
          </AlertTitle>
          <AlertDescription className={`text-xs ${isPending ? "text-amber-700" : "text-emerald-700"}`}>
            {isPending
              ? "Your application has already been submitted and is awaiting admin approval."
              : "Your wallet already holds organizer access. You can access the organizer portal."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader
        title="Apply as Organizer"
        desc="Request the ISSUER_ROLE to register credential types and issue credentials to students."
      />

      <Alert className="bg-muted max-w-lg">
        <Info />
        <AlertTitle>What happens after you apply?</AlertTitle>
        <AlertDescription className="text-xs">
          The university admin will review your request and call{" "}
          <code className="font-mono bg-secondary px-1 rounded text-xs">approveOrganizer(address)</code> on-chain to grant you
          the <code className="font-mono bg-secondary px-1 rounded text-xs">ISSUER_ROLE</code>. Once approved, you can register
          credential types and issue credentials.
        </AlertDescription>
      </Alert>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Organizer Application</CardTitle>
          <CardDescription>
            Wallet: <span className="font-mono text-xs">{address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProfileLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="displayName"
                  validators={{
                    onChange: ({ value }) => (!value.trim() ? { message: "Your name is required" } : undefined),
                  }}
                >
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Your Name</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. Ahmad Faiz"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="organization"
                  validators={{
                    onChange: ({ value }) => (!value.trim() ? { message: "Organization / club name is required" } : undefined),
                  }}
                >
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Organization / Club</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. APU Google Developer Student Club"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="reason"
                  validators={{
                    onChange: ({ value }) => (!value.trim() ? { message: "Please provide a reason" } : undefined),
                  }}
                >
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Reason for applying</FieldLabel>
                        <Textarea
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Briefly describe the activities or events you plan to issue credentials for…"
                          rows={4}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
                  {({ canSubmit, isSubmitting }) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting || submitState === "submitting"}>
                      <Send />
                      {isSubmitting || submitState === "submitting" ? "Submitting…" : "Submit application"}
                    </Button>
                  )}
                </form.Subscribe>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

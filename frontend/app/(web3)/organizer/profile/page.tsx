"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/organizer/profile/page.tsx
// Description      : Profile settings page for organizers. Allows setting a display name
//                    that appears in the sidebar and on the platform.
// First Written on : Tuesday, 21-Apr-2026
// Last Modified on : Tuesday, 21-Apr-2026

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useForm } from "@tanstack/react-form";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrganizerProfilePage() {
  const { profile, saveProfile } = useStudentProfile();
  const [saved, setSaved] = useState(false);

  const form = useForm({
    defaultValues: { displayName: "" },
    onSubmit: async ({ value }) => {
      await saveProfile({ displayName: value.displayName.trim() || undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  useEffect(() => {
    if (profile) {
      form.setFieldValue("displayName", profile.displayName ?? "");
    }
  }, [profile, form]);

  return (
    <div className="px-6 space-y-6 pb-10">
      <PageHeader title="Profile" desc="Set your display name" />
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Display name</CardTitle>
          <CardDescription>Shown in the sidebar and on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="displayName"
              validators={{
                onChange: ({ value }) =>
                  value && value.length > 60 ? { message: "Max 60 characters" } : undefined,
              }}
            >
              {(field) => (
                <Field className="mb-4">
                  <FieldLabel>Display name</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your name or organisation"
                    maxLength={60}
                  />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </Field>
              )}
            </form.Field>
            <Button type="submit" disabled={form.state.isSubmitting}>
              {saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

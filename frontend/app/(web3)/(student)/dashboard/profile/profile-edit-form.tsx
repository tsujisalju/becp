"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/profile/profile-edit-form.tsx
// Description      : Form component for editing profile information
// First Written on : Thursday, 12-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";

import { StudentProfileUpdate, useStudentProfile } from "@/hooks/useStudentProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


const CAREER_GOALS = [
  'Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Full-Stack Engineer',
  'DevOps / Cloud Engineer',
  'Data Scientist / ML Engineer',
  'UX / Product Designer',
  'Product Manager',
  'Cybersecurity Analyst',
  'Blockchain Developer',
  'Business Analyst',
  'Entrepreneur / Founder',
  'Academic Researcher',
  'Other',
] as const

export default function ProfileEditForm() {
  const { profile, isLoading, saveProfile, displayName } = useStudentProfile();

  const form = useForm({
    defaultValues: {
      displayName: '',
      bio: '',
      careerGoal: '',
    } as StudentProfileUpdate,
    onSubmit: async ({ value }) => {
      try {
        await saveProfile(value)
        // Reset with the saved values so they become the new baseline,
        // which clears isDirty without wiping the inputs.
        form.reset(value)
        toast.success('Profile saved')
      } catch {
        toast.error('Failed to save profile. Please try again.')
      }
    },
  })

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName,
        bio: profile.bio,
        careerGoal: profile.careerGoal,
      })
    }
  }, [profile, form])

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 rounded shimmer" />
            <Skeleton className="h-10 w-full rounded-lg shimmer" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <form
      className="max-w-xl"
      id="profile-edit-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="displayName">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Display Name
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={displayName}
                  maxLength={60}
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
                <FieldDescription className="text-xs">
                  Shown on your public credential portfolio page. Defaults to your shortened wallet address.
                </FieldDescription>
              </Field>
            )
          }}
        </form.Field>
        <form.Field
          name="bio">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const maxLength = 280;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Bio
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="A short introduction shown to recruiters viewing your credentials..."
                    maxLength={maxLength}
                    rows={6}
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.state.value?.length}/{maxLength} characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )
          }}
        </form.Field>
        <form.Field
          name="careerGoal">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Display Name
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value ?? ""}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your career goal..." />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {CAREER_GOALS.map((career) => (
                      <SelectItem key={career} value={career}>
                        {career}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription className="text-xs">
                  Used to personalise activity recommendation on your dashboard.
                </FieldDescription>
              </Field>
            )
          }}
        </form.Field>
        <Field data-disabled>
          <FieldLabel>
            Wallet Address
            <Badge variant="secondary" className="ml-auto">Read-only</Badge>
          </FieldLabel>
          <Input
            id="walletAddress"
            type="text"
            value={profile?.address ?? "-"}
            placeholder={"-"}
            disabled
          />
          <FieldDescription className="text-xs">
            Your on-chain identity. Cannot be changed as this is your wallet address.
          </FieldDescription>
        </Field>
        <form.Subscribe selector={s => ({ isDirty: s.isDirty, isSubmitting: s.isSubmitting })}>
          {({ isDirty, isSubmitting }) => (
            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                variant={
                  isDirty && !isSubmitting
                    ? "default"
                    : "secondary"
                }
              >
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
              {!isDirty && !isLoading && profile && (
                <span className="text-xs text-muted-foreground">✓ Up to date</span>
              )}
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  )
}

"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/organizer/events/credential-type-form.tsx
// Description      : Form for registering a new credential type. Collects all metadata
//                    needed to build a CredentialMetadata JSON object for IPFS upload,
//                    then calls registerCredentialType() on the BECPCredential contract.
//                    Skill tags are selected from a predefined list; AI inferencing
//                    will replace this in Phase 4.
// First Written on : Tuesday, 17-Mar-2026
// Last Modified on : Sunday, 22-Mar-2026

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityCategory, SKILL_POOL, SkillCategory, SkillTag } from "@becp/shared";
import { useForm } from "@tanstack/react-form";
import { CalendarIcon, Info, Plus, XCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string }[] = [
  { value: "hackathon", label: "Hackathon" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Competition" },
  { value: "volunteer", label: "Volunteer Work" },
  { value: "club_leadership", label: "Club Leadership" },
  { value: "conference", label: "Conference" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "sports", label: "Sports" },
  { value: "community_service", label: "Community Service" },
  { value: "other", label: "Other" },
];

// Predefined skill pool — organizer selects from these in Phase 3.
// AI inferencing from event descriptions replaces this in Phase 4.
//
const CATEGORY_COLOURS: Record<SkillCategory, string> = {
  technical: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  soft: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  leadership: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  creative: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  domain: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export interface CredentialTypeFormValues {
  name: string;
  description: string;
  activityCategory: ActivityCategory | "";
  activityDate: Date | undefined;
  durationHours: string;
  issuerName: string;
  externalUrl: string;
  skills: SkillTag[];
}

interface CredentialTypeFormProps {
  onSubmit: (values: CredentialTypeFormValues) => Promise<void>;
  onCancel?: () => void;
}

function SkillPicker({ selected, onChange }: { selected: SkillTag[]; onChange: (skills: SkillTag[]) => void }) {
  const [search, setSearch] = useState<string>("");
  const filtered = SKILL_POOL.filter(
    (s) => !selected.some((sel) => sel.id === s.id) && s.label.toLowerCase().includes(search.toLowerCase()),
  );

  const add = (skill: SkillTag) => onChange([...selected, skill]);
  const remove = (id: string) => onChange(selected.filter((s) => s.id !== id));

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((skill) => (
            <Button
              key={skill.id}
              variant="secondary"
              type="button"
              size="xs"
              onClick={() => remove(skill.id)}
              className={`${CATEGORY_COLOURS[skill.category as SkillCategory]}`}
              aria-label={`Remove ${skill.label}`}
            >
              {skill.label}
              <span className="ml-1 opacity-60 tabular-nums">x{skill.weight}</span>
              <XCircle />
            </Button>
          ))}
        </div>
      )}
      <div className="rounded-lg border border-input bg-background">
        <div className="p-2 border-b border-input">
          <Input type="text" placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="max-h-48 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <p className="py-3 text-center text-xs text-muted-foreground">
              {search ? "No skills match your search." : "All skills selected."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 p-1">
              {filtered.map((skill) => (
                <Button
                  key={skill.id}
                  variant="secondary"
                  type="button"
                  size="xs"
                  onClick={() => add(skill)}
                  className={`${CATEGORY_COLOURS[skill.category]}`}
                >
                  <Plus />
                  {skill.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.entries(CATEGORY_COLOURS) as [SkillCategory, string][]).map(([cat, cls]) => (
          <Badge key={cat} className={`capitalize ${cls}`}>
            {cat}
          </Badge>
        ))}
        <span className="text-xs text-muted-foreground self-center">×N = skill weight (1–10)</span>
      </div>
    </div>
  );
}

export default function CredentialTypeForm({ onSubmit, onCancel }: CredentialTypeFormProps) {
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      activityCategory: "" as const,
      activityDate: undefined,
      durationHours: "",
      issuerName: "",
      externalUrl: "",
      skills: [],
    } as CredentialTypeFormValues,
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value);
        form.reset();
        setHasSubmitted(false);
      } catch {}
    },
  });

  return (
    <form
      className="space-y-6 max-w-2xl mb-40"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setHasSubmitted(false);
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return { message: "Credential name is required" };
              if (value.trim().length < 5) return { message: "Name must be at least 5 characters" };
              if (value.trim().length > 100) return { message: "Name must be 100 characters or fewer" };
              return undefined;
            },
          }}
        >
          {(field) => {
            const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Credential Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  maxLength={100}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription className="text-xs">
                  This becomes the NFT name visible in wallets and on the verification page.
                </FieldDescription>
              </Field>
            );
          }}
        </form.Field>
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return { message: "Description is required" };
              if (value.trim().length < 20) return { message: "Description must be at least 20 characters" };
              if (value.trim().length > 500) return { message: "Description must be 500 characters or fewer" };
              return undefined;
            },
          }}
        >
          {(field) => {
            const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
            const maxLength = 500;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe the activity and what participants achieved..."
                    maxLength={maxLength}
                    rows={4}
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.state.value.length}/{maxLength} characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription className="text-xs">
                  Shown on the credential card and verification page. Describe the activity and its learning outcomes.
                </FieldDescription>
              </Field>
            );
          }}
        </form.Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="activityCategory"
            validators={{
              onChange: ({ value }) => (!value ? { message: "Activity category is required" } : undefined),
            }}
          >
            {(field) => {
              const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Activity Category</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as ActivityCategory)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_CATEGORIES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="activityDate"
            validators={{
              onChange: ({ value }) => (!value ? { message: "Activity date is required" } : undefined),
            }}
          >
            {(field) => {
              const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Activity Date</FieldLabel>

                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between font-normal"
                        id="date-picker"
                        aria-label="Select date"
                      >
                        {field.state.value ? (
                          format(field.state.value, "d MMM yyyy")
                        ) : (
                          <span className="text-muted-foreground">Select date</span>
                        )}
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => {
                          field.handleChange(date);
                          field.handleBlur();
                        }}
                        disabled={(date) => date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="durationHours"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) return { message: "Duration is required" };
                const n = Number(value);
                if (isNaN(n) || n <= 0) return { message: "Duration must be a positive number" };
                if (n > 8760) return { message: "Duration cannot exceed 8760 hours (1 year)" };
                return undefined;
              },
            }}
          >
            {(field) => {
              const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Duration (hours)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0.5"
                    max="8760"
                    step="0.5"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. 24"
                    className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <FieldDescription className="text-xs">
                    Used to weight skill scores. A longer event contributes more to skill development.
                  </FieldDescription>
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="issuerName"
            validators={{
              onChange: ({ value }) => (!value.trim() ? { message: "Issuer name is required" } : undefined),
            }}
          >
            {(field) => {
              const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Issuing Organisation</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    maxLength={80}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <FieldDescription className="text-xs">
                    Your organisation or club name as it appears on the credential.
                  </FieldDescription>
                </Field>
              );
            }}
          </form.Field>
        </div>
        <form.Field
          name="externalUrl"
          validators={{
            onChange: ({ value }) => {
              if (!value) return undefined; // optional field
              try {
                new URL(value);
                return undefined;
              } catch {
                return { message: "Enter a valid URL (e.g. https://...)" };
              }
            },
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Event URL{" "}
                  <Badge variant="secondary" className="ml-1">
                    Optional
                  </Badge>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/event"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription className="text-xs">
                  Link to the event page or your organisation&apos;s website. Embedded in the credential metadata.
                </FieldDescription>
              </Field>
            );
          }}
        </form.Field>
        <form.Field
          name="skills"
          validators={{
            onChange: ({ value }) =>
              value.length === 0
                ? { message: "Select at least one skill tag" }
                : value.length > 8
                  ? { message: "Maximum 8 skill tags per credential" }
                  : undefined,
          }}
        >
          {(field) => {
            const isInvalid = (field.state.meta.isTouched || hasSubmitted) && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>
                  Skill Tags
                  <Badge variant="secondary" className="ml-1">
                    {field.state.value.length}/8
                  </Badge>
                </FieldLabel>
                <SkillPicker
                  selected={field.state.value}
                  onChange={(skills) => {
                    field.handleChange(skills);
                    field.handleBlur();
                  }}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription className="text-xs">
                  Skills students develop through this activity. Each skill&apos;s weight (×N) determines how much it
                  contributes to a student&apos;s skill score per hour of participation.
                </FieldDescription>
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        <Info />
        <AlertTitle>On-chain registration</AlertTitle>
        <AlertDescription className="text-xs">
          Registering a credential type calls{" "}
          <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded text-xs">
            registerCredentialType(metadataURI)
          </code>{" "}
          on the BECPCredential contract. Your wallet will be prompted to sign the transaction. The metadata will first be
          uploaded to IPFS via Pinata, then the returned CID is passed to the contract.
        </AlertDescription>
      </Alert>
      <form.Subscribe
        selector={(s) => ({
          isSubmitting: s.isSubmitting,
          canSubmit: s.canSubmit,
        })}
      >
        {({ isSubmitting, canSubmit }) => (
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Registering...
                </>
              ) : (
                "Register Credential Type"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

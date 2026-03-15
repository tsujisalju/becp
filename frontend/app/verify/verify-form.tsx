// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/verify/verify-form.tsx
// Description      : Form component for verifiying a credential on the blockchain.
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Sunday, 15-Mar-2026

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BECP_CREDENTIAL_ABI, CHAIN, ipfsToHttp } from "@becp/shared";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, CircleCheck, CircleX, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { isAddress } from "viem";
import { useReadContracts } from "wagmi";
import { optimismSepolia } from "wagmi/chains";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  "0x2E576e8f9CFfc44DCa5d8a19E63E300C2b59dF3f") as `0x${string}`;

type VerifyStatus = "idle" | "loading" | "valid" | "invalid" | "error";

interface VerifyResult {
  tokenId: bigint;
  holderAddress: `0x${string}`;
  tokenUri: string;
  balance: bigint;
}

interface VerifyFormProps {
  initialTokenId?: string;
  initialAddress?: string;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`truncate ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function VerifySuccess({ result }: { result: VerifyResult }) {
  const explorerUrl = `${CHAIN.OP_SEPOLIA.blockExplorer}/address/${result.holderAddress}`;
  const ipfsUrl = result.tokenUri.startsWith("ipfs://") ? ipfsToHttp(result.tokenUri) : result.tokenUri;

  return (
    <>
      <Alert className="border-emerald-200 bg-emerald-50">
        <CircleCheck />
        <AlertTitle className="text-emerald-800">Credential Verified</AlertTitle>
        <AlertDescription className="text-xs text-emerald-700">
          This credential is authentic and confirmed on the Optimism blockchain.
        </AlertDescription>
      </Alert>
      <Card>
        <CardContent>
          <Row label="Token ID" value={`#${result.tokenId.toString()}`} mono />
          <Row label="Holder Address" value={`${result.holderAddress.slice(0, 6)}...${result.holderAddress.slice(-4)}`} />
          <Row label="Network" value="Optimism Sepolia (testnet)" />
          <Row label="Metadata" value="IPFS" />
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-row justify-around">
            <Button asChild>
              <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> View on explorer
              </Link>
            </Button>
            <Button asChild>
              <Link href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> View metadata (IPFS)
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default function VerifyForm({ initialTokenId, initialAddress }: VerifyFormProps) {
  const form = useForm({
    defaultValues: {
      tokenId: initialTokenId ?? "",
      address: initialAddress ?? "",
    },
    onSubmit: () => {}, //To be implemented
  });

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const submittedValues = hasSubmitted && form.state.isValid ? form.state.values : null;

  const parsedTokenId = submittedValues?.tokenId ? BigInt(submittedValues.tokenId.trim()) : undefined;
  const parsedAddress =
    submittedValues?.address && isAddress(submittedValues.address.trim())
      ? (submittedValues.address.trim() as `0x${string}`)
      : undefined;

  const { data, isLoading, isError } = useReadContracts({
    contracts:
      parsedTokenId !== undefined && parsedAddress
        ? [
            {
              address: CONTRACT_ADDRESS,
              abi: BECP_CREDENTIAL_ABI,
              functionName: "balanceOf",
              args: [parsedAddress, parsedTokenId],
              chainId: optimismSepolia.id,
            },
            {
              address: CONTRACT_ADDRESS,
              abi: BECP_CREDENTIAL_ABI,
              functionName: "uri",
              args: [parsedTokenId],
              chainId: optimismSepolia.id,
            },
          ]
        : [],
    query: { enabled: !!parsedTokenId && !!parsedAddress, staleTime: 30_000 },
  });

  const status: VerifyStatus = (() => {
    if (!submittedValues) return "idle";
    if (isLoading) return "loading";
    if (isError) return "error";
    if (!data) return "idle";
    const balance = data[0]?.result as bigint | undefined;
    const uri = data[1]?.result as string | undefined;
    return balance && balance > 0n && uri ? "valid" : "invalid";
  })();

  const result: VerifyResult | null =
    status === "valid" && data
      ? {
          tokenId: parsedTokenId!,
          holderAddress: parsedAddress!,
          tokenUri: data[1]?.result as string,
          balance: data[0]?.result as bigint,
        }
      : null;

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setHasSubmitted(true);
          await form.handleSubmit();
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
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={"e.g. 1"}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <FieldDescription className="text-xs">The ERC-1155 token type ID for this credential.</FieldDescription>
                </Field>
              );
            }}
          </form.Field>
          <form.Field
            name="address"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) return { message: "Wallet address is required" };
                if (!isAddress(value.trim())) return { message: "Invalid Ethereum address" };
                return undefined;
              },
            }}
          >
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Holder Wallet Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={"0x..."}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <FieldDescription className="text-xs">The wallet address of the credential holder.</FieldDescription>
                </Field>
              );
            }}
          </form.Field>
          <form.Subscribe
            selector={(s) => ({
              canSubmit: s.canSubmit,
              isSubmitting: s.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting || status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Spinner></Spinner>Verifying...
                  </>
                ) : (
                  "Verify on-chain"
                )}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
      {status === "valid" && result && <VerifySuccess result={result} />}

      {status === "invalid" && submittedValues && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <CircleX />
          <AlertTitle>Credential Not Found</AlertTitle>
          <AlertDescription className="text-xs">
            This wallet does not hold token #{submittedValues.tokenId}, or the credential has been revoked.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <CircleAlert />
          <AlertTitle>Network error</AlertTitle>
          <AlertDescription className="text-xs">
            Could not connect to the blockchain. Please check your connection and try again
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

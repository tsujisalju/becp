// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/organizer-request/[address]/route.ts
// Description      : PATCH endpoint to update an organizer request status (approve/reject/revoke).
//                    Called by the admin after approving or revoking a role on-chain.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import fs from "fs/promises";
import { isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import type { OrganizerRequest, OrganizerRequestStatus } from "../route";

const REQUESTS_DIR = path.join(process.cwd(), ".becp-organizer-requests");
const REQUESTS_FILE = path.join(REQUESTS_DIR, "requests.json");

async function readRequests(): Promise<OrganizerRequest[]> {
  try {
    const raw = await fs.readFile(REQUESTS_FILE, "utf-8");
    return JSON.parse(raw) as OrganizerRequest[];
  } catch {
    return [];
  }
}

async function writeRequests(requests: OrganizerRequest[]) {
  await fs.mkdir(REQUESTS_DIR, { recursive: true });
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf-8");
}

const VALID_STATUSES: OrganizerRequestStatus[] = ["approved", "rejected", "revoked", "pending"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { status } = body;
  if (!status || !VALID_STATUSES.includes(status as OrganizerRequestStatus)) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const requests = await readRequests();
  const addr = address.toLowerCase();
  const idx = requests.findIndex((r) => r.address === addr);

  if (idx === -1) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  requests[idx] = { ...requests[idx], status: status as OrganizerRequestStatus };
  await writeRequests(requests);

  return NextResponse.json(requests[idx]);
}

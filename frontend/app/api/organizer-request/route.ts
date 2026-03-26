// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/organizer-request/route.ts
// Description      : API route for organizer role applications. Stores pending/approved/rejected
//                    requests as a JSON file in .becp-organizer-requests/ (same pattern as profile
//                    API). GET returns the full list; POST submits a new request.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Friday, 27-Mar-2026

import fs from "fs/promises";
import { isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const REQUESTS_DIR = path.join(process.cwd(), ".becp-organizer-requests");
const REQUESTS_FILE = path.join(REQUESTS_DIR, "requests.json");

export type OrganizerRequestStatus = "pending" | "approved" | "rejected" | "revoked";

export interface OrganizerRequest {
  address: string;
  displayName: string;
  organization: string;
  reason: string;
  requestedAt: string;
  status: OrganizerRequestStatus;
}

async function ensureDir() {
  await fs.mkdir(REQUESTS_DIR, { recursive: true });
}

async function readRequests(): Promise<OrganizerRequest[]> {
  try {
    const raw = await fs.readFile(REQUESTS_FILE, "utf-8");
    return JSON.parse(raw) as OrganizerRequest[];
  } catch {
    return [];
  }
}

async function writeRequests(requests: OrganizerRequest[]) {
  await ensureDir();
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf-8");
}

export async function GET() {
  const requests = await readRequests();
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  let body: Partial<OrganizerRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { address, displayName, organization, reason } = body;

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Invalid or missing address" }, { status: 400 });
  }
  if (!displayName?.trim()) {
    return NextResponse.json({ error: "displayName is required" }, { status: 400 });
  }
  if (!organization?.trim()) {
    return NextResponse.json({ error: "organization is required" }, { status: 400 });
  }
  if (!reason?.trim()) {
    return NextResponse.json({ error: "reason is required" }, { status: 400 });
  }

  const requests = await readRequests();
  const addr = address.toLowerCase();

  // Reject duplicate pending requests
  const existing = requests.find((r) => r.address === addr);
  if (existing && (existing.status === "pending" || existing.status === "approved")) {
    return NextResponse.json({ error: "A request already exists for this address", existing }, { status: 409 });
  }

  const newRequest: OrganizerRequest = {
    address: addr,
    displayName: displayName.trim(),
    organization: organization.trim(),
    reason: reason.trim(),
    requestedAt: new Date().toISOString(),
    status: "pending",
  };

  // Replace any old rejected/revoked entry, otherwise append
  const filtered = requests.filter((r) => r.address !== addr);
  filtered.push(newRequest);
  await writeRequests(filtered);

  return NextResponse.json(newRequest, { status: 201 });
}

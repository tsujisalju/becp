// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/organizer-request/route.ts
// Description      : API route for organizer role applications. GET returns the full list;
//                    POST submits a new request. Backed by Neon Postgres via Drizzle ORM.
//                    One request per wallet address — duplicate pending/approved requests are rejected.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Tuesday, 21-Apr-2026

import { db } from "@/lib/db";
import { organizerRequests } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";

export type OrganizerRequestStatus = "pending" | "approved" | "rejected" | "revoked";

export interface OrganizerRequest {
  address: string;
  displayName: string;
  organization: string;
  reason: string;
  requestedAt: string;
  status: OrganizerRequestStatus;
}

function toResponse(row: typeof organizerRequests.$inferSelect): OrganizerRequest {
  return {
    address: row.address,
    displayName: row.displayName,
    organization: row.organization,
    reason: row.reason,
    status: row.status as OrganizerRequestStatus,
    requestedAt: row.requestedAt.toISOString(),
  };
}

export async function GET() {
  const rows = await db
    .select()
    .from(organizerRequests)
    .orderBy(desc(organizerRequests.requestedAt));
  return NextResponse.json(rows.map(toResponse));
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

  const addr = address.toLowerCase();
  const existing = await db
    .select()
    .from(organizerRequests)
    .where(eq(organizerRequests.address, addr));

  if (existing.length > 0) {
    const { status } = existing[0];
    if (status === "pending" || status === "approved") {
      return NextResponse.json(
        { error: "A request already exists for this address", existing: toResponse(existing[0]) },
        { status: 409 },
      );
    }
  }

  const now = new Date();
  const inserted = await db
    .insert(organizerRequests)
    .values({
      address: addr,
      displayName: displayName.trim(),
      organization: organization.trim(),
      reason: reason.trim(),
      status: "pending",
      requestedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: organizerRequests.address,
      set: {
        displayName: displayName.trim(),
        organization: organization.trim(),
        reason: reason.trim(),
        status: "pending",
        requestedAt: now,
        updatedAt: now,
      },
    })
    .returning();

  return NextResponse.json(toResponse(inserted[0]), { status: 201 });
}

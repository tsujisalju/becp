// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/organizer-request/[address]/route.ts
// Description      : PATCH endpoint to update an organizer request status (approve/reject/revoke).
//                    Called by the admin after approving or revoking a role on-chain.
//                    Backed by Neon Postgres via Drizzle ORM.
// First Written on : Friday, 27-Mar-2026
// Last Modified on : Tuesday, 21-Apr-2026

import { db } from "@/lib/db";
import { organizerRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";
import type { OrganizerRequestStatus } from "../route";

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
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }

  const addr = address.toLowerCase();
  const updated = await db
    .update(organizerRequests)
    .set({ status, updatedAt: new Date() })
    .where(eq(organizerRequests.address, addr))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const row = updated[0];
  return NextResponse.json({
    address: row.address,
    displayName: row.displayName,
    organization: row.organization,
    reason: row.reason,
    status: row.status,
    requestedAt: row.requestedAt.toISOString(),
  });
}

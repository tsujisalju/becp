// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/profile/[address]/route.ts
// Description      : API route for retrieving and updating per-wallet profile data
//                    (displayName, bio, careerGoal, avatarUri). Backed by Neon Postgres
//                    via Drizzle ORM. GET returns the profile or 404; PUT upserts it.
// First Written on : Thursday, 12-Mar-2026
// Last Modified on : Tuesday, 21-Apr-2026

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";

type ProfileUpdate = Partial<{
  displayName: string | null;
  bio: string | null;
  careerGoal: string | null;
  avatarUri: string | null;
}>;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const rows = await db.select().from(profiles).where(eq(profiles.address, address.toLowerCase()));
  if (rows.length === 0) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const row = rows[0];
  return NextResponse.json({
    address: row.address,
    displayName: row.displayName ?? undefined,
    bio: row.bio ?? undefined,
    careerGoal: row.careerGoal ?? undefined,
    avatarUri: row.avatarUri ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  let body: ProfileUpdate;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const addr = address.toLowerCase();
  const now = new Date();

  const existing = await db.select().from(profiles).where(eq(profiles.address, addr));

  const updated = await db
    .insert(profiles)
    .values({
      address: addr,
      displayName: "displayName" in body ? (body.displayName ?? null) : (existing[0]?.displayName ?? null),
      bio: "bio" in body ? (body.bio ?? null) : (existing[0]?.bio ?? null),
      careerGoal: "careerGoal" in body ? (body.careerGoal ?? null) : (existing[0]?.careerGoal ?? null),
      avatarUri: "avatarUri" in body ? (body.avatarUri ?? null) : (existing[0]?.avatarUri ?? null),
      createdAt: existing[0]?.createdAt ?? now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: profiles.address,
      set: {
        displayName: "displayName" in body ? (body.displayName ?? null) : existing[0]?.displayName,
        bio: "bio" in body ? (body.bio ?? null) : existing[0]?.bio,
        careerGoal: "careerGoal" in body ? (body.careerGoal ?? null) : existing[0]?.careerGoal,
        avatarUri: "avatarUri" in body ? (body.avatarUri ?? null) : existing[0]?.avatarUri,
        updatedAt: now,
      },
    })
    .returning();

  const row = updated[0];
  return NextResponse.json({
    address: row.address,
    displayName: row.displayName ?? undefined,
    bio: row.bio ?? undefined,
    careerGoal: row.careerGoal ?? undefined,
    avatarUri: row.avatarUri ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

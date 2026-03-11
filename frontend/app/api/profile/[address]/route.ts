// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/api/profile/[address]/route.ts
// Description      : API route for retrieving profile information
//                    Initially stores data in a JSON file locally as proof-of-concept
//                    Will migrate to proper database in Phase 4
// First Written on : Thursday, 12-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import fs from "fs/promises";
import { isAddress } from "viem";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const PROFILES_DIR = path.join(process.cwd(), ".becp-profiles");

async function ensureDir() {
  await fs.mkdir(PROFILES_DIR, { recursive: true });
}

function profilePath(address: string) {
  return path.join(PROFILES_DIR, `${address.toLowerCase()}.json`);
}

interface Profile {
  address: string;
  displayName: string;
  bio: string;
  careerGoal: string;
  avatarUri?: string;
  createdAt: string;
  updatedAt: string;
}

async function readProfile(address: string): Promise<Profile | null> {
  try {
    const raw = await fs.readFile(profilePath(address), "utf-8");
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

async function writeProfile(profile: Profile) {
  await ensureDir();
  await fs.writeFile(profilePath(profile.address), JSON.stringify(profile, null, 2), "utf-8");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const profile = await readProfile(address.toLowerCase());
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(profile);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  if (!isAddress(address)) {
    return NextResponse.json({ error: "InvalidAddress" }, { status: 400 });
  }

  let body: Partial<Profile>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const addr = address.toLowerCase();
  const existing = await readProfile(addr);
  const now = new Date().toISOString();

  const updated: Profile = {
    address: addr,
    displayName: body.displayName ?? existing?.displayName ?? "",
    bio: body.bio ?? existing?.bio ?? "",
    careerGoal: body.careerGoal ?? existing?.displayName ?? "",
    avatarUri: body.avatarUri ?? existing?.avatarUri,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await writeProfile(updated);
  return NextResponse.json(updated);
}

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/unit/api-profile.test.ts
// Description      : Unit tests for the /api/profile/[address] route handler.
//                    Tests GET and PUT behaviour including validation, DB reads/writes,
//                    field merging and error responses — all without a running
//                    Next.js server or real database connection.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Tuesday, 21-Apr-2026

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ── DB mock ───────────────────────────────────────────────────────────────────
// Simulates the Drizzle query builder chain without a real Neon connection.
// select().from().where() returns whatever is in profileStore for that address.
// insert().values().onConflictDoUpdate().returning() upserts and returns the row.

type ProfileRow = {
  address: string;
  displayName: string | null;
  bio: string | null;
  careerGoal: string | null;
  avatarUri: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const profileStore = new Map<string, ProfileRow>();

// Minimal types for the Drizzle SQL condition object produced by eq().
// We only need to inspect queryChunks to extract the bound address value.
interface DrizzleQueryChunk {
  value?: unknown;
}
interface DrizzleCondition {
  queryChunks?: DrizzleQueryChunk[];
  sql?: { queryChunks?: DrizzleQueryChunk[] };
}

// Capture the address being queried in where() by inspecting the SQL object
// that Drizzle's eq() produces (queryChunks[2] holds the value param).
function extractAddressFromCondition(condition: DrizzleCondition): string | null {
  try {
    const chunks = condition?.queryChunks ?? condition?.sql?.queryChunks;
    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk?.value !== undefined && typeof chunk.value === "string") {
          return chunk.value;
        }
      }
    }
  } catch {
    // fall through
  }
  return null;
}

vi.mock("@/lib/db", () => {
  return {
    db: {
      select: () => ({
        from: () => ({
          where: async (condition: DrizzleCondition) => {
            const addr = extractAddressFromCondition(condition);
            if (!addr) return [];
            const row = profileStore.get(addr);
            return row ? [row] : [];
          },
        }),
      }),
      insert: () => ({
        values: (vals: ProfileRow) => ({
          onConflictDoUpdate: (opts: { target: unknown; set: Partial<ProfileRow> }) => ({
            returning: async () => {
              const existing = profileStore.get(vals.address);
              const row: ProfileRow = existing
                ? { ...existing, ...opts.set }
                : { ...vals };
              profileStore.set(vals.address, row);
              return [row];
            },
          }),
        }),
      }),
    },
  };
});

// Import route handlers AFTER setting up the mock.
import { GET, PUT } from "@/app/api/profile/[address]/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const INVALID_ADDRESS = "not-an-address";

function makeParams(address: string) {
  return { params: Promise.resolve({ address }) };
}

function makeGetRequest(address: string) {
  return new NextRequest(`http://localhost/api/profile/${address}`);
}

function makePutRequest(address: string, body: object) {
  return new NextRequest(`http://localhost/api/profile/${address}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function seedProfile(address: string, profile: Partial<ProfileRow> & { createdAt?: string | Date }) {
  profileStore.set(address.toLowerCase(), {
    address: address.toLowerCase(),
    displayName: profile.displayName ?? null,
    bio: profile.bio ?? null,
    careerGoal: profile.careerGoal ?? null,
    avatarUri: profile.avatarUri ?? null,
    createdAt: profile.createdAt instanceof Date ? profile.createdAt : new Date(profile.createdAt ?? Date.now()),
    updatedAt: new Date(),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/profile/[address]", () => {
  beforeEach(() => {
    profileStore.clear();
  });

  it("returns 400 for an invalid Ethereum address", async () => {
    const res = await GET(makeGetRequest(INVALID_ADDRESS), makeParams(INVALID_ADDRESS));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 404 when no profile exists for the address", async () => {
    const res = await GET(makeGetRequest(VALID_ADDRESS), makeParams(VALID_ADDRESS));
    expect(res.status).toBe(404);
  });

  it("returns the profile when one exists", async () => {
    seedProfile(VALID_ADDRESS, { displayName: "Qayyum" });

    const res = await GET(makeGetRequest(VALID_ADDRESS), makeParams(VALID_ADDRESS));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.displayName).toBe("Qayyum");
    expect(body.address).toBe(VALID_ADDRESS.toLowerCase());
  });
});

describe("PUT /api/profile/[address]", () => {
  beforeEach(() => {
    profileStore.clear();
  });

  it("returns 400 for an invalid Ethereum address", async () => {
    const res = await PUT(makePutRequest(INVALID_ADDRESS, { displayName: "Test" }), makeParams(INVALID_ADDRESS));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a malformed JSON body", async () => {
    const req = new NextRequest(`http://localhost/api/profile/${VALID_ADDRESS}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "not json {{{",
    });
    const res = await PUT(req, makeParams(VALID_ADDRESS));
    expect(res.status).toBe(400);
  });

  it("creates a new profile when none exists, with createdAt and updatedAt set", async () => {
    const res = await PUT(
      makePutRequest(VALID_ADDRESS, {
        displayName: "Qayyum",
        careerGoal: "Blockchain Developer",
      }),
      makeParams(VALID_ADDRESS),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.displayName).toBe("Qayyum");
    expect(body.careerGoal).toBe("Blockchain Developer");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });

  it("normalises the address to lowercase", async () => {
    const res = await PUT(makePutRequest(VALID_ADDRESS, { displayName: "Test" }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    expect(body.address).toBe(VALID_ADDRESS.toLowerCase());
  });

  it("updates only the provided fields and preserves existing fields", async () => {
    seedProfile(VALID_ADDRESS, {
      displayName: "Original Name",
      bio: "Original bio",
      careerGoal: "Software Engineer",
    });

    const res = await PUT(makePutRequest(VALID_ADDRESS, { displayName: "Updated Name" }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    expect(body.displayName).toBe("Updated Name");
    expect(body.bio).toBe("Original bio");
    expect(body.careerGoal).toBe("Software Engineer");
  });

  it("preserves the original createdAt timestamp on subsequent updates", async () => {
    const originalCreatedAt = new Date("2026-03-01T00:00:00.000Z");
    seedProfile(VALID_ADDRESS, { displayName: "First", createdAt: originalCreatedAt });

    const res = await PUT(makePutRequest(VALID_ADDRESS, { displayName: "Second" }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    expect(body.createdAt).toBe(originalCreatedAt.toISOString());
    expect(body.updatedAt).not.toBe(originalCreatedAt.toISOString());
  });

  it("allows fields to be explicitly cleared by passing null", async () => {
    seedProfile(VALID_ADDRESS, { displayName: "Qayyum", bio: "Some bio" });

    const res = await PUT(makePutRequest(VALID_ADDRESS, { bio: null }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    expect(body.bio).toBeUndefined();
    expect(body.displayName).toBe("Qayyum");
  });
});

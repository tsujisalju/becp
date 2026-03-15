// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/unit/api-profile.test.ts
// Description      : Unit tests for the /api/profile/[address] route handler.
//                    Tests GET and PUT behaviour including validation, file I/O,
//                    field merging and error responses — all without a running
//                    Next.js server.
// First Written on : Saturday, 14-Mar-2026
// Last Written on  : Sunday, 15-Mar-2026

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ── fs/promises mock ──────────────────────────────────────────────────────────
// The route handler reads and writes JSON files under .becp-profiles/.
// We replace fs/promises entirely so no real files are touched during tests.

const mockFiles = new Map<string, string>();

vi.mock("fs/promises", () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn(async (filePath: string) => {
      const content = mockFiles.get(filePath);
      if (!content) {
        const err = new Error("ENOENT") as NodeJS.ErrnoException;
        err.code = "ENOENT";
        throw err;
      }
      return content;
    }),
    writeFile: vi.fn(async (filePath: string, content: string) => {
      mockFiles.set(filePath, content);
    }),
  },
  mkdir: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn(async (filePath: string) => {
    const content = mockFiles.get(filePath);
    if (!content) {
      const err = new Error("ENOENT") as NodeJS.ErrnoException;
      err.code = "ENOENT";
      throw err;
    }
    return content;
  }),
  writeFile: vi.fn(async (filePath: string, content: string) => {
    mockFiles.set(filePath, content);
  }),
}));

// Import route handlers AFTER mocking fs so the mock is in place when the
// module is first evaluated.
import { GET, PUT } from "@/app/api/profile/[address]/route";
import path from "path";

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

function seedProfile(address: string, profile: object) {
  const filePath = path.join(process.cwd(), ".becp-profiles", `${address}.json`);
  mockFiles.set(filePath, JSON.stringify(profile));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/profile/[address]", () => {
  beforeEach(() => {
    mockFiles.clear();
  });

  it("returns 400 for an invalid Ethereum address", async () => {
    const res = await GET(makeGetRequest(INVALID_ADDRESS), makeParams(INVALID_ADDRESS));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 404 when no profile file exists for the address", async () => {
    const res = await GET(makeGetRequest(VALID_ADDRESS), makeParams(VALID_ADDRESS));
    expect(res.status).toBe(404);
  });

  it("returns the profile JSON when a file exists", async () => {
    const stored = {
      address: VALID_ADDRESS,
      displayName: "Qayyum",
      createdAt: "2026-03-14T00:00:00.000Z",
      updatedAt: "2026-03-14T00:00:00.000Z",
    };
    seedProfile(VALID_ADDRESS, stored);

    const res = await GET(makeGetRequest(VALID_ADDRESS), makeParams(VALID_ADDRESS));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.displayName).toBe("Qayyum");
    expect(body.address).toBe(VALID_ADDRESS);
  });
});

describe("PUT /api/profile/[address]", () => {
  beforeEach(() => {
    mockFiles.clear();
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
      address: VALID_ADDRESS,
      displayName: "Original Name",
      bio: "Original bio",
      careerGoal: "Software Engineer",
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    });

    const res = await PUT(makePutRequest(VALID_ADDRESS, { displayName: "Updated Name" }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    expect(body.displayName).toBe("Updated Name");
    // Fields not in the PUT body are preserved
    expect(body.bio).toBe("Original bio");
    expect(body.careerGoal).toBe("Software Engineer");
  });

  it("preserves the original createdAt timestamp on subsequent updates", async () => {
    const originalCreatedAt = "2026-03-01T00:00:00.000Z";
    seedProfile(VALID_ADDRESS, {
      address: VALID_ADDRESS,
      displayName: "First",
      createdAt: originalCreatedAt,
      updatedAt: originalCreatedAt,
    });

    const res = await PUT(makePutRequest(VALID_ADDRESS, { displayName: "Second" }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    expect(body.createdAt).toBe(originalCreatedAt);
    // updatedAt should be a newer timestamp
    expect(body.updatedAt).not.toBe(originalCreatedAt);
  });

  it("allows fields to be explicitly cleared by passing null", async () => {
    seedProfile(VALID_ADDRESS, {
      address: VALID_ADDRESS,
      displayName: "Qayyum",
      bio: "Some bio",
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    });

    const res = await PUT(makePutRequest(VALID_ADDRESS, { bio: null }), makeParams(VALID_ADDRESS));
    const body = await res.json();
    // bio should now be absent or undefined since null was passed
    expect(body.bio).toBeUndefined();
    // displayName untouched
    expect(body.displayName).toBe("Qayyum");
  });
});

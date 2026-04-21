// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/unit/api-organizer-request.test.ts
// Description      : Unit tests for the /api/organizer-request route handlers.
//                    Covers GET (list all), POST (submit request), and PATCH (update status).
//                    Validation rules, duplicate detection, status transitions, and address
//                    normalisation are all verified without a running server or real database.
// First Written on : Tuesday, 21-Apr-2026
// Last Written on  : Tuesday, 21-Apr-2026

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// ── DB mock ───────────────────────────────────────────────────────────────────

type RequestRow = {
  address: string;
  displayName: string;
  organization: string;
  reason: string;
  status: string;
  requestedAt: Date;
  updatedAt: Date;
};

const requestStore = new Map<string, RequestRow>();

interface DrizzleQueryChunk {
  value?: unknown;
}
interface DrizzleCondition {
  queryChunks?: DrizzleQueryChunk[];
  sql?: { queryChunks?: DrizzleQueryChunk[] };
}

function extractAddress(condition: DrizzleCondition): string | null {
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

let _pendingSet: Partial<RequestRow> | null = null;

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: async (condition: DrizzleCondition) => {
          const addr = extractAddress(condition);
          if (!addr) return [];
          const row = requestStore.get(addr);
          return row ? [row] : [];
        },
        orderBy: async () => Array.from(requestStore.values()),
      }),
    }),
    insert: () => ({
      values: (vals: RequestRow) => ({
        onConflictDoUpdate: (opts: { target: unknown; set: Partial<RequestRow> }) => ({
          returning: async () => {
            const existing = requestStore.get(vals.address);
            const row: RequestRow = existing ? { ...existing, ...opts.set } : { ...vals };
            requestStore.set(vals.address, row);
            return [row];
          },
        }),
      }),
    }),
    update: () => ({
      set: (vals: Partial<RequestRow>) => {
        _pendingSet = vals;
        return {
          where: (condition: DrizzleCondition) => ({
            returning: async () => {
              const addr = extractAddress(condition);
              if (!addr) return [];
              const existing = requestStore.get(addr);
              if (!existing) return [];
              const updated: RequestRow = { ...existing, ..._pendingSet };
              requestStore.set(addr, updated);
              _pendingSet = null;
              return [updated];
            },
          }),
        };
      },
    }),
  },
}));

import { GET, POST } from "@/app/api/organizer-request/route";
import { PATCH } from "@/app/api/organizer-request/[address]/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const VALID_ADDRESS_CHECKSUMMED = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // EIP-55 form of VALID_ADDRESS
const VALID_ADDRESS_2 = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
const INVALID_ADDRESS = "not-an-address";

function makeParams(address: string) {
  return { params: Promise.resolve({ address }) };
}

function makePostRequest(body: object) {
  return new NextRequest("http://localhost/api/organizer-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makePatchRequest(address: string, body: object) {
  return new NextRequest(`http://localhost/api/organizer-request/${address}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function seedRequest(address: string, overrides: Partial<RequestRow> = {}) {
  requestStore.set(address.toLowerCase(), {
    address: address.toLowerCase(),
    displayName: "Test Organizer",
    organization: "Test Club",
    reason: "I run hackathons",
    status: "pending",
    requestedAt: new Date("2026-03-01T00:00:00.000Z"),
    updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    ...overrides,
  });
}

const VALID_POST_BODY = {
  address: VALID_ADDRESS,
  displayName: "Alice",
  organization: "APU Blockchain Club",
  reason: "I organise annual hackathons",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/organizer-request", () => {
  beforeEach(() => {
    requestStore.clear();
    _pendingSet = null;
  });

  it("returns an empty array when no requests exist", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it("returns all requests in the store", async () => {
    seedRequest(VALID_ADDRESS);
    seedRequest(VALID_ADDRESS_2, { displayName: "Bob", status: "approved" });

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
  });

  it("serialises requestedAt as an ISO string", async () => {
    seedRequest(VALID_ADDRESS);

    const res = await GET();
    const body = await res.json();
    expect(typeof body[0].requestedAt).toBe("string");
    expect(body[0].requestedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("response objects include address, displayName, organization, reason, and status", async () => {
    seedRequest(VALID_ADDRESS, { displayName: "Alice", organization: "APUBCC", reason: "Annual hackathon" });

    const res = await GET();
    const body = await res.json();
    const row = body[0];
    expect(row.address).toBeDefined();
    expect(row.displayName).toBe("Alice");
    expect(row.organization).toBe("APUBCC");
    expect(row.reason).toBe("Annual hackathon");
    expect(row.status).toBeDefined();
  });
});

describe("POST /api/organizer-request", () => {
  beforeEach(() => {
    requestStore.clear();
    _pendingSet = null;
  });

  describe("validation", () => {
    it("returns 400 for malformed JSON body", async () => {
      const req = new NextRequest("http://localhost/api/organizer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json {{{",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("returns 400 when address is missing", async () => {
      const res = await POST(makePostRequest({ displayName: "Alice", organization: "APUBCC", reason: "runs events" }));
      expect(res.status).toBe(400);
    });

    it("returns 400 for a non-Ethereum address format", async () => {
      const res = await POST(makePostRequest({ ...VALID_POST_BODY, address: INVALID_ADDRESS }));
      expect(res.status).toBe(400);
    });

    it("returns 400 when displayName is missing", async () => {
      const res = await POST(makePostRequest({ address: VALID_ADDRESS, organization: "APUBCC", reason: "runs events" }));
      expect(res.status).toBe(400);
    });

    it("returns 400 when organization is missing", async () => {
      const res = await POST(makePostRequest({ address: VALID_ADDRESS, displayName: "Alice", reason: "runs events" }));
      expect(res.status).toBe(400);
    });

    it("returns 400 when reason is missing", async () => {
      const res = await POST(makePostRequest({ address: VALID_ADDRESS, displayName: "Alice", organization: "APUBCC" }));
      expect(res.status).toBe(400);
    });

    it("returns 400 when displayName is whitespace-only", async () => {
      const res = await POST(makePostRequest({ ...VALID_POST_BODY, displayName: "   " }));
      expect(res.status).toBe(400);
    });
  });

  describe("successful submission", () => {
    it("returns 201 and the new request on valid input", async () => {
      const res = await POST(makePostRequest(VALID_POST_BODY));
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.displayName).toBe("Alice");
      expect(body.organization).toBe("APU Blockchain Club");
      expect(body.status).toBe("pending");
    });

    it("normalises the address to lowercase", async () => {
      const res = await POST(makePostRequest({ ...VALID_POST_BODY, address: VALID_ADDRESS_CHECKSUMMED }));
      const body = await res.json();
      expect(body.address).toBe(VALID_ADDRESS.toLowerCase());
    });
  });

  describe("duplicate detection", () => {
    it("returns 409 when a pending request already exists for the address", async () => {
      seedRequest(VALID_ADDRESS, { status: "pending" });
      const res = await POST(makePostRequest(VALID_POST_BODY));
      expect(res.status).toBe(409);
      const body = await res.json();
      expect(body.error).toMatch(/already exists/i);
    });

    it("returns 409 when an approved request already exists for the address", async () => {
      seedRequest(VALID_ADDRESS, { status: "approved" });
      const res = await POST(makePostRequest(VALID_POST_BODY));
      expect(res.status).toBe(409);
    });

    it("allows resubmission when the previous request was rejected", async () => {
      seedRequest(VALID_ADDRESS, { status: "rejected" });
      const res = await POST(makePostRequest(VALID_POST_BODY));
      expect(res.status).toBe(201);
    });

    it("allows resubmission when the previous request was revoked", async () => {
      seedRequest(VALID_ADDRESS, { status: "revoked" });
      const res = await POST(makePostRequest(VALID_POST_BODY));
      expect(res.status).toBe(201);
    });
  });
});

describe("PATCH /api/organizer-request/[address]", () => {
  beforeEach(() => {
    requestStore.clear();
    _pendingSet = null;
  });

  describe("validation", () => {
    it("returns 400 for an invalid Ethereum address", async () => {
      const res = await PATCH(makePatchRequest(INVALID_ADDRESS, { status: "approved" }), makeParams(INVALID_ADDRESS));
      expect(res.status).toBe(400);
    });

    it("returns 400 for malformed JSON body", async () => {
      const req = new NextRequest(`http://localhost/api/organizer-request/${VALID_ADDRESS}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: "not json {{{",
      });
      const res = await PATCH(req, makeParams(VALID_ADDRESS));
      expect(res.status).toBe(400);
    });

    it("returns 400 when status is not provided", async () => {
      seedRequest(VALID_ADDRESS);
      const res = await PATCH(makePatchRequest(VALID_ADDRESS, {}), makeParams(VALID_ADDRESS));
      expect(res.status).toBe(400);
    });

    it("returns 400 for an unrecognised status value", async () => {
      seedRequest(VALID_ADDRESS);
      const res = await PATCH(makePatchRequest(VALID_ADDRESS, { status: "deleted" }), makeParams(VALID_ADDRESS));
      expect(res.status).toBe(400);
    });
  });

  describe("successful update", () => {
    it("returns 404 when no request exists for the address", async () => {
      const res = await PATCH(makePatchRequest(VALID_ADDRESS, { status: "approved" }), makeParams(VALID_ADDRESS));
      expect(res.status).toBe(404);
    });

    it("returns 200 and the updated request after a valid status change", async () => {
      seedRequest(VALID_ADDRESS, { status: "pending" });
      const res = await PATCH(makePatchRequest(VALID_ADDRESS, { status: "approved" }), makeParams(VALID_ADDRESS));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("approved");
    });

    it("accepts all valid status values", async () => {
      for (const status of ["approved", "rejected", "revoked", "pending"] as const) {
        requestStore.clear();
        seedRequest(VALID_ADDRESS);
        const res = await PATCH(makePatchRequest(VALID_ADDRESS, { status }), makeParams(VALID_ADDRESS));
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.status).toBe(status);
      }
    });

    it("normalises address to lowercase for the lookup", async () => {
      seedRequest(VALID_ADDRESS);
      const res = await PATCH(makePatchRequest(VALID_ADDRESS_CHECKSUMMED, { status: "approved" }), makeParams(VALID_ADDRESS_CHECKSUMMED));
      expect(res.status).toBe(200);
    });
  });
});

import { NextRequest, NextResponse } from "next/server";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/rpc/[chain]/route.ts
// Description      : Server-side RPC proxy, forwards JSON-RPC requests from wagmi transports to
//                    Alchemy using the private ALCHEMY_API_KEY env var. The key is never exposed
//                    to the client bundle.
// First Written on : Sunday, 10-Mar-2026
// Last Modified on :

const ALCHEMY_URLS: Record<string, string> = {
  optimism:         "https://opt-mainnet.g.alchemy.com/v2",
  "optimism-sepolia": "https://opt-sepolia.g.alchemy.com/v2",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chain: string }> }
) {
  const { chain } = await params;

  const alchemyBase = ALCHEMY_URLS[chain];
  if (!alchemyBase) {
    return NextResponse.json(
      { error: `Unsupported chain: ${chain}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    console.error("[rpc-proxy] ALCHEMY_API_KEY is not set");
    return NextResponse.json(
      { error: "RPC provider is not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const alchemyRes = await fetch(`${alchemyBase}/${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await alchemyRes.json();

  return NextResponse.json(data, { status: alchemyRes.status });
}

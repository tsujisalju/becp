// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/metadata/route.ts
// Description      : API route for uploading JSON metadata to IPFS via Pinata.
//                    Accepts a JSON body, pins it as a named file, and returns
//                    the resulting ipfs:// URI for use in registerCredentialType().
//                    Kept server-side so the Pinata JWT is never exposed to the client.
// First Written on : Tuesday, 17-Mar-2026
// Last Modified on : Tuesday, 17-Mar-2026

import { pinata } from "@/lib/pinata/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name: string =
      typeof body?.name === "string"
        ? `becp-credential-${body.name.toLowerCase().replace(/\s+/g, "-").slice(0, 60)}.json`
        : "becp-credential-metadata.json";

    const { cid } = await pinata.upload.public.json(body).name(name);

    return NextResponse.json({ cid, uri: `ipfs://${cid}` }, { status: 200 });
  } catch (e) {
    console.error("[/api/metadata] Pinata upload failed:", e);
    return NextResponse.json({ error: "Failed to upload metadata to IPFS" }, { status: 500 });
  }
}

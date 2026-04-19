// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/api/upload-image/route.ts
// Description      : API route for uploading image files to IPFS via Pinata.
//                    Accepts multipart/form-data with a single "file" field.
//                    Validates MIME type (JPEG, PNG, WebP) and size (≤ 2 MB)
//                    before pinning to IPFS. Returns the resulting ipfs:// URI.
//                    Kept server-side so the Pinata JWT is never exposed to the client.
// First Written on : Saturday, 11-Apr-2026
// Last Modified on : Sunday, 19-Apr-2026

import { pinata } from "@/lib/pinata/config";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Image must be 2 MB or smaller" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
    const { cid } = await pinata.upload.public.file(file).name(`becp-image-${safeName}`);

    return NextResponse.json({ cid, uri: `ipfs://${cid}` }, { status: 200 });
  } catch (e) {
    console.error("[/api/upload-image] Pinata upload failed:", e);
    return NextResponse.json({ error: "Failed to upload image to IPFS" }, { status: 500 });
  }
}

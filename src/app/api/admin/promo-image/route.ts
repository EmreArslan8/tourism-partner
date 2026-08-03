import { NextResponse } from "next/server";
import { requireAdminContext } from "@/lib/admin-audit";
import { BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 8 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function hasValidSignature(bytes: Uint8Array, type: string): boolean {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/gif") return String.fromCharCode(...bytes.slice(0, 4)) === "GIF8";
  if (type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function POST(request: Request) {
  try {
    await requireAdminContext();
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "size" }, { status: 400 });

  const extension = EXTENSIONS[file.type];
  if (!extension) return NextResponse.json({ error: "type" }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type)) {
    return NextResponse.json({ error: "type" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const date = new Date();
  const path = `promo-emails/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${extension}`;
  const { error } = await admin.storage.from(BUSINESS_IMAGES_BUCKET).upload(path, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) return NextResponse.json({ error: "upload" }, { status: 502 });

  const { data } = admin.storage.from(BUSINESS_IMAGES_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}

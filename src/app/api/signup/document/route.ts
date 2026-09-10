import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_DOCUMENTS_BUCKET } from "@/lib/business-document-shape";
import { checkRateLimit } from "@/lib/rate-limit";

const SIGNUP_DOCUMENT_PREFIX = "signup-drafts/";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const allowed = await checkRateLimit({
    scope: "signup-document", limit: 20, windowSeconds: 60 * 60, identity: [clientIp(request)],
  });
  if (!allowed) return NextResponse.json({ error: "rate" }, { status: 429 });

  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "").trim().replace(/[^a-z0-9_-]/gi, "").slice(0, 80);
  if (!(file instanceof File) || !kind) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (!file.size || file.size > MAX_BYTES) return NextResponse.json({ error: "size" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "type" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const ext = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${SIGNUP_DOCUMENT_PREFIX}${crypto.randomUUID()}/${kind}/${crypto.randomUUID()}.${ext}`;
  const { error } = await admin.storage.from(BUSINESS_DOCUMENTS_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type, upsert: false,
  });
  if (error) return NextResponse.json({ error: "upload" }, { status: 502 });
  return NextResponse.json({ path });
}

export async function DELETE(request: NextRequest) {
  const allowed = await checkRateLimit({
    scope: "signup-document-delete", limit: 40, windowSeconds: 60 * 60, identity: [clientIp(request)],
  });
  if (!allowed) return NextResponse.json({ error: "rate" }, { status: 429 });

  let path = "";
  try {
    const body = await request.json() as { path?: unknown };
    path = typeof body.path === "string" ? body.path : "";
  } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (!path.startsWith(SIGNUP_DOCUMENT_PREFIX) || path.includes("..") || path.length > 500) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const { error } = await admin.storage.from(BUSINESS_DOCUMENTS_BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: "delete" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { checkRateLimit } from "@/lib/rate-limit";

/*
 * Kayıt akışı adım 3'teki kapak görseli — kullanıcı henüz doğrulanmadığı için
 * (oturum yok) storage'a RLS ile yazılamaz. Bu route dosyayı service-role ile
 * geçici bir "signup-drafts/" konumuna yükler ve yolu döner. Yol auth metadata'sına
 * yazılır; işletme kaydı oluşurken ensureBusinessForUser bunu işletmenin kapağı yapar.
 *
 * Kötüye kullanım önlemleri: IP rate limit, yalnızca görsel içerik, boyut sınırı,
 * tahmin edilemez rastgele yol. Sahiplenilmeyen draftlar periyodik temizlenmeli.
 */

export const DRAFT_PREFIX = "signup-drafts/";
const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const allowed = await checkRateLimit({
    scope: "signup-cover",
    limit: 20,
    windowSeconds: 60 * 60,
    identity: [clientIp(request)],
  });
  if (!allowed) return NextResponse.json({ error: "rate" }, { status: 429 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "size" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "type" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${DRAFT_PREFIX}${crypto.randomUUID()}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(BUSINESS_IMAGES_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: "upload" }, { status: 502 });

  return NextResponse.json({ path });
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeCronRequest } from "@/lib/cron-auth";

/* Üyelik süresi otomasyonu — bitiş tarihi geçmiş (ends_at < now) ve hâlâ active/trial
   olan üyelikleri 'expired' durumuna çeker. Vercel Cron her gece çağırır; yetki
   Authorization: Bearer <CRON_SECRET> ile doğrulanır (Vercel bu header'ı otomatik ekler).

   Manuel tetikleme: curl -H "Authorization: Bearer $CRON_SECRET" .../api/cron/expire-memberships */

export async function GET(request: Request) {
  const authorization = authorizeCronRequest(request);
  if (!authorization.ok) {
    return NextResponse.json(
      { ok: false, error: authorization.error },
      { status: authorization.status },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "service_role_unavailable" }, { status: 503 });
  }

  const nowIso = new Date().toISOString();
  const { data, error } = await admin
    .from("business_memberships")
    .update({ status: "expired" })
    .lt("ends_at", nowIso)
    .in("status", ["active", "trial"])
    .select("id");

  if (error) {
    console.error("[cron/expire-memberships] hata:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, expired: data?.length ?? 0, at: nowIso });
}

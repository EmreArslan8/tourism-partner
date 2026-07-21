import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeCronRequest } from "@/lib/cron-auth";
import { ensureBusinessForUser, listStalePendingIntents } from "@/lib/signup-intents";

/* Kayıt niyeti uzlaştırıcısı — kayıt akışının son emniyet ağı.

   Katman 1 (kayıt anında niyet yazımı) ve katman 2 (callback/giriş/panel girişinde
   idempotent tamamlama) yaygın vakayı kapatır. Bu cron, hiç geri dönmeyen kullanıcıyı
   yakalar: e-postasını doğrulamış ama uygulamaya bir daha hiç girmemiş tedarikçi
   (20 Temmuz'daki Flamingo vakası tam olarak buydu).

   Bekleyen niyet birkaç dakika içinde normal yollarla uygulanacağından yalnızca
   GRACE_MINUTES'ten eski olanlara dokunulur. Başarısızlıklar niyete (attempts/last_error)
   yazılır; MAX_INTENT_ATTEMPTS sonrası 'failed'e düşer ve log'a alarm çıkar.

   Manuel tetikleme: curl -H "Authorization: Bearer $CRON_SECRET" .../api/cron/apply-signup-intents */

const GRACE_MINUTES = 15;
const BATCH_LIMIT = 50;

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

  const intents = await listStalePendingIntents(admin, GRACE_MINUTES, BATCH_LIMIT);

  let applied = 0;
  let skipped = 0;
  let failed = 0;

  for (const intent of intents) {
    const result = await ensureBusinessForUser(intent.user_id);
    if (result.ok) {
      if (result.created) applied += 1;
      else skipped += 1;
    } else {
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error("[cron/apply-signup-intents] tamamlanamayan niyet var", { failed, scanned: intents.length });
  }

  return NextResponse.json({
    ok: true,
    scanned: intents.length,
    applied,
    skipped,
    failed,
    at: new Date().toISOString(),
  });
}

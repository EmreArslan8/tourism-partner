import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestMeta } from "@/lib/request-meta";

export type SessionEvent = "login" | "logout" | "login_failed" | "mfa_failed";

type Params = {
  userId?: string | null;
  email?: string | null;
  event: SessionEvent;
  /** Serbest ayrıntı: 'manual', 'invite-accept', hata kodu… */
  reason?: string | null;
};

/* Üye oturum olayını session_events'e yazar (giriş / çıkış / başarısız giriş).
   Yalnızca service-role yazabilir; tablo admin okumasına açıktır.
   Log yazımı asıl akışı ASLA düşürmez — hata yalnızca konsola geçer. */
export async function logSessionEvent({ userId, email, event, reason }: Params): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[session-log] yazılamadı: service_role yok", { event });
    return;
  }
  try {
    const meta = await getRequestMeta();
    const { error } = await admin.from("session_events").insert({
      user_id: userId ?? null,
      email: email ? email.slice(0, 200) : null,
      event,
      reason: reason ? reason.slice(0, 200) : null,
      ...meta,
    });
    if (error) console.error("[session-log] yazılamadı", { event, error: error.message });
  } catch (error) {
    console.error("[session-log] yazılamadı", {
      event,
      error: error instanceof Error ? error.message : error,
    });
  }
}

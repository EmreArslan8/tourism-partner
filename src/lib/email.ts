/* Basit e-posta gönderimi — Resend HTTP API (ekstra paket gerektirmez, fetch ile).
   RESEND_API_KEY ve EMAIL_FROM tanımlı değilse sessizce atlanır (uygulama akışı bozulmaz).

   Üretim için gerekli env:
     RESEND_API_KEY=re_xxx          (resend.com API anahtarı)
     EMAIL_FROM="Tourism Partner <bildirim@alanadiniz.com>"  (doğrulanmış gönderici) */

type SendArgs = { to: string; subject: string; html: string; text?: string; replyTo?: string };
type SendResult = { ok: boolean; skipped?: boolean; error?: string; id?: string };

function maskEmail(value: string) {
  const [local, domain] = value.split("@");
  return local && domain ? `${local.slice(0, 2)}***@${domain}` : "<invalid-email>";
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const startedAt = Date.now();
  console.info("[resend] request başlıyor", {
    to: maskEmail(to),
    fromConfigured: Boolean(from),
    apiKeyConfigured: Boolean(key),
    subject,
  });
  if (!key || !from) {
    const error = "RESEND_API_KEY veya EMAIL_FROM eksik";
    console.error("[resend] request gönderilmedi", { error });
    return { ok: false, skipped: true, error };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text, reply_to: replyTo }),
    });
    if (!res.ok) {
      const error = `Resend ${res.status}: ${await res.text()}`;
      console.error("[resend] API başarısız", { status: res.status, durationMs: Date.now() - startedAt, error });
      return { ok: false, error };
    }
    const body = (await res.json()) as { id?: string };
    console.info("[resend] API başarılı", { status: res.status, durationMs: Date.now() - startedAt, id: body.id, to: maskEmail(to) });
    return { ok: true, id: body.id };
  } catch (e) {
    const error = e instanceof Error ? e.message : "unknown";
    console.error("[resend] network/exception", { durationMs: Date.now() - startedAt, error });
    return { ok: false, error };
  }
}

/* Basit HTML kaçışı — kullanıcı girdisini e-posta gövdesine güvenle koymak için. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

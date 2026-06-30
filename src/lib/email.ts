/* Basit e-posta gönderimi — Resend HTTP API (ekstra paket gerektirmez, fetch ile).
   RESEND_API_KEY ve EMAIL_FROM tanımlı değilse sessizce atlanır (uygulama akışı bozulmaz).

   Üretim için gerekli env:
     RESEND_API_KEY=re_xxx          (resend.com API anahtarı)
     EMAIL_FROM="Tourism Partner <bildirim@alanadiniz.com>"  (doğrulanmış gönderici) */

type SendArgs = { to: string; subject: string; html: string; replyTo?: string };
type SendResult = { ok: boolean; skipped?: boolean; error?: string };

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { ok: false, skipped: true };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
    });
    if (!res.ok) {
      return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
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

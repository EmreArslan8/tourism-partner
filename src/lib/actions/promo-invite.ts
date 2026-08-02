"use server";

import { getPathname } from "@/i18n/navigation";
import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";
import { sendEmail } from "@/lib/email";
import { promoInviteEmail, unsubscribeMailto } from "@/lib/email-templates/promo-invite";
import { EMAIL_LOGO_URL, LOCALES, SITE_URL, type SiteLocale } from "@/lib/site";
import { clean, isEmail } from "./validate";

/* Admin panelindeki "Tanıtım Maili" sayfasının aksiyonu. Panelden gelen metinle
   kayıt daveti maili üretir ve girilen adreslere tek tek gönderir.

   Toplu gönderim kuralları (bilerek sıkı tutuldu):
   - Tek seferde en fazla MAX_RECIPIENTS alıcı; liste tekilleştirilir.
   - Gönderimler sıralı ve aralıklı — Resend'in saniyelik istek limiti aşılmaz.
     Limit x aralık toplamı, nginx'in 60 sn'lik proxy_read_timeout'unun altında
     kalmalı (bkz. deploy/nginx.conf.example): 50 x 550ms ≈ 28 sn. Limiti
     büyütürsen admin gönderim biterken 504 alır ve mükerrer gönderim riski doğar.
   - Her mailde yanıt adresi + List-Unsubscribe başlığı zorunlu.
   - Sonuç audit log'a yazılır (kim, kaç kişiye, hangi konu). */

const MAX_RECIPIENTS = 50;
const SEND_INTERVAL_MS = 550;

export type PromoInviteState = {
  ok: boolean;
  error?: string;
  /** Başarıyla gönderilen adres sayısı. */
  sent?: number;
  /** Gönderilemeyen adresler (ilk 20 tanesi gösterilir). */
  failed?: string[];
  /** Girişte elenen geçersiz adresler. */
  invalid?: string[];
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* Excel/Outlook'tan kopyalanan listeler "Ad Soyad <mail@x.com>" ya da
   "Ad Soyad mail@x.com" biçiminde gelir; adres bu kalıplardan da çıkarılır ki
   isimler geçersiz adres diye raporlanmasın. */
function extractAddress(entry: string): string {
  const angled = entry.match(/<([^>]+)>/);
  if (angled) return angled[1].trim();
  const parts = entry.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[parts.length - 1] : entry).replace(/^["']|["']$/g, "").trim();
}

function parseRecipients(raw: string): { valid: string[]; invalid: string[] } {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const entry of raw.split(/[\n,;]+/)) {
    if (!entry.trim()) continue;
    const candidate = extractAddress(entry).toLowerCase();
    if (!candidate) continue;
    if (!isEmail(candidate)) {
      if (!invalid.includes(candidate)) invalid.push(candidate);
      continue;
    }
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    valid.push(candidate);
  }

  return { valid, invalid };
}

function asLocale(value: string | null): SiteLocale {
  return (LOCALES as readonly string[]).includes(value ?? "") ? (value as SiteLocale) : "tr";
}

/** Kayıt sayfasının tam URL'i — kampanya takibi için utm parametreleriyle. */
function registerUrl(locale: SiteLocale, campaign: string): string {
  const path = getPathname({ locale, href: "/register" });
  const params = new URLSearchParams({
    utm_source: "email",
    utm_medium: "outreach",
    utm_campaign: campaign,
  });
  return `${SITE_URL}${path}?${params.toString()}`;
}

export async function sendPromoInvites(
  _prev: PromoInviteState,
  formData: FormData,
): Promise<PromoInviteState> {
  let context;
  try {
    context = await requireAdminContext();
  } catch {
    return { ok: false, error: "forbidden" };
  }

  const locale = asLocale(clean(formData.get("locale"), 8) ?? null);
  const subject = clean(formData.get("subject"), 200);
  const headline = clean(formData.get("headline"), 200);
  const intro = clean(formData.get("intro"), 4000);
  const ctaLabel = clean(formData.get("ctaLabel"), 60);
  const preheader = clean(formData.get("preheader"), 200) ?? "";
  const replyTo = clean(formData.get("replyTo"), 160);
  const senderName = clean(formData.get("senderName"), 160) ?? "Tourism Partner";
  const senderAddress = clean(formData.get("senderAddress"), 240) ?? "";
  const campaign = (clean(formData.get("campaign"), 60) ?? "tanitim")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tanitim";
  const bullets = (clean(formData.get("bullets"), 2000) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!subject || !headline || !intro || !ctaLabel) return { ok: false, error: "missing_content" };
  if (!replyTo || !isEmail(replyTo)) return { ok: false, error: "invalid_reply_to" };

  const { valid, invalid } = parseRecipients(String(formData.get("recipients") ?? ""));
  if (valid.length === 0) return { ok: false, error: "no_recipients", invalid };
  if (valid.length > MAX_RECIPIENTS) return { ok: false, error: "too_many_recipients", invalid };

  const message = promoInviteEmail({
    locale,
    preheader: preheader || headline,
    headline,
    intro,
    bullets,
    ctaLabel,
    registerUrl: registerUrl(locale, campaign),
    logoUrl: EMAIL_LOGO_URL,
    senderName,
    senderAddress,
    unsubscribeEmail: replyTo,
  });

  // Gmail/Outlook'un "abonelikten çık" düğmesini gösterebilmesi için başlık.
  const headers = { "List-Unsubscribe": `<${unsubscribeMailto(replyTo, locale)}>` };

  const failed: string[] = [];
  let sent = 0;

  for (const [index, recipient] of valid.entries()) {
    if (index > 0) await wait(SEND_INTERVAL_MS);
    const delivery = await sendEmail({
      to: recipient,
      subject,
      html: message.html,
      text: message.text,
      replyTo,
      headers,
    });
    if (delivery.ok) sent += 1;
    else failed.push(recipient);
  }

  await writeAdminAudit(context, "promo.invite.send", "email", null, {
    campaign,
    locale,
    subject,
    reply_to: replyTo,
    recipients: valid.length,
    sent,
    failed: failed.length,
  });

  if (sent === 0) return { ok: false, error: "all_failed", failed: failed.slice(0, 20), invalid };
  return { ok: true, sent, failed: failed.slice(0, 20), invalid };
}

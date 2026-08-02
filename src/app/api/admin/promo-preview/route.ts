import { requireAdminContext } from "@/lib/admin-audit";
import { promoInviteEmail } from "@/lib/email-templates/promo-invite";
import { EMAIL_LOGO_URL, LOCALES, SITE_URL, type SiteLocale } from "@/lib/site";
import { getPathname } from "@/i18n/navigation";

/* Tanıtım maili önizlemesi — panelde iframe içinde gösterilir. Yalnızca HTML
   üretir, hiçbir şey göndermez ve kaydetmez. */

export async function POST(request: Request) {
  try {
    await requireAdminContext();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const form = await request.formData();
  const value = (key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
  const localeRaw = value("locale", 8);
  const locale: SiteLocale = (LOCALES as readonly string[]).includes(localeRaw)
    ? (localeRaw as SiteLocale)
    : "tr";

  const headline = value("headline", 200) || "Başlık";
  const replyTo = value("replyTo", 160) || "sales@tourismpartner.com";

  const { html } = promoInviteEmail({
    locale,
    preheader: value("preheader", 200) || headline,
    headline,
    intro: value("intro", 4000),
    bullets: value("bullets", 2000).split("\n").map((line) => line.trim()).filter(Boolean),
    ctaLabel: value("ctaLabel", 60) || "Ücretsiz kayıt ol",
    registerUrl: `${SITE_URL}${getPathname({ locale, href: "/register" })}?utm_source=email&utm_medium=outreach&utm_campaign=${encodeURIComponent(value("campaign", 60) || "tanitim")}`,
    logoUrl: EMAIL_LOGO_URL,
    senderName: value("senderName", 160) || "Tourism Partner",
    senderAddress: value("senderAddress", 240),
    unsubscribeEmail: replyTo,
  });

  // Yanıt sadece iframe'e basılan bir önizleme; tarayıcı bunu uygulama
  // kaynağında çalışan bir sayfa gibi ele almasın.
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-security-policy": "sandbox",
    },
  });
}

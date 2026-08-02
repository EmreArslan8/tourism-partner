import { escapeHtml } from "@/lib/email";
import type { SiteLocale } from "@/lib/site";

/* Tanıtım / kayıt daveti maili — admin panelinden (Tanıtım Maili sayfası) elle
   gönderilir. Diğer şablonların aksine metinler burada sabit değil; başlık,
   gövde, madde listesi ve buton yazısı panelden gelir. Şablon yalnızca kurumsal
   çerçeveyi (logo, renk, buton, alt bilgi) ve HTML güvenliğini sağlar.

   Ticari ileti olduğu için alt bilgide gönderici kimliği ve "listeden çık"
   bağlantısı ZORUNLU tutulur — ikisi de argüman olarak istenir. */

export type PromoInviteEmailArgs = {
  locale: SiteLocale;
  /** Mailin ilk satırı — gelen kutusunda konu başlığının yanında görünür. */
  preheader: string;
  headline: string;
  /** Boş satırla ayrılmış paragraflar. */
  intro: string;
  /** Satır başına bir madde; boş bırakılırsa liste bloğu render edilmez. */
  bullets: string[];
  ctaLabel: string;
  registerUrl: string;
  logoUrl: string;
  senderName: string;
  senderAddress: string;
  unsubscribeEmail: string;
};

const FOOTER: Record<SiteLocale, { unsubscribe: string; why: string }> = {
  tr: {
    unsubscribe: "Listeden çık",
    why: "Bu e-postayı, turizm sektöründeki işletmelere yönelik tanıtım gönderimi kapsamında aldınız.",
  },
  en: {
    unsubscribe: "Unsubscribe",
    why: "You received this email as part of an outreach to businesses in the tourism industry.",
  },
  ru: {
    unsubscribe: "Отписаться",
    why: "Вы получили это письмо в рамках рассылки для компаний туристической отрасли.",
  },
  ar: {
    unsubscribe: "إلغاء الاشتراك",
    why: "لقد تلقيت هذه الرسالة ضمن حملة تعريفية موجهة لشركات قطاع السياحة.",
  },
};

/** mailto: tabanlı çıkış bağlantısı — ayrı bir tablo/route gerektirmez. */
export function unsubscribeMailto(email: string, locale: SiteLocale): string {
  const subject = locale === "tr" ? "Listeden çıkmak istiyorum" : "Unsubscribe";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function promoInviteEmail({
  locale,
  preheader,
  headline,
  intro,
  bullets,
  ctaLabel,
  registerUrl,
  logoUrl,
  senderName,
  senderAddress,
  unsubscribeEmail,
}: PromoInviteEmailArgs) {
  const copy = FOOTER[locale] ?? FOOTER.tr;
  const rtl = locale === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";

  const paragraphs = intro
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const items = bullets.map((item) => item.trim()).filter(Boolean);
  const unsubscribeUrl = unsubscribeMailto(unsubscribeEmail, locale);

  const paragraphHtml = paragraphs
    .map(
      (block) =>
        `<p style="margin:0 0 14px;color:#334155;font-size:15px;line-height:25px;">${escapeHtml(block).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const bulletsHtml = items.length
    ? `<tr>
                    <td style="padding:8px 38px 0;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:12px;background:#f4f7ff;">
                        <tr>
                          <td style="padding:18px 20px;text-align:${align};">
                            ${items
                              .map(
                                (item) =>
                                  `<div style="margin-bottom:9px;color:#334155;font-size:14px;line-height:22px;"><span style="color:#004fe6;font-weight:900;">•</span>&nbsp;&nbsp;${escapeHtml(item)}</div>`,
                              )
                              .join("")}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`
    : "";

  return {
    html: `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(headline)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f5fa;color:#0b102f;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;" dir="${dir}">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f5fa;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;margin:0 auto;">
            <tr>
              <td style="overflow:hidden;border:1px solid #dfe5ef;border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(1,20,93,0.08);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:#01145d;padding:32px 38px 34px;text-align:${align};">
                      <img src="${escapeHtml(logoUrl)}" width="164" height="100" alt="Tourism Partner" style="display:block;${rtl ? "margin-left:auto;margin-right:0;" : ""}width:164px;height:100px;max-width:100%;border:0;">
                      <h1 style="margin:22px 0 0;color:#ffffff;font-size:27px;line-height:34px;letter-spacing:-0.7px;">${escapeHtml(headline)}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 0;text-align:${align};">
                      ${paragraphHtml}
                    </td>
                  </tr>
                  ${bulletsHtml}
                  <tr>
                    <td style="padding:26px 38px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="${rtl ? "margin-left:auto;margin-right:0;" : "margin-right:auto;margin-left:0;"}">
                        <tr>
                          <td style="border-radius:11px;background:#004fe6;">
                            <a href="${escapeHtml(registerUrl)}" style="display:inline-block;padding:15px 26px;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;">${escapeHtml(ctaLabel)}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 38px 34px;text-align:${align};">
                      <p style="margin:0;color:#7b8498;font-size:12px;line-height:19px;word-break:break-all;">${escapeHtml(registerUrl)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                <div style="font-weight:700;color:#68718a;">${escapeHtml(senderName)}</div>
                <div style="margin-top:3px;">${escapeHtml(senderAddress)}</div>
                <div style="margin-top:9px;">${escapeHtml(copy.why)}</div>
                <div style="margin-top:9px;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#68718a;text-decoration:underline;">${escapeHtml(copy.unsubscribe)}</a></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `${headline}

${paragraphs.join("\n\n")}
${items.length ? `\n${items.map((item) => `- ${item}`).join("\n")}\n` : ""}
${ctaLabel}: ${registerUrl}

${senderName}
${senderAddress}
${copy.why}
${copy.unsubscribe}: ${unsubscribeEmail}`,
  };
}

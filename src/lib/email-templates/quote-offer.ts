import { escapeHtml } from "@/lib/email";

/* Tedarikçinin gelen teklife verdiği yanıt (fiyat teklifi) — teklifi İSTEYENE
   gider. Markalı stil, gelen-teklif bildirimiyle (quote-notification) aynı;
   böylece iletişim platform üzerinden döner ve markamız mailde geçer.
   replyTo işletmenin e-postası olur: isteyen "Yanıtla" derse doğrudan işletmeye ulaşır. */
type QuoteOfferInput = {
  businessName: string;
  logoUrl: string;
  recipientName: string;
  offerMessage: string;
  service?: string | null;
  businessEmail?: string | null;
};

type QuoteOffer = {
  subject: string;
  html: string;
  text: string;
};

export function quoteOfferEmail(input: QuoteOfferInput): QuoteOffer {
  const subject = `Your quote from ${input.businessName}`;
  const messageHtml = escapeHtml(input.offerMessage).replace(/\r?\n/g, "<br>");
  const replyUrl = input.businessEmail
    ? `mailto:${encodeURIComponent(input.businessEmail)}?subject=${encodeURIComponent(`Re: Your quote from ${input.businessName}`)}`
    : null;
  const serviceLine = input.service
    ? `<p style="margin:0;color:#dbe5ff;font-size:15px;line-height:24px;">Regarding your request for <strong style="color:#ffffff;">${escapeHtml(input.service)}</strong>.</p>`
    : "";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f5fa;color:#0b102f;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(input.businessName)} sent you a quote.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f5fa;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;">
            <tr>
              <td style="overflow:hidden;border:1px solid #dfe5ef;border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(1,20,93,0.08);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:#01145d;padding:34px 38px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td width="74" style="width:74px;padding-right:18px;vertical-align:middle;">
                            <img src="${escapeHtml(input.logoUrl)}" width="64" height="64" alt="Tourism Partner" style="display:block;width:64px;height:64px;border:0;border-radius:14px;object-fit:cover;">
                          </td>
                          <td style="vertical-align:middle;">
                            <div style="display:inline-block;margin-bottom:12px;border-radius:999px;background:#ffffff1f;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">YOUR QUOTE</div>
                            <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">You have a quote</h1>
                            <p style="margin:0 0 6px;color:#dbe5ff;font-size:15px;line-height:24px;"><strong style="color:#ffffff;">${escapeHtml(input.businessName)}</strong> replied to your request.</p>
                            ${serviceLine}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 0;">
                      <p style="margin:0 0 16px;color:#0b102f;font-size:15px;line-height:24px;">Hi ${escapeHtml(input.recipientName)},</p>
                      <div style="margin-bottom:10px;color:#64748b;font-size:11px;font-weight:800;letter-spacing:0.7px;">QUOTE FROM ${escapeHtml(input.businessName.toUpperCase())}</div>
                      <div style="border-left:4px solid #004fe6;border-radius:0 12px 12px 0;background:#f4f7ff;padding:18px 20px;color:#334155;font-size:14px;line-height:23px;">${messageHtml}</div>
                    </td>
                  </tr>
                  ${replyUrl ? `<tr>
                    <td style="padding:26px 38px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius:11px;background:#01145d;">
                            <a href="${escapeHtml(replyUrl)}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;">Reply to ${escapeHtml(input.businessName)}</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:18px 0 0;color:#7b8498;font-size:12px;line-height:19px;">When you reply, your message will be sent to ${escapeHtml(input.businessEmail ?? "")}.</p>
                    </td>
                  </tr>` : `<tr><td style="padding:0 38px 36px;"></td></tr>`}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                Tourism Partner · The trusted business network for tourism professionals<br>
                This email was sent because you requested a quote through Tourism Partner.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hi ${input.recipientName},`,
    "",
    `${input.businessName} replied to your quote request${input.service ? ` for ${input.service}` : ""}:`,
    "",
    input.offerMessage,
    "",
    input.businessEmail ? `Reply directly: ${input.businessEmail}` : "",
    "— via Tourism Partner",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}

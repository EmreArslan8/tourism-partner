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
  /* Yanıtın hangi talebe verildiğini netleştiren orijinal talep özeti.
     Alanlar talep bildirim mailiyle (quote-notification) birebir eşleşir. */
  request?: {
    requesterName?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    service?: string | null;
    category?: string | null;
    location?: string | null;
    dateRange?: string | null;
    people?: number | null;
    validUntil?: string | null;
    message?: string | null;
    requestedAt?: string | null;
  };
};

type QuoteOffer = {
  subject: string;
  html: string;
  text: string;
};

function formatDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${value}T12:00:00+03:00`));
}

function formatDateRange(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.split(" - ").map((part) => formatDate(part)).join(" – ");
}

export function quoteOfferEmail(input: QuoteOfferInput): QuoteOffer {
  const subject = `Your quote from ${input.businessName}`;
  const messageHtml = escapeHtml(input.offerMessage).replace(/\r?\n/g, "<br>");

  const req = input.request;
  const requestDetails = req
    ? ([
        ["Requester", req.requesterName ?? null],
        ["Company", req.company ?? null],
        ["Email", req.email ?? null],
        ["Phone", req.phone ?? null],
        ["Service", req.service ?? input.service ?? null],
        ["Category", req.category ?? null],
        ["Region", req.location ?? null],
        ["Service date", formatDateRange(req.dateRange)],
        ["Number of guests", req.people != null ? `${req.people.toLocaleString("en-US")} guests` : null],
        ["Quote deadline", req.validUntil ? formatDate(req.validUntil) : null],
        ["Requested on", req.requestedAt ? formatDate(req.requestedAt) : null],
      ].filter((row): row is [string, string] => Boolean(row[1])))
    : [];
  const requestRows = requestDetails
    .map(([label, value], index) => `
      <tr>
        <td style="padding:${index === 0 ? "0" : "12px"} 16px 12px 0;border-bottom:1px solid #e8edf5;color:#64748b;font-size:12.5px;line-height:19px;vertical-align:top;width:40%;">${escapeHtml(label)}</td>
        <td style="padding:${index === 0 ? "0" : "12px"} 0 12px;border-bottom:1px solid #e8edf5;color:#17151c;font-size:13.5px;font-weight:700;line-height:19px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`)
    .join("");
  const requestNoteHtml = req?.message ? escapeHtml(req.message).replace(/\r?\n/g, "<br>") : null;
  const requestBlock = requestDetails.length || requestNoteHtml
    ? `<tr>
                    <td style="padding:26px 38px 0;">
                      <div style="margin-bottom:12px;color:#64748b;font-size:11px;font-weight:800;letter-spacing:0.7px;">IN RESPONSE TO YOUR REQUEST</div>
                      ${requestDetails.length ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${requestRows}</table>` : ""}
                      ${requestNoteHtml ? `<div style="margin-top:14px;border-radius:12px;background:#f7f9fc;padding:14px 16px;color:#475569;font-size:13px;line-height:21px;"><span style="display:block;margin-bottom:4px;color:#94a3b8;font-size:11px;font-weight:800;letter-spacing:0.6px;">YOUR NOTE</span>${requestNoteHtml}</div>` : ""}
                    </td>
                  </tr>`
    : "";
  const replyUrl = input.businessEmail
    ? `mailto:${encodeURIComponent(input.businessEmail)}?subject=${encodeURIComponent(`Re: Your quote from ${input.businessName}`)}`
    : null;
  const serviceLine = input.service
    ? `<p style="margin:0;color:#ede9fe;font-size:15px;line-height:24px;">Regarding your request for <strong style="color:#ffffff;">${escapeHtml(input.service)}</strong>.</p>`
    : "";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f5ff;color:#17151c;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(input.businessName)} sent you a quote.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f7f5ff;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;">
            <tr>
              <td style="padding:0 6px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${escapeHtml(input.logoUrl)}" width="150" height="60" alt="Tourism Partner" style="display:block;width:150px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
                    </td>
                    <td align="right" style="color:#6b6675;font-size:11px;font-weight:700;letter-spacing:1px;vertical-align:middle;">B2B TOURISM NETWORK</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow:hidden;border:1px solid #ddd6fe;border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(76,29,149,0.10);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:#4c1d95;padding:34px 38px;">
                      <div style="display:inline-block;margin-bottom:12px;border-radius:999px;background:#6d28d9;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">YOUR QUOTE</div>
                      <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">You have a quote</h1>
                      <p style="margin:0 0 6px;color:#ede9fe;font-size:15px;line-height:24px;"><strong style="color:#ffffff;">${escapeHtml(input.businessName)}</strong> replied to your request.</p>
                      ${serviceLine}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 0;">
                      <p style="margin:0 0 16px;color:#17151c;font-size:15px;line-height:24px;">Hi ${escapeHtml(input.recipientName)},</p>
                      <div style="margin-bottom:10px;color:#64748b;font-size:11px;font-weight:800;letter-spacing:0.7px;">QUOTE FROM ${escapeHtml(input.businessName.toUpperCase())}</div>
                      <div style="border-left:4px solid #6d28d9;border-radius:0 12px 12px 0;background:#f7f5ff;padding:18px 20px;color:#334155;font-size:14px;line-height:23px;">${messageHtml}</div>
                    </td>
                  </tr>
                  ${requestBlock}
                  ${replyUrl ? `<tr>
                    <td style="padding:26px 38px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius:11px;background:#4c1d95;">
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

  const requestText = requestDetails.length
    ? ["", "In response to your request:", ...requestDetails.map(([label, value]) => `- ${label}: ${value}`)]
    : [];
  const text = [
    `Hi ${input.recipientName},`,
    "",
    `${input.businessName} replied to your quote request${input.service ? ` for ${input.service}` : ""}:`,
    "",
    input.offerMessage,
    ...requestText,
    "",
    input.businessEmail ? `Reply directly: ${input.businessEmail}` : "",
    "— via Tourism Partner",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}

import { escapeHtml } from "@/lib/email";

/* BİLDİRİM maili — talebin kendisi değil, varlığı duyurulur.
   Talep sahibinin adı/firması/e-postası/telefonu ve serbest metni BİLİNÇLİ
   olarak yoktur: bunlar mailde paylaşıldığında taraflar platform dışında
   anlaşabiliyordu (admin'deki "harici iletişim riski" kontrolü tam bu yüzden
   var). Tedarikçi detayı görmek ve yanıtlamak için panele gelir. */
type QuoteNotificationInput = {
  businessName: string;
  service: string | null;
  category: string | null;
  location: string | null;
  validUntil: string;
  dashboardUrl: string;
  logoUrl: string;
};

type QuoteNotification = {
  subject: string;
  html: string;
  text: string;
};

export function formatDate(value: string, locale: string = "en-US"): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${value}T12:00:00+03:00`));
}

export function quoteNotificationEmail(input: QuoteNotificationInput): QuoteNotification {
  // Keep this transactional; promotional language can increase the chance of
  // Gmail classifying the email as marketing.
  const area = input.location ?? input.category ?? input.service;
  const subject = area
    ? `New request in ${area} — ${input.businessName}`
    : `New request for ${input.businessName}`;
  const deadline = formatDate(input.validUntil);
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f5ff;color:#17151c;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">You received a new quote request for ${escapeHtml(input.businessName)}.</div>
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
                      <div style="display:inline-block;margin-bottom:12px;border-radius:999px;background:#6d28d9;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">NEW REQUEST</div>
                      <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">${escapeHtml(area ? `A new request in ${area}` : "A new request for you")}</h1>
                      <p style="margin:0;color:#ede9fe;font-size:15px;line-height:24px;">A traveller is looking for a supplier that matches <strong style="color:#ffffff;">${escapeHtml(input.businessName)}</strong>. Open your dashboard to see the full request and send your quote.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 0;">
                      <p style="margin:0;color:#334155;font-size:15px;line-height:24px;">The full brief is waiting in your dashboard. Suppliers who reply first are usually the ones who win the booking.</p>
                      <p style="margin:12px 0 0;color:#8a5700;font-size:13px;font-weight:700;line-height:20px;">Replies close on ${escapeHtml(deadline)}.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius:11px;background:#4c1d95;">
                            <a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;padding:14px 22px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;">See the request and reply</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:18px 0 0;color:#7b8498;font-size:12px;line-height:19px;">Replies to this notification are not delivered to the requester. Send your quote from the dashboard so it reaches them.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                Tourism Partner · The trusted business network for tourism professionals<br>
                You are receiving this because a request matching your business was submitted.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${subject}

A traveller is looking for a supplier that matches ${input.businessName}.
The full brief is waiting in your dashboard. Replies close on ${deadline}.

See the request and reply: ${input.dashboardUrl}

Replies to this notification are not delivered to the requester.

Tourism Partner`;

  return { subject, html, text };
}

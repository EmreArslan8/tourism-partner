import { escapeHtml } from "@/lib/email";

type QuoteNotificationInput = {
  businessName: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  company: string | null;
  service: string | null;
  category: string | null;
  location: string | null;
  dateRange: string | null;
  validUntil: string;
  people: number | null;
  message: string | null;
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

function formatDateRange(value: string | null): string | null {
  if (!value) return null;
  return value
    .split(" - ")
    .map((part) => formatDate(part))
    .join(" – ");
}

export function quoteNotificationEmail(input: QuoteNotificationInput): QuoteNotification {
  // Keep this transactional; promotional language can increase the chance of
  // Gmail classifying the email as marketing.
  const subject = `Quote request received — ${input.businessName}`;
  const details = [
    ["Requester", input.senderName],
    ["Company", input.company],
    ["Email", input.senderEmail],
    ["Phone", input.senderPhone],
    ["Service", input.service],
    ["Category", input.category],
    ["Region", input.location],
    ["Service date", formatDateRange(input.dateRange)],
    ["Number of guests", input.people != null ? `${input.people.toLocaleString("en-US")} guests` : null],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const deadline = formatDate(input.validUntil);
  const replyUrl = `mailto:${encodeURIComponent(input.senderEmail)}?subject=${encodeURIComponent(`About your quote request — ${input.businessName}`)}`;
  const messageHtml = input.message
    ? escapeHtml(input.message).replace(/\r?\n/g, "<br>")
    : "The requester did not share an additional note.";
  const detailRows = details
    .map(([label, value], index) => `
      <tr>
        <td style="padding:${index === 0 ? "0" : "15px"} 16px 15px 0;border-bottom:1px solid #e8edf5;color:#64748b;font-size:13px;line-height:20px;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
        <td style="padding:${index === 0 ? "0" : "15px"} 0 15px;border-bottom:1px solid #e8edf5;color:#0b102f;font-size:14px;font-weight:700;line-height:20px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`)
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f5fa;color:#0b102f;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">You received a new quote request for ${escapeHtml(input.businessName)}.</div>
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
                            <div style="display:inline-block;margin-bottom:12px;border-radius:999px;background:#ffffff1f;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">QUOTE REQUEST</div>
                            <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">Quote request received</h1>
                            <p style="margin:0;color:#dbe5ff;font-size:15px;line-height:24px;"><strong style="color:#ffffff;">${escapeHtml(input.businessName)}</strong> received a new quote request.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 8px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:12px;background:#fff7e8;">
                        <tr>
                          <td style="padding:17px 18px;">
                            <div style="color:#8a5700;font-size:11px;font-weight:800;letter-spacing:0.7px;">QUOTE DEADLINE</div>
                            <div style="margin-top:5px;color:#5b3900;font-size:18px;font-weight:800;line-height:24px;">${escapeHtml(deadline)}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 38px 0;">
                      <h2 style="margin:0 0 16px;color:#0b102f;font-size:17px;line-height:24px;">Request details</h2>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows}</table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:26px 38px 0;">
                      <div style="margin-bottom:10px;color:#64748b;font-size:11px;font-weight:800;letter-spacing:0.7px;">REQUEST NOTE</div>
                      <div style="border-left:4px solid #004fe6;border-radius:0 12px 12px 0;background:#f4f7ff;padding:18px 20px;color:#334155;font-size:14px;line-height:23px;">${messageHtml}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius:11px;background:#01145d;">
                            <a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;">View request in dashboard</a>
                          </td>
                          <td style="padding-left:10px;">
                            <a href="${escapeHtml(replyUrl)}" style="display:inline-block;padding:13px 17px;border:1px solid #cbd5e1;border-radius:11px;color:#01145d;font-size:14px;font-weight:800;text-decoration:none;">Reply by email</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:18px 0 0;color:#7b8498;font-size:12px;line-height:19px;">When you reply directly to this notification, your message will be sent to ${escapeHtml(input.senderEmail)}.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                Tourism Partner · The trusted business network for tourism professionals<br>
                This email was sent because a quote request was submitted to your business.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const detailText = details.map(([label, value]) => `${label}: ${value}`).join("\n");
  const text = `Quote request received — ${input.businessName}

${input.businessName} received a new quote request.
Quote deadline: ${deadline}

${detailText}

Request note:
${input.message || "The requester did not share an additional note."}

View request in dashboard: ${input.dashboardUrl}
Reply by email: ${input.senderEmail}

Tourism Partner`;

  return { subject, html, text };
}

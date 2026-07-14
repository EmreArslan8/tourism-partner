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

function formatDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("tr-TR", {
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
    .map(formatDate)
    .join(" – ");
}

export function quoteNotificationEmail(input: QuoteNotificationInput): QuoteNotification {
  const subject = `Yeni teklif talebi — ${input.businessName}`;
  const details = [
    ["Talebi gönderen", input.senderName],
    ["Şirket", input.company],
    ["E-posta", input.senderEmail],
    ["Telefon", input.senderPhone],
    ["Hizmet", input.service],
    ["Kategori", input.category],
    ["Bölge", input.location],
    ["Hizmet tarihi", formatDateRange(input.dateRange)],
    ["Kişi sayısı", input.people != null ? `${input.people.toLocaleString("tr-TR")} kişi` : null],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const deadline = formatDate(input.validUntil);
  const replyUrl = `mailto:${encodeURIComponent(input.senderEmail)}?subject=${encodeURIComponent(`Teklif talebiniz hakkında — ${input.businessName}`)}`;
  const messageHtml = input.message
    ? escapeHtml(input.message).replace(/\r?\n/g, "<br>")
    : "Talebi gönderen kişi ek bir açıklama paylaşmadı.";
  const detailRows = details
    .map(([label, value], index) => `
      <tr>
        <td style="padding:${index === 0 ? "0" : "15px"} 16px 15px 0;border-bottom:1px solid #e8edf5;color:#64748b;font-size:13px;line-height:20px;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
        <td style="padding:${index === 0 ? "0" : "15px"} 0 15px;border-bottom:1px solid #e8edf5;color:#0b102f;font-size:14px;font-weight:700;line-height:20px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`)
    .join("");

  const html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f5fa;color:#0b102f;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(input.businessName)} için yeni bir teklif talebi aldınız.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f5fa;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;">
            <tr>
              <td style="padding:0 6px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="54" style="width:54px;padding-right:12px;vertical-align:middle;">
                      <img src="${escapeHtml(input.logoUrl)}" width="48" height="48" alt="Tourism Partner" style="display:block;width:48px;height:48px;border:0;border-radius:11px;object-fit:cover;">
                    </td>
                    <td style="color:#01145d;font-size:17px;font-weight:900;letter-spacing:-0.3px;vertical-align:middle;">TOURISM <span style="color:#004fe6;">PARTNER</span></td>
                    <td align="right" style="color:#7b8498;font-size:11px;font-weight:700;letter-spacing:1px;">B2B TURİZM AĞI</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow:hidden;border:1px solid #dfe5ef;border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(1,20,93,0.08);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:#01145d;padding:34px 38px;">
                      <div style="display:inline-block;margin-bottom:16px;border-radius:999px;background:#ffffff1f;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">YENİ TALEP</div>
                      <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">Yeni bir teklif fırsatı var</h1>
                      <p style="margin:0;color:#dbe5ff;font-size:15px;line-height:24px;"><strong style="color:#ffffff;">${escapeHtml(input.businessName)}</strong> için yeni bir teklif talebi aldınız.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 8px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:12px;background:#fff7e8;">
                        <tr>
                          <td style="padding:17px 18px;">
                            <div style="color:#8a5700;font-size:11px;font-weight:800;letter-spacing:0.7px;">TEKLİF İÇİN SON TARİH</div>
                            <div style="margin-top:5px;color:#5b3900;font-size:18px;font-weight:800;line-height:24px;">${escapeHtml(deadline)}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 38px 0;">
                      <h2 style="margin:0 0 16px;color:#0b102f;font-size:17px;line-height:24px;">Talep detayları</h2>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows}</table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:26px 38px 0;">
                      <div style="margin-bottom:10px;color:#64748b;font-size:11px;font-weight:800;letter-spacing:0.7px;">TALEP NOTU</div>
                      <div style="border-left:4px solid #004fe6;border-radius:0 12px 12px 0;background:#f4f7ff;padding:18px 20px;color:#334155;font-size:14px;line-height:23px;">${messageHtml}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius:11px;background:#01145d;">
                            <a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;">Talebi panelde görüntüle</a>
                          </td>
                          <td style="padding-left:10px;">
                            <a href="${escapeHtml(replyUrl)}" style="display:inline-block;padding:13px 17px;border:1px solid #cbd5e1;border-radius:11px;color:#01145d;font-size:14px;font-weight:800;text-decoration:none;">E-posta ile yanıtla</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:18px 0 0;color:#7b8498;font-size:12px;line-height:19px;">Bu bildirime doğrudan yanıt verdiğinizde mesajınız ${escapeHtml(input.senderEmail)} adresine iletilir.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                Tourism Partner · Turizm profesyonelleri için güvenilir iş ağı<br>
                Bu e-posta, işletmenize gönderilen bir teklif talebi nedeniyle iletildi.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const detailText = details.map(([label, value]) => `${label}: ${value}`).join("\n");
  const text = `Yeni teklif talebi — ${input.businessName}

${input.businessName} için yeni bir teklif talebi aldınız.
Teklif için son tarih: ${deadline}

${detailText}

Talep notu:
${input.message || "Talebi gönderen kişi ek bir açıklama paylaşmadı."}

Talebi panelde görüntüle: ${input.dashboardUrl}
E-posta ile yanıtla: ${input.senderEmail}

Tourism Partner`;

  return { subject, html, text };
}

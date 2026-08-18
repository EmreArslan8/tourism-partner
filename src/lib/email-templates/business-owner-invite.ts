import { escapeHtml } from "@/lib/email";

type BusinessOwnerInviteEmailArgs = {
  businessName: string;
  inviteUrl: string;
  expiresAt: string;
  locale: string;
  logoUrl: string;
};

export function businessOwnerInviteEmail({
  businessName,
  inviteUrl,
  expiresAt,
  locale,
  logoUrl,
}: BusinessOwnerInviteEmailArgs) {
  const tr = locale === "tr";
  const safeBusinessName = escapeHtml(businessName);
  const safeInviteUrl = escapeHtml(inviteUrl);
  const safeLogoUrl = escapeHtml(logoUrl);
  const expiry = new Intl.DateTimeFormat(tr ? "tr-TR" : "en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(expiresAt));
  const subject = tr
    ? `${businessName} işletmesini teslim alın`
    : `Take ownership of ${businessName}`;
  const intro = tr
    ? `Tourism Partner üzerindeki <strong>${safeBusinessName}</strong> işletmesini yönetmeniz için davet edildiniz.`
    : `You have been invited to manage <strong>${safeBusinessName}</strong> on Tourism Partner.`;
  const button = tr ? "İşletmeyi teslim al" : "Accept business ownership";
  const expiryText = tr
    ? `Bu güvenli bağlantı ${expiry} tarihine kadar geçerlidir.`
    : `This secure link is valid until ${expiry}.`;
  const ignore = tr
    ? "Bu daveti beklemiyorsanız e-postayı yok sayabilirsiniz."
    : "If you were not expecting this invitation, you can ignore this email.";

  return {
    subject,
    html: `<!doctype html>
<html lang="${tr ? "tr" : "en"}">
  <body style="margin:0;background:#f7f5ff;font-family:Arial,sans-serif;color:#17151c">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:36px 16px;background:#f7f5ff">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto 18px">
          <tr><td style="vertical-align:middle">
            <img src="${safeLogoUrl}" width="150" height="60" alt="Tourism Partner" style="display:block;width:150px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none">
          </td></tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;overflow:hidden;border:1px solid #ddd6fe;border-radius:14px;background:#ffffff">
          <tr><td style="padding:24px 30px;background:#4c1d95;color:#ffffff">
            <div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.72">Tourism Partner</div>
            <div style="margin-top:8px;font-size:25px;font-weight:800;line-height:1.25">${tr ? "İşletmeniz hazır" : "Your business is ready"}</div>
          </td></tr>
          <tr><td style="padding:30px">
            <p style="margin:0;font-size:16px;line-height:1.7">${intro}</p>
            <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#5d687a">${expiryText}</p>
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0">
              <tr><td style="border-radius:9px;background:#4c1d95">
                <a href="${safeInviteUrl}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800">${button}</a>
              </td></tr>
            </table>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#7a8495">${ignore}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    text: `${tr ? "İşletmenizi teslim alın" : "Accept business ownership"}\n\n${businessName}\n${inviteUrl}\n\n${expiryText}\n${ignore}`,
  };
}

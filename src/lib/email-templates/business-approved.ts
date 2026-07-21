import { escapeHtml } from "@/lib/email";

type BusinessApprovedEmailArgs = {
  businessName: string;
  dashboardUrl: string;
  profileUrl: string;
  logoUrl: string;
};

export function businessApprovedEmail({
  businessName,
  dashboardUrl,
  profileUrl,
  logoUrl,
}: BusinessApprovedEmailArgs) {
  const safeBusinessName = escapeHtml(businessName);
  const safeDashboardUrl = escapeHtml(dashboardUrl);
  const safeProfileUrl = escapeHtml(profileUrl);
  const safeLogoUrl = escapeHtml(logoUrl);
  const subject = `Tebrikler, ${businessName} onaylandı`;

  return {
    subject,
    html: `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f5fa;color:#0b102f;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safeBusinessName} profili Tourism Partner'da yayına alındı.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f5fa;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;">
            <tr>
              <td style="padding:0 6px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="54" style="width:54px;padding-right:12px;vertical-align:middle;">
                      <img src="${safeLogoUrl}" width="48" height="48" alt="Tourism Partner" style="display:block;width:48px;height:48px;border:0;border-radius:11px;object-fit:cover;">
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
                      <div style="display:inline-block;margin-bottom:16px;border-radius:999px;background:#ffffff1f;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">PROFİL ONAYI</div>
                      <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">Tebrikler, onaylandınız</h1>
                      <p style="margin:0;color:#dbe5ff;font-size:15px;line-height:24px;"><strong style="color:#ffffff;">${safeBusinessName}</strong> profili Tourism Partner'da yayına alındı.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 0;">
                      <p style="margin:0;color:#334155;font-size:15px;line-height:25px;">Profiliniz artık alıcılar tarafından görüntülenebilir. Profil bilgilerinizi, hizmetlerinizi, açıklamanızı ve galeri görsellerinizi ne kadar eksiksiz tamamlarsanız listelerde daha güçlü görünürsünüz.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 38px 0;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:12px;background:#f4f7ff;">
                        <tr>
                          <td style="padding:18px 20px;">
                            <div style="color:#01145d;font-size:12px;font-weight:900;letter-spacing:0.7px;">ÖNERİ</div>
                            <div style="margin-top:7px;color:#334155;font-size:14px;line-height:23px;">Eksik alanları tamamlayın, güncel iletişim bilgilerinizi kontrol edin ve işletmenizi en iyi anlatan galeri görsellerini ekleyin.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="border-radius:11px;background:#01145d;">
                            <a href="${safeDashboardUrl}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;">Profili tamamla</a>
                          </td>
                          <td style="padding-left:10px;">
                            <a href="${safeProfileUrl}" style="display:inline-block;padding:13px 17px;border:1px solid #cbd5e1;border-radius:11px;color:#01145d;font-size:14px;font-weight:800;text-decoration:none;">Yayındaki profili gör</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:18px 0 0;color:#7b8498;font-size:12px;line-height:19px;">Bu e-posta, Tourism Partner admin onayı sonrası otomatik olarak gönderildi.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                Tourism Partner · Turizm profesyonelleri için güvenilir iş ağı
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `Tebrikler, onaylandınız

${businessName} profili Tourism Partner'da yayına alındı.

Profil bilgilerinizi, hizmetlerinizi, açıklamanızı ve galeri görsellerinizi ne kadar eksiksiz tamamlarsanız listelerde daha güçlü görünürsünüz.

Profili tamamla: ${dashboardUrl}
Yayındaki profili gör: ${profileUrl}

Tourism Partner`,
  };
}

import { escapeHtml } from "@/lib/email";

type BusinessApprovedEmailArgs = {
  businessName: string;
  dashboardUrl: string;
  profileUrl: string;
  logoUrl: string;
};

export function businessApprovedEmail({
  businessName,
  logoUrl,
}: BusinessApprovedEmailArgs) {
  const safeBusinessName = escapeHtml(businessName);
  const safeLogoUrl = escapeHtml(logoUrl);
  const subject = `Congratulations, ${businessName} has been approved`;

  const paragraphs = [
    "Thank you for joining Tourism Partner. We are excited to have your business among our first members and to welcome you as part of a growing international community of tourism professionals. Your participation is an important step toward building a stronger and more connected global tourism network.",
    "Our vision is to build a global B2B tourism platform that connects tourism businesses from around the world. By bringing together hotels, travel agencies, tour operators, guides, transportation companies, restaurants, activity providers, and many other tourism suppliers, we aim to create new business opportunities while helping reduce costs and enabling companies to connect without commission-based intermediaries.",
    "As Tourism Partner is currently in its pre-launch phase, we will notify you as soon as the platform becomes fully active and ready to use.",
    "Thank you for placing your trust in us and joining us at this exciting stage of our journey. Together, we are building a stronger, more connected global tourism network.",
    "If you need any assistance or have any questions, please don't hesitate to contact us at any time. Our team will always be happy to help.",
    "Welcome once again, and thank you for being part of Tourism Partner.",
  ];

  const htmlParagraphs = paragraphs
    .map((p) => `<p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:25px;">${escapeHtml(p)}</p>`)
    .join("\n                      ");

  return {
    subject,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f2f5fa;color:#0b102f;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Welcome to Tourism Partner — ${safeBusinessName} has been approved.</div>
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
                    <td align="right" style="color:#7b8498;font-size:11px;font-weight:700;letter-spacing:1px;">B2B TOURISM NETWORK</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow:hidden;border:1px solid #dfe5ef;border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(1,20,93,0.08);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:#01145d;padding:34px 38px;">
                      <div style="display:inline-block;margin-bottom:16px;border-radius:999px;background:#ffffff1f;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">PROFILE APPROVED</div>
                      <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">Welcome to Tourism Partner!</h1>
                      <p style="margin:0;color:#dbe5ff;font-size:15px;line-height:24px;"><strong style="color:#ffffff;">${safeBusinessName}</strong> has been approved.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 8px;">
                      ${htmlParagraphs}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 38px 34px;">
                      <p style="margin:0;color:#01145d;font-size:15px;line-height:24px;font-weight:700;">Warm regards,</p>
                      <p style="margin:10px 0 0;color:#334155;font-size:14px;line-height:22px;">
                        <a href="https://www.tourismpartner.com" style="color:#004fe6;text-decoration:none;font-weight:700;">www.tourismpartner.com</a><br>
                        <a href="mailto:info@tourismpartner.world" style="color:#004fe6;text-decoration:none;">info@tourismpartner.world</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">
                Tourism Partner · A trusted B2B network for tourism professionals
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `Welcome to Tourism Partner!

${businessName} has been approved.

${paragraphs.join("\n\n")}

Warm regards,

www.tourismpartner.com
info@tourismpartner.world`,
  };
}

import { escapeHtml } from "@/lib/email";

type DealInterestEmailInput = {
  dealTitle: string;
  dashboardUrl: string;
  logoUrl: string;
  imageUrl: string;
};

export function dealInterestEmail(input: DealInterestEmailInput) {
  const subject = `New interest in your opportunity — ${input.dealTitle}`;
  const title = escapeHtml(input.dealTitle);

  return {
    subject,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(subject)}</title>
    <style>
      @media only screen and (max-width:620px) {
        .email-shell { padding:20px 10px !important; }
        .email-card { border-radius:14px !important; }
        .content-cell { padding:26px 22px 30px !important; }
        .brand-note { display:none !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f7f5ff;color:#17151c;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your opportunity has received new interest. View the details in your dashboard.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f7f5ff;">
      <tr>
        <td class="email-shell" align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;">
            <tr>
              <td style="padding:0 6px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;"><img src="${escapeHtml(input.logoUrl)}" width="150" alt="Tourism Partner" style="display:block;width:150px;max-width:100%;height:auto;border:0;"></td>
                    <td class="brand-note" align="right" style="color:#6b6675;font-size:11px;font-weight:700;letter-spacing:1px;vertical-align:middle;">B2B TOURISM NETWORK</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-card" style="overflow:hidden;border:1px solid #ddd6fe;border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(76,29,149,.10);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:#29105e;"><img src="${escapeHtml(input.imageUrl)}" width="680" alt="You have a new offer from Tourism Partner" style="display:block;width:100%;max-width:680px;height:auto;border:0;"></td>
                  </tr>
                  <tr>
                    <td class="content-cell" style="padding:30px 34px 34px;">
                      <div style="display:inline-block;margin-bottom:14px;border-radius:999px;background:#ede9fe;padding:7px 11px;color:#5b21b6;font-size:10px;font-weight:800;letter-spacing:.8px;">NEW INTEREST</div>
                      <p style="margin:0 0 6px;color:#7b8498;font-size:10px;font-weight:800;letter-spacing:.9px;">OPPORTUNITY</p>
                      <h1 style="margin:0 0 16px;color:#17151c;font-size:23px;line-height:30px;letter-spacing:-.35px;">${title}</h1>
                      <p style="margin:0 0 8px;color:#334155;font-size:15px;line-height:24px;">A Tourism Partner member is interested in your opportunity.</p>
                      <p style="margin:0 0 24px;color:#64748b;font-size:13px;line-height:21px;">Open your dashboard to view the details and continue the conversation.</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="border-radius:10px;background:#5b21b6;"><a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;padding:13px 19px;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;">View in dashboard</a></td></tr></table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 24px 0;color:#8992a5;font-size:11px;line-height:18px;">Tourism Partner · The trusted B2B network for tourism professionals</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `New interest in your opportunity

Opportunity: ${input.dealTitle}

A Tourism Partner member is interested in this opportunity.
Open your dashboard to view the business details and continue the conversation.

View opportunity: ${input.dashboardUrl}

Tourism Partner`,
  };
}

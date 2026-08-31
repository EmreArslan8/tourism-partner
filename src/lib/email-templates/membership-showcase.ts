import { escapeHtml } from "@/lib/email";

/* Kurucu Üyelik + Doğrulanmış Üyelik tanıtımı.

   İki kullanım şekli var:
   - `membershipShowcaseSection()` — onay mailinin (business-approved) içine
     gömülen kart bloğu; işletme onaylandığı anda üyelik seçeneklerini görür.
   - `membershipShowcaseEmail()` — aynı içeriğin tek başına gönderilebilen hâli;
     daha önce onaylanmış işletmelere sonradan kampanya olarak atılabilir.

   Metinler panel içindeki üyelik kartlarıyla (ui.json → doping*) bilinçli olarak
   aynı; kullanıcı maildeki vaatle panelde gördüğü kartı birebir eşleştirebilsin. */

type MembershipCard = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  note?: string;
  accent: string;
  softAccent: string;
  border: string;
  /** public/email-assets altındaki rozet PNG'i (scripts/gen-membership-email-assets.mjs üretir). */
  image: string;
  imageWidth: number;
};

const CARDS: MembershipCard[] = [
  {
    eyebrow: "The first step to trust",
    title: "Verified Member",
    description:
      "Verify your business information and give visitors and potential partners a stronger signal of trust.",
    benefits: [
      "Verified business badge on your profile",
      "Stronger corporate credibility",
      "A trust-building first impression",
    ],
    accent: "#a97a12",
    softAccent: "#fffbeb",
    border: "#f5d78e",
    image: "/email-assets/membership-badge-verified.png",
    imageWidth: 40,
  },
  {
    eyebrow: "Limited availability",
    title: "Founding Member",
    description:
      "An exclusive status for pioneering businesses that joined Tourism Partner during its founding period.",
    benefits: [
      "Founding Member badge on your profile",
      "Recognition among the platform's pioneers",
      "Exclusive founding status display",
    ],
    note: "Founding Member status is limited to the first 500 businesses.",
    accent: "#0e2745",
    softAccent: "#f1f5f9",
    border: "#cbd5e1",
    image: "/email-assets/membership-badge-founder.png",
    imageWidth: 36,
  },
];

function benefitRows(card: MembershipCard) {
  return card.benefits
    .map(
      (benefit) => `<tr>
                        <td width="18" style="padding:3px 8px 3px 0;color:${card.accent};font-size:13px;line-height:20px;vertical-align:top;">&bull;</td>
                        <td style="padding:3px 0;color:#334155;font-size:14px;line-height:20px;">${escapeHtml(benefit)}</td>
                      </tr>`,
    )
    .join("\n                      ");
}

function cardHtml(card: MembershipCard, assetBaseUrl: string) {
  const badgeSrc = escapeHtml(`${assetBaseUrl}${card.image}`);
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 16px;border:1px solid ${card.border};border-radius:14px;background:${card.softAccent};">
                  <tr>
                    <td style="padding:20px 22px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td width="52" style="padding-right:12px;vertical-align:middle;">
                            <img src="${badgeSrc}" width="${card.imageWidth}" alt="" style="display:block;width:${card.imageWidth}px;height:auto;border:0;outline:none;text-decoration:none;">
                          </td>
                          <td style="vertical-align:middle;">
                            <div style="color:${card.accent};font-size:10px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;">${escapeHtml(card.eyebrow)}</div>
                            <div style="color:#17151c;font-size:18px;font-weight:700;line-height:24px;">${escapeHtml(card.title)}</div>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:12px 0 10px;color:#475569;font-size:14px;line-height:22px;">${escapeHtml(card.description)}</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        ${benefitRows(card)}
                      </table>
                      ${card.note ? `<p style="margin:12px 0 0;color:${card.accent};font-size:12px;line-height:18px;font-weight:700;">${escapeHtml(card.note)}</p>` : ""}
                    </td>
                  </tr>
                </table>`;
}

function cardText(card: MembershipCard) {
  const lines = [
    `${card.title.toUpperCase()} (${card.eyebrow})`,
    card.description,
    ...card.benefits.map((benefit) => `- ${benefit}`),
  ];
  if (card.note) lines.push(card.note);
  return lines.join("\n");
}

export type MembershipShowcaseArgs = {
  /** Panel üyelik sayfası (/panel/doping) — kartlardaki CTA buraya gider. */
  membershipUrl: string;
  /** Görsellerin kök adresi (SITE_URL) — maildeki <img> mutlak URL ister. */
  assetBaseUrl: string;
  /** İşletmenin kendi adı/konumu/görseli — önizleme kartı bunlarla doldurulur. */
  business: {
    name: string;
    /** Ör. "Antalya, Türkiye"; boşsa satır gösterilmez. */
    location?: string;
    /** businessImageUrl() ile üretilmiş mutlak kapak görseli; yoksa placeholder. */
    imageUrl?: string;
  };
};

/* İşletmenin kendi profil kartının rozetli hâli — statik bir görsel yerine
   kayıttaki ad/konum/kapak görseliyle doldurulan HTML kart. Mail istemcileri
   flex/grid desteklemediği için tablo kurgusu ve inline stil zorunlu. */
function previewCardHtml({ business, assetBaseUrl }: Pick<MembershipShowcaseArgs, "business" | "assetBaseUrl">) {
  const photoSrc = escapeHtml(business.imageUrl || `${assetBaseUrl}/email-assets/membership-card-photo.png`);
  const verifiedSrc = escapeHtml(`${assetBaseUrl}/email-assets/membership-badge-verified.png`);
  const founderSrc = escapeHtml(`${assetBaseUrl}/email-assets/membership-badge-founder.png`);
  const pill = (src: string, width: number, label: string, color: string, background: string, border: string) =>
    `<td style="padding:0 8px 0 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border:1px solid ${border};border-radius:999px;background:${background};">
                              <tr>
                                <td style="padding:6px 12px 6px 10px;">
                                  <img src="${src}" width="${width}" alt="" style="display:inline-block;width:${width}px;height:auto;vertical-align:middle;border:0;">
                                  <span style="padding-left:6px;color:${color};font-size:12px;font-weight:700;vertical-align:middle;">${label}</span>
                                </td>
                              </tr>
                            </table>
                          </td>`;

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 22px;border:1px solid #e6e0f7;border-radius:16px;background:#ffffff;">
                  <tr>
                    <td width="132" style="padding:16px 0 16px 16px;vertical-align:top;">
                      <img src="${photoSrc}" width="116" height="116" alt="" style="display:block;width:116px;height:116px;border-radius:12px;border:0;outline:none;text-decoration:none;object-fit:cover;">
                    </td>
                    <td style="padding:18px 18px 16px 14px;vertical-align:top;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding-right:8px;color:#17151c;font-size:17px;font-weight:700;line-height:24px;vertical-align:middle;">${escapeHtml(business.name)}</td>
                          <td style="padding-right:6px;vertical-align:middle;"><img src="${verifiedSrc}" width="20" alt="" style="display:block;width:20px;height:auto;border:0;"></td>
                          <td style="vertical-align:middle;"><img src="${founderSrc}" width="18" alt="" style="display:block;width:18px;height:auto;border:0;"></td>
                        </tr>
                      </table>
                      ${business.location ? `<p style="margin:4px 0 12px;color:#64748b;font-size:13px;line-height:19px;">${escapeHtml(business.location)}</p>` : `<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>`}
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          ${pill(verifiedSrc, 16, "Verified Member", "#a97a12", "#fffbeb", "#f5d78e")}
                          ${pill(founderSrc, 14, "Founding Member", "#0e2745", "#f1f5f9", "#cbd5e1")}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>`;
}

/** Onay maili gibi başka bir şablonun gövdesine gömülen tanıtım bloğu. */
export function membershipShowcaseSection({ membershipUrl, assetBaseUrl, business }: MembershipShowcaseArgs) {
  const safeMembershipUrl = escapeHtml(membershipUrl);

  return `<div style="height:1px;margin:6px 0 24px;background:#ede9fe;line-height:1px;font-size:0;">&nbsp;</div>
                <div style="color:#6d28d9;font-size:11px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;">Membership and visibility</div>
                <h2 style="margin:6px 0 8px;color:#17151c;font-size:21px;line-height:28px;letter-spacing:-0.4px;">Stand out with badges that build trust</h2>
                <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:22px;">Two statuses are available to strengthen your profile from day one. This is how they would look on your own listing:</p>
                ${previewCardHtml({ business, assetBaseUrl })}
                ${CARDS.map((card) => cardHtml(card, assetBaseUrl)).join("\n                ")}
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:6px 0 4px;">
                  <tr>
                    <td style="border-radius:10px;background:#4c1d95;">
                      <a href="${safeMembershipUrl}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">See membership options</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:10px 0 0;color:#8992a5;font-size:12px;line-height:18px;">Open the membership page in your panel and contact us from the card you're interested in — our team will get back to you with the requirements and details.</p>`;
}

/** Aynı içeriğin düz metin karşılığı. */
export function membershipShowcaseText({ membershipUrl }: Pick<MembershipShowcaseArgs, "membershipUrl">) {
  return `MEMBERSHIP AND VISIBILITY
Stand out with badges that build trust.

${CARDS.map(cardText).join("\n\n")}

See membership options: ${membershipUrl}

Open the membership page in your panel and contact us from the card you're interested in — our team will get back to you with the requirements and details.`;
}

export type MembershipShowcaseEmailArgs = MembershipShowcaseArgs & {
  logoUrl: string;
};

/** Onaylanmış işletmelere ayrıca gönderilebilen bağımsız tanıtım maili. */
export function membershipShowcaseEmail({
  business,
  membershipUrl,
  assetBaseUrl,
  logoUrl,
}: MembershipShowcaseEmailArgs) {
  const businessName = business.name;
  const safeBusinessName = escapeHtml(businessName);
  const safeLogoUrl = escapeHtml(logoUrl);
  const subject = `${businessName}: two ways to build more trust on Tourism Partner`;

  const intro =
    "Your profile is live on Tourism Partner. Before you start receiving requests, there are two statuses that make your business look stronger to buyers browsing the network.";

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
  <body style="margin:0;padding:0;background:#f7f5ff;color:#17151c;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Verified Member and Founding Member — two statuses that strengthen your profile.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f7f5ff;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;">
            <tr>
              <td style="padding:0 6px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${safeLogoUrl}" width="150" height="60" alt="Tourism Partner" style="display:block;width:150px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
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
                      <div style="display:inline-block;margin-bottom:16px;border-radius:999px;background:#6d28d9;padding:7px 12px;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.7px;">MEMBERSHIP OPTIONS</div>
                      <h1 style="margin:0 0 10px;color:#ffffff;font-size:28px;line-height:34px;letter-spacing:-0.7px;">Make your profile more convincing</h1>
                      <p style="margin:0;color:#ede9fe;font-size:15px;line-height:24px;">Prepared for <strong style="color:#ffffff;">${safeBusinessName}</strong>.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 38px 8px;">
                      <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:25px;">${escapeHtml(intro)}</p>
                      ${membershipShowcaseSection({ membershipUrl, assetBaseUrl, business })}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 38px 34px;">
                      <p style="margin:0;color:#4c1d95;font-size:15px;line-height:24px;font-weight:700;">Warm regards,</p>
                      <p style="margin:10px 0 0;color:#334155;font-size:14px;line-height:22px;">
                        <a href="https://www.tourismpartner.com" style="color:#6d28d9;text-decoration:none;font-weight:700;">www.tourismpartner.com</a><br>
                        <a href="mailto:info@tourismpartner.world" style="color:#6d28d9;text-decoration:none;">info@tourismpartner.world</a>
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
    text: `Make your profile more convincing

Prepared for ${businessName}.

${intro}

${membershipShowcaseText({ membershipUrl })}

Warm regards,

www.tourismpartner.com
info@tourismpartner.world`,
  };
}

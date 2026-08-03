export type PromoTemplate = {
  id: string;
  label: string;
  subject: string;
  preheader: string;
  headline: string;
  intro: string;
  bullets: string[];
  outro: string;
  ctaLabel: string;
  campaign: string;
  imageUrl: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
};

export const PROMO_TEMPLATES: PromoTemplate[] = [
  {
    id: "global-b2b-network",
    label: "Global B2B Tourism Network",
    subject: "Join Tourism Partner – The Global B2B Tourism Network",
    preheader: "Build international tourism partnerships with Tourism Partner.",
    headline: "Meet Tourism Partner",
    intro: `Dear Sir/Madam,

We hope this message finds you well.

We would like to introduce Tourism Partner, a global B2B platform designed to help tourism businesses build new partnerships and discover international business opportunities.

Whether you are a hotel, travel agency, transportation company, activity provider, guide, or another tourism supplier, Tourism Partner enables you to connect directly with businesses from around the world through a single professional network.

Why Join Tourism Partner?`,
    bullets: [
      "✔️ No Commission.",
      "✔️ Free Registration.",
      "✔️ Connect to Global Tourism Market Place.",
    ],
    outro: `Our mission is to make international tourism partnerships easier, faster, and more accessible for businesses of every size.

We are currently inviting selected tourism businesses to join our growing global network.

We look forward to welcoming you to Tourism Partner.

Kind regards,
Tourism Partner Team
Global B2B Tourism Network
https://tourismpartner.com`,
    ctaLabel: "Join Tourism Partner",
    campaign: "global-b2b-network",
    imageUrl: "",
    backgroundColor: "#ffffff",
    textColor: "#334155",
    accentColor: "#004fe6",
  },
  {
    id: "short-free-registration",
    label: "Short – Free Registration",
    subject: "Free registration for tourism businesses",
    preheader: "Connect with tourism businesses worldwide.",
    headline: "Grow your tourism network",
    intro: `Dear Sir/Madam,

Tourism Partner is a global B2B platform that helps tourism businesses connect directly and discover new international opportunities.`,
    bullets: [
      "✔️ No Commission.",
      "✔️ Free Registration.",
      "✔️ Connect to Global Tourism Market Place.",
    ],
    outro: `Join our growing network and start building new tourism partnerships today.

Kind regards,
Tourism Partner Team`,
    ctaLabel: "Register for free",
    campaign: "free-registration",
    imageUrl: "https://tourismpartner.com/email-assets/tourism-partner-network-promo.jpg",
    backgroundColor: "#ffffff",
    textColor: "#334155",
    accentColor: "#004fe6",
  },
];

export const DEFAULT_PROMO_TEMPLATE_ID = PROMO_TEMPLATES[0].id;

export function getPromoTemplate(id: string | null | undefined): PromoTemplate {
  return PROMO_TEMPLATES.find((template) => template.id === id) ?? PROMO_TEMPLATES[0];
}

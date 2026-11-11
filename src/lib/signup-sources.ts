/* "Bizi nereden duydunuz?" seçenekleri. Slug'lar profiles.signup_source'a yazılır;
   form etiketleri i18n'den (register.source_<slug>), admin etiketleri buradan gelir. */
export const SIGNUP_SOURCES = [
  "google",
  "instagram",
  "linkedin",
  "facebook",
  "whatsapp",
  "friend",
  "representative",
  "event",
  "email",
  "other",
] as const;

export type SignupSource = (typeof SIGNUP_SOURCES)[number];

export const SIGNUP_SOURCE_LABELS_TR: Record<SignupSource, string> = {
  google: "Google araması",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  whatsapp: "WhatsApp grubu / mesaj",
  friend: "Tavsiye (arkadaş / meslektaş)",
  representative: "Temsilcimiz",
  event: "Fuar / etkinlik",
  email: "E-posta",
  other: "Diğer",
};

export function isSignupSource(value: unknown): value is SignupSource {
  return typeof value === "string" && (SIGNUP_SOURCES as readonly string[]).includes(value);
}

/* Server action'lar için ortak doğrulama yardımcıları (defense-in-depth).
   DB CHECK kısıtları zaten var; burada daha erken, kullanıcı dostu kontrol. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(v: string): boolean {
  return v.length >= 3 && v.length <= 200 && EMAIL_RE.test(v);
}

/** Metni trim'ler; boşsa null, uzunsa kırpar. */
export function clean(v: FormDataEntryValue | null, max: number): string | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  return s.slice(0, max);
}

/** Honeypot: gizli "website" alanı doluysa bot demektir. */
export function isBot(formData: FormData): boolean {
  return String(formData.get("website") ?? "").trim() !== "";
}

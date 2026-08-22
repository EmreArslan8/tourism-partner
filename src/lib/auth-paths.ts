/*
 * Korumalı yol tespiti ve login yolu — TEK KAYNAK. Hem sunucu (proxy.ts) hem
 * istemci (AuthWatcher.tsx) buradan okur, böylece iki taraf hangi yolun korumalı
 * olduğu ve login'in nereye gittiği konusunda asla ayrışmaz.
 *
 * Not: Segment isimleri i18n/routing.ts pathnames ile senkron tutulmalı
 * (dashboard→panel(tr), onboarding→kurulum(tr), login→giris(tr)).
 */

export const LOCALES = ["tr", "en", "ru", "ar"] as const;

// Locale'den SONRAKİ ilk segment bu kümedeyse sayfa korumalıdır (giriş gerektirir).
// Yerelleştirilmiş karşılıklar dahil.
export const PROTECTED_SEGMENTS = new Set([
  "dashboard",
  "panel", // tr: /dashboard
  "admin",
  "onboarding",
  "kurulum", // tr: /onboarding
]);

export function localeOf(pathname: string): string {
  const seg = pathname.split("/")[1] ?? "";
  return (LOCALES as readonly string[]).includes(seg) ? seg : "en";
}

export function isProtectedPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean); // [locale, segment, ...]
  return parts.length >= 2 && PROTECTED_SEGMENTS.has(parts[1]);
}

export function loginPathFor(locale: string): string {
  // Yerelleştirilmiş login yolu (bkz. i18n/routing.ts pathnames): tr → /giris.
  return locale === "tr" ? "/tr/giris" : `/${locale}/login`;
}

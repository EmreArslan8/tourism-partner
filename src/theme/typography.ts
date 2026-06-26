export const fontFamily = {
  display: ["var(--font-display)", "Helvetica Neue", "sans-serif"],
  body: ["var(--font-body)", "Helvetica Neue", "sans-serif"],
} as const;

/*
 * Akışkan tip ölçeği — rem tabanlı (zoom/erişilebilirlik güvenli) clamp'ler.
 * Her clamp: clamp(MIN_rem, REM_taban + VW_eğim, MAX_rem) biçiminde; min/max
 * arası 375px → 1280px viewport bandında lineer interpole edilir. `vw` tek
 * başına değil rem tabanla birlikte kullanılır ki tarayıcı yazı büyütme
 * (zoom) çalışsın. Ara ekran (tablet) boyutları otomatik interpolasyondan
 * gelir; ayrı breakpoint gerekmez. Tailwind formatı: [size, { lineHeight, letterSpacing }].
 */
type FontSizeValue = [string, { lineHeight?: string; letterSpacing?: string }];

export const fontSize: Record<string, FontSizeValue> = {
  // Başlık ölçeği (display)
  hero: ["clamp(2.25rem, 1.52rem + 3.09vw, 4rem)", { lineHeight: "1.16", letterSpacing: "-0.04em" }],
  page: ["clamp(1.625rem, 1.31rem + 1.33vw, 2.375rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  section: ["clamp(1.5rem, 1.19rem + 1.33vw, 2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  panel: ["clamp(1.375rem, 1.12rem + 1.11vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  card: ["clamp(1.375rem, 1.12rem + 1.11vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  subsection: ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],

  // Gövde ölçeği (body) — akışkan, mobil override'a gerek bırakmaz
  lead: ["clamp(0.9375rem, 0.88rem + 0.27vw, 1.125rem)", { lineHeight: "1.65" }],
  "body-base": ["clamp(0.90625rem, 0.88rem + 0.11vw, 0.9375rem)", { lineHeight: "1.6" }],
};

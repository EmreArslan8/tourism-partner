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
  "section-compact": ["1.2rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  "panel-compact": ["1.1rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  "card-compact": ["0.95rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  "title-on-image": ["1.375rem", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
  "title-on-image-mobile": ["1rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],

  // Gövde ölçeği (body) — akışkan, mobil override'a gerek bırakmaz
  lead: ["clamp(0.9375rem, 0.88rem + 0.27vw, 1.125rem)", { lineHeight: "1.65" }],
  "body-base": ["clamp(0.90625rem, 0.88rem + 0.11vw, 0.9375rem)", { lineHeight: "1.6" }],
  eyebrow: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.16em" }],
  "eyebrow-compact": ["0.6rem", { lineHeight: "1.2", letterSpacing: "0.128em" }],
  small: ["0.84375rem", { lineHeight: "1.6" }],
  meta: ["0.8125rem", { lineHeight: "1.6" }],
  "body-compact": ["0.675rem", { lineHeight: "1.6" }],
  "meta-compact": ["0.65rem", { lineHeight: "1.5" }],
  "label-pill": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.04em" }],
  "label-pill-compact": ["0.6rem", { lineHeight: "1.2", letterSpacing: "0.04em" }],
  "step-number": ["1rem", { lineHeight: "1" }],
  "step-number-compact": ["0.7rem", { lineHeight: "1" }],
  "step-title": ["0.96875rem", { lineHeight: "1.25" }],
  "step-title-compact": ["0.7rem", { lineHeight: "1.25" }],
  "step-desc": ["0.828125rem", { lineHeight: "1.5" }],
  "step-desc-compact": ["0.6125rem", { lineHeight: "1.5" }],
  "rating-star": ["0.9375rem", { lineHeight: "1" }],
  "rating-star-compact": ["0.75rem", { lineHeight: "1" }],
};

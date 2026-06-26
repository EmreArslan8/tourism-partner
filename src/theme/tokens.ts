/*
 * Akışkan boşluk ölçeği — rem+vw clamp, 375px → 1280px bandında interpole.
 * Bölüm/blok dikey ritmini breakpoint yığını olmadan ölçeklemek için.
 * Kullanım: py-fluid-section, gap-fluid-md gibi.
 */
export const spacing = {
  "fluid-section": "clamp(2.5rem, 1.8rem + 3vw, 5rem)", // 40 → 80px
  "fluid-block": "clamp(1.5rem, 1.1rem + 1.7vw, 3rem)", // 24 → 48px
  "fluid-md": "clamp(1rem, 0.8rem + 0.9vw, 1.75rem)", // 16 → 28px
  "fluid-sm": "clamp(0.75rem, 0.65rem + 0.4vw, 1rem)", // 12 → 16px
} as const;

export const borderRadius = {
  button: "12px",
  card: "12px",       // standart kart yüzeyi — tüm projede rounded-card ile kullanılır
  "card-lg": "16px",  // büyük/vitrin kartları (Showcase paneli, Categories ilk kart)
  pill: "999px",
} as const;

/* Başlık letter-spacing — ortak token (-%2 … -%4 arası daraltma). */
export const letterSpacing = {
  "heading": "-0.03em",        // varsayılan başlık (-%3)
  "heading-soft": "-0.02em",   // küçük başlık (-%2)
  "heading-tight": "-0.04em",  // büyük display başlık (-%4)
} as const;

export const boxShadow = {
  card: "0 1px 2px rgba(7,9,42,.06), 0 16px 36px -20px rgba(23,33,120,.24)",
  pop: "0 24px 70px -20px rgba(23,33,120,.45)",
} as const;

export const easing = {
  brand: "cubic-bezier(.22,1,.36,1)",
} as const;

export const keyframes = {
  splashIn: { from: { opacity: "0" }, to: { opacity: "1" } },
  splashOut: { to: { opacity: "0", visibility: "hidden" } },
  splashMark: {
    from: { transform: "translateY(8px) scale(.9)", opacity: "0" },
    to: { transform: "none", opacity: "1" },
  },
  cardIn: {
    from: { opacity: "0", transform: "translateY(10px)" },
    to: { opacity: "1", transform: "none" },
  },
  scroll: {
    from: { transform: "translateX(0)" },
    to: { transform: "translateX(-50%)" },
  },
} as const;

export const animation = {
  "splash-in": "splashIn .5s cubic-bezier(.22,1,.36,1)",
  "splash-out": "splashOut .6s cubic-bezier(.22,1,.36,1) forwards",
  "splash-mark": "splashMark 1.1s cubic-bezier(.22,1,.36,1)",
  "card-in": "cardIn .5s cubic-bezier(.22,1,.36,1) backwards",
  "scroll-linear": "scroll 30s linear infinite",
} as const;

export const borderRadius = {
  card: "14px",
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

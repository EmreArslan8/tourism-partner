/* Card — merkezi stil token'ları (theme renkleriyle). Görsel kararlar burada;
   index.tsx yalnızca props → class eşlemesi yapar. Button/styles.ts ile aynı desen. */
const styles = {
  base: "overflow-hidden rounded-2xl border bg-white transition-all duration-200",

  variants: {
    /** Yumuşak gölgeli standart kart */
    default: "border-line/80 shadow-[0_2px_8px_rgba(15,23,42,.04),0_14px_30px_-20px_rgba(15,23,42,.14)]",
    /** Sadece kenarlık, gölgesiz */
    outline: "border-line",
    /** Daha belirgin yükselti */
    elevated: "border-line/70 shadow-[0_8px_24px_-12px_rgba(15,23,42,.18)]",
    /** Krem zeminli, kenarlıksız (vurgu kutusu) */
    soft: "border-transparent !bg-cream",
  },

  /** interactive=true → hover'da hafif yükselme */
  interactive:
    "hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(15,23,42,.07),0_22px_44px_-22px_rgba(15,23,42,.2)]",

  header: "flex items-center justify-between gap-3 border-b border-line/70 px-5 py-4",
  headerMain: "flex min-w-0 items-center gap-3",
  title: "truncate text-[15px] font-bold text-ink",
  description: "mt-0.5 text-[13px] text-muted",

  body: {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  },

  footer: "flex items-center gap-3 border-t border-line/70 px-5 py-4",

  // Başlık ikon-chip'i (renk tonlu)
  chip: {
    blue: "bg-[#EFF4FF] text-[#0057D9]",
    terra: "bg-terra/12 text-terra-deep",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  },
  chipBox: "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
} as const;

export default styles;

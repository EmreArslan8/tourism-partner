/* SiteFooter — Tailwind sınıf token'ları */
export const styles= {
  footer: "mt-10 bg-pine text-cream/[.78]",
  inner:
    "container-px grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-7 py-12 pb-8 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1",
  logoImage: "h-20 w-20 rounded-[14px] object-cover shadow-[0_18px_42px_-24px_rgba(0,0,0,.75)]",
  brandText: "mt-3.5 max-w-[320px] text-[13.5px] leading-relaxed",
  colTitle: "mb-3 text-[15px] text-cream",
  colLink: "block py-1 text-[13.5px] text-cream/70 transition-colors hover:text-cream",
  noteSm: "text-[13px] leading-relaxed",
  noteStrong: "text-gold font-semibold",
  base:
    "container-px flex flex-wrap justify-between gap-3 border-t border-white/10 py-[18px] text-[12.5px] text-cream/55",
} as const;

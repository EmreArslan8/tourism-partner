/* SiteFooter — Tailwind sınıf token'ları */
 const styles= {
  footer:
    "relative bg-sapphire-deep text-cream/[.78] " +
    "before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] " +
    "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.12)_18%,rgba(255,255,255,.12)_82%,transparent)]",
  footerSeamless: "!bg-transparent ![background-image:none]",
  inner:
    "container-px grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-7 py-12 pb-8 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1",
  logo: "w-fit",
  brandText: "mt-3.5 max-w-[320px] text-[13.5px] leading-relaxed",
  socialRow: "mt-4 flex flex-wrap items-center gap-4",
  socialLink: "text-cream transition-colors hover:text-white",
  colTitle: "mb-3.5 text-[15px] font-semibold tracking-[-.01em] text-white",
  colLink: "block py-1 text-[13.5px] text-cream/60 transition-colors hover:text-white",
  noteSm: "text-[13px] leading-relaxed",
  noteStrong: "text-gold font-semibold",
  base:
    "container-px flex flex-wrap justify-between gap-3 border-t border-white/10 py-[18px] text-[12.5px] text-cream/55",
  legalLinks: "flex flex-wrap items-center gap-4",
  baseLink: "text-cream transition-colors hover:text-white",
} as const;

export default styles;

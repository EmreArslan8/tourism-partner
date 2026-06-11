/* SiteHeader — Tailwind sınıf token'ları */
export const s = {
  header:
    "sticky top-0 z-50 border-b border-line bg-cream/80 backdrop-blur-md backdrop-saturate-150 relative",
  inner: "container-px flex h-[68px] items-center gap-7 max-[900px]:gap-3",
  logo: "inline-flex items-center gap-2.5",
  logoType: "flex flex-col font-display leading-[.92]",
  logoTop: "text-[15px] font-semibold tracking-[.14em] text-pine",
  logoBottom: "text-[11px] font-medium tracking-[.26em] text-terra",
  mark: "h-auto w-[30px] fill-terra",
  nav: "ml-2 flex gap-[22px] max-[900px]:hidden",
  navLink: "text-[14.5px] font-medium text-muted transition-colors hover:text-ink",
  actions: "ml-auto flex items-center gap-2.5 max-[900px]:hidden",
} as const;

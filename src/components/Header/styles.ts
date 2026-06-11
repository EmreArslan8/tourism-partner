export const s = {
  header: "fixed inset-x-0 top-0 z-50 w-full border-b border-line/70 bg-cream/86 backdrop-blur-xl",
  inner: "mx-auto grid h-[72px] w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 max-[560px]:px-4",
  left: "flex items-center justify-self-start",
  logo:
    "group flex shrink-0 items-center transition-transform duration-200 hover:-translate-y-px",
  logoImage: "h-[50px] w-auto object-contain max-[560px]:h-11",
  nav: "flex items-center justify-center gap-7 justify-self-stretch max-[1000px]:hidden",
  navLink: "flex items-center leading-none text-[14px] font-semibold text-ink/70 transition-colors hover:text-ink",
  navLinkActive: "text-ink",
  actions: "flex items-center justify-self-end gap-3 max-[900px]:hidden",
  separator: "h-4 w-px bg-line/60",
} as const;

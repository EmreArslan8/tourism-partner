export const s = {
  header: "absolute inset-x-0 top-0 z-50 w-full bg-transparent",
  inner: "container-px grid h-[80px] grid-cols-[auto_1fr_auto] items-center gap-4",
  left: "flex items-center justify-self-start",
  logo:
    "group flex shrink-0 items-center transition-transform duration-200 hover:-translate-y-px",
  logoImage: "h-[58px] w-auto object-contain max-[560px]:h-12",
  nav: "flex items-center justify-center gap-8 justify-self-stretch max-[1000px]:hidden",
  navLink: "flex items-center leading-none text-[18px] font-semibold tracking-[-0.01em] text-ink/70 transition-colors hover:text-ink",
  navLinkActive: "text-ink",
  actions: "flex items-center justify-self-end gap-4 max-[900px]:hidden",
  separator: "h-4 w-px bg-line/60",
} as const;

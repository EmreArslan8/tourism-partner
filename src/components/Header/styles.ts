const styles = {
  header: "absolute inset-x-0 top-0 z-50 w-full border-b border-white/20 bg-pine/60 shadow-[0_18px_55px_-36px_rgba(12,38,34,.75)] backdrop-blur-2xl supports-[backdrop-filter]:bg-pine/40",
  inner: "mx-auto grid h-[96px] w-full max-w-[1480px] grid-cols-[auto_1fr_auto] items-center gap-4 px-8 max-[640px]:h-[72px] max-[560px]:px-5",
  left: "flex items-center justify-self-start",
  logo: "group flex shrink-0 items-center transition-transform duration-200 hover:-translate-y-px",
  logoImage: "h-[50px] w-auto object-contain max-[560px]:h-11",
  nav: "flex items-center justify-center gap-7 justify-self-stretch max-[1000px]:hidden",
  navLink: "flex items-center leading-none text-[16px] font-semibold text-white transition-opacity hover:opacity-80",
  navLinkActive: "text-white",
  actions: "flex items-center justify-self-end gap-3 max-[900px]:hidden",
  separator: "h-4 w-px bg-white/20",
} as const;

export default styles;

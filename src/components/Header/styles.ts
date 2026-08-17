const styles = {
  header: "inset-x-0 top-0 z-50 w-full",
  // Anasayfa (hero görseli üstü): tamamen şeffaf, çizgisiz — hero degradesi kesintisiz
  // aksın (alt çizgi, degradenin dikey geçişini "iki ayrı renk" gibi gösteriyordu).
  headerGlass:
    "absolute bg-transparent",
  headerSolid: "relative border-b border-line bg-paper shadow-[0_18px_55px_-40px_rgba(36,17,63,.55)] transition-colors duration-200",
  inner: "container-px grid h-[80px] grid-cols-[auto_1fr_auto] items-center gap-4 min-[1440px]:h-[88px] min-[1800px]:h-[94px] max-[900px]:grid-cols-[1fr_auto] max-[900px]:gap-4 max-[640px]:h-[76px]",
  mobileMenu: "hidden max-[900px]:col-start-2 max-[900px]:row-start-1 max-[900px]:block max-[900px]:justify-self-end",
  left: "flex items-center justify-self-start max-[900px]:col-start-1 max-[900px]:row-start-1 max-[900px]:justify-self-start",
  nav: "flex items-center justify-center gap-6 justify-self-stretch min-[1440px]:gap-7 min-[1800px]:gap-8 max-[900px]:hidden",
  navLink:
    "relative inline-flex h-11 items-center rounded-sm px-0.5 text-[18px] font-medium leading-none text-ink/70 transition-colors duration-200 " +
    "hover:text-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-4 min-[1440px]:text-[19px] min-[1800px]:text-[20px]",
  navLinkActive: "font-semibold text-interactive",
  navLinkOnHero: "!text-hero-title/75 hover:!text-hero-title",
  navLinkActiveOnHero: "!font-semibold !text-hero-title",
  right: "col-start-3 flex items-center justify-self-end max-[900px]:hidden",
  actions: "flex items-center justify-self-end gap-3 min-[1440px]:gap-3.5 min-[1800px]:gap-4 max-[900px]:hidden",
  mobileAccount: "hidden max-[900px]:block",
  loginButton:
    "inline-flex h-11 items-center justify-center rounded-[12px] border border-brand/[.18] bg-paper/70 px-4 text-[15px] font-semibold text-brand " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_8px_22px_-18px_rgba(36,17,63,.5)] backdrop-blur-md transition-all " +
    "hover:border-brand/35 hover:bg-paper/90 dark:border-white/20 dark:bg-white/[.08] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,.12)] dark:hover:border-white/35 dark:hover:bg-white/[.13] " +
    "min-[1440px]:px-5 min-[1440px]:text-[16px]",
  loginButtonOnHero: "backdrop-blur-xl",
  registerButton: "inline-flex h-11 items-center justify-center rounded-[12px] bg-terra px-4 text-[15px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(74,26,151,.65)] transition-colors hover:bg-terra-deep min-[1440px]:px-5 min-[1440px]:text-[16px]",
  mobileLogin: "inline-flex h-10 items-center justify-center rounded-[10px] border border-interactive/30 px-2.5 text-[11px] font-bold leading-none text-interactive transition-colors active:bg-cream",
  mobileLoginOnHero: "!border-hero-title/35 !text-hero-title active:!bg-hero-title/15",
  separator: "h-4 w-px bg-line",
  separatorOnHero: "!bg-hero-title/20",
} as const;

export default styles;

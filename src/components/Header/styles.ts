const styles = {
  header: "inset-x-0 top-0 z-50 w-full",
  // Anasayfa (hero görseli üstü): tamamen şeffaf, çizgisiz — hero degradesi kesintisiz
  // aksın (alt çizgi, degradenin dikey geçişini "iki ayrı renk" gibi gösteriyordu).
  headerGlass:
    "absolute bg-transparent",
  headerSolid: "relative border-b border-line bg-paper shadow-[0_18px_55px_-40px_rgba(36,17,63,.55)] transition-colors duration-200",
  inner: "container-px grid h-[80px] grid-cols-[auto_1fr_auto] items-center gap-4 min-[1440px]:h-[88px] min-[1800px]:h-[94px] max-[900px]:grid-cols-[92px_1fr_92px] max-[900px]:gap-2 max-[640px]:h-[72px]",
  mobileMenu: "hidden justify-self-start max-[900px]:block",
  left: "flex items-center justify-self-start max-[900px]:col-start-2 max-[900px]:justify-self-center",
  nav: "flex items-center justify-center gap-7 justify-self-stretch min-[1440px]:gap-9 min-[1800px]:gap-10 max-[900px]:hidden",
  navLink: "flex items-center leading-none text-[18px] font-medium text-ink/75 transition-colors hover:text-interactive min-[1440px]:text-[19px] min-[1800px]:text-[20px]",
  navLinkActive: "text-interactive",
  navLinkOnHero: "!text-hero-title/75 hover:!text-hero-title",
  navLinkActiveOnHero: "!text-hero-title",
  right: "col-start-3 flex items-center justify-self-end",
  actions: "flex items-center justify-self-end gap-3 min-[1440px]:gap-3.5 min-[1800px]:gap-4 max-[900px]:hidden",
  mobileAccount: "hidden max-[900px]:block",
  loginButton: "rounded-[10px] border border-interactive/30 px-4 py-2 text-[15px] font-semibold text-interactive transition-colors hover:bg-cream min-[1440px]:px-5 min-[1440px]:py-2.5 min-[1440px]:text-[16px] min-[1800px]:text-[17px]",
  loginButtonOnHero: "!border-hero-title/30 !text-hero-title hover:!bg-hero-title/10",
  registerButton: "rounded-[10px] bg-terra px-4 py-2 text-[15px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(74,26,151,.65)] transition-colors hover:bg-terra-deep min-[1440px]:px-5 min-[1440px]:py-2.5 min-[1440px]:text-[16px] min-[1800px]:text-[17px]",
  mobileLogin: "inline-flex h-10 items-center justify-center rounded-[10px] border border-interactive/30 px-2.5 text-[11px] font-bold leading-none text-interactive transition-colors active:bg-cream",
  mobileLoginOnHero: "!border-hero-title/35 !text-hero-title active:!bg-hero-title/15",
  separator: "h-4 w-px bg-line",
  separatorOnHero: "!bg-hero-title/20",
} as const;

export default styles;

const styles = {
  root: "relative",
  trigger:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-terra px-3.5 text-[15px] font-semibold text-white " +
    "shadow-[0_14px_28px_-20px_rgba(76,29,149,.75)] transition-colors hover:bg-terra-deep " +
    "min-[1440px]:h-11 min-[1440px]:px-4 min-[1440px]:text-[16px] min-[1800px]:text-[17px] " +
    "max-[900px]:gap-1.5 max-[900px]:border max-[900px]:border-interactive/30 max-[900px]:bg-transparent " +
    "max-[900px]:px-2 max-[900px]:text-interactive max-[900px]:shadow-none max-[900px]:active:bg-cream",
  triggerOnHero: "max-[900px]:!border-hero-title/35 max-[900px]:!text-hero-title max-[900px]:active:!bg-hero-title/15",
  icon: "grid place-items-center max-[900px]:h-6 max-[900px]:w-6 max-[900px]:rounded-full max-[900px]:bg-cream max-[900px]:text-interactive",
  desktopLabel: "max-[900px]:hidden",
  mobileLabel: "hidden text-[11px] font-bold leading-none max-[900px]:inline",
  chevron: "transition-transform max-[900px]:hidden",
  menu: "absolute end-0 top-[calc(100%+10px)] z-50 grid min-w-[190px] gap-1 rounded-[10px] border border-line bg-paper p-1.5 text-ink shadow-[0_22px_60px_-28px_rgba(3,12,26,.55)]",
  menuLink: "inline-flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-cream",
  signOut: "inline-flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-start text-[13.5px] font-semibold text-red-700 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/35",
} as const;

export default styles;

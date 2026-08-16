/* MobileMenu — Tailwind sınıf token'ları (hamburger + tam ekran sheet). */
 const styles = {
  button: "ms-auto grid h-10 w-10 place-items-center rounded-[10px] text-interactive transition-colors active:bg-cream min-[900px]:hidden",
  buttonOnLight: "!text-hero-title active:!bg-hero-title/15",
  bar: "block h-[2px] w-5 rounded-full bg-current",
  barOnLight: "bg-current",
  sheet:
    "fixed inset-x-0 top-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden overscroll-none bg-paper min-[900px]:hidden",
  top: "flex h-16 shrink-0 items-center justify-between border-b border-line px-5",
  topActions: "flex items-center gap-2",
  close: "grid h-10 w-10 place-items-center rounded-[10px] border border-line text-ink transition-colors hover:bg-cream active:scale-95 dark:text-white dark:hover:bg-white/10",
  // Arama, linklerin üstünde: menü açılınca ilk görülen aksiyon.
  searchWrap: "shrink-0 px-3 py-2",
  searchForm: "relative flex items-center",
  searchIcon: "pointer-events-none absolute start-3.5 h-[18px] w-[18px] text-muted dark:text-white",
  searchInput:
    "field h-[42px] w-full !rounded-[12px] ps-11 pe-[82px] text-[14px] font-medium dark:text-white " +
    "placeholder:font-medium placeholder:text-muted dark:placeholder:text-white/80",
  searchSubmit:
    "absolute end-1 inline-flex h-[34px] items-center rounded-[9px] bg-sapphire-top px-3.5 " +
    "text-[13px] font-bold text-white transition-transform active:scale-95",
  list:
    "flex min-h-0 flex-1 flex-col justify-start gap-3 overflow-hidden px-3 py-3",
  link: "flex min-h-10 shrink items-center justify-between rounded-[12px] px-4 py-2 text-[15px] font-semibold leading-tight text-ink transition-colors hover:bg-cream active:bg-cream dark:text-white dark:hover:bg-white/10 dark:active:bg-white/10",
  actions:
    "mb-6 flex shrink-0 flex-col gap-2 border-t border-line px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] [&_.btn]:py-2.5 dark:[&_.btn-outline]:!border-white/35 dark:[&_.btn-outline]:!text-white",
} as const;

export default styles;

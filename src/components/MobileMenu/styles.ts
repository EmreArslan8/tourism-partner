/* MobileMenu — Tailwind sınıf token'ları (hamburger + tam ekran sheet). */
 const styles = {
  button: "ms-auto grid h-10 w-10 place-items-center rounded-[10px] text-white transition-colors active:bg-white/15 min-[900px]:hidden",
  bar: "block h-[2px] w-5 rounded-full bg-white",
  sheet: "fixed inset-0 z-[100] flex flex-col overflow-y-auto overscroll-contain bg-paper min-[900px]:hidden",
  top: "flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5",
  close: "grid h-10 w-10 place-items-center rounded-[10px] border border-line text-ink transition-colors hover:bg-cream active:scale-95",
  list: "flex flex-1 flex-col gap-0.5 px-3 py-3",
  link: "flex items-center justify-between rounded-[12px] px-4 py-3.5 text-[16px] font-semibold text-ink transition-colors hover:bg-cream active:bg-cream",
  actions:
    "shrink-0 border-t border-line px-5 py-4 flex flex-col gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]",
} as const;

export default styles;

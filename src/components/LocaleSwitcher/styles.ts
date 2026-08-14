 const styles = {
  wrapper: "relative inline-block text-start",
  button: "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[15px] font-semibold text-muted transition-colors hover:bg-cream hover:text-ink",
  buttonLight: "flex items-center gap-1.5 rounded-lg border border-hero-title/40 bg-hero-title/10 px-2.5 py-2 text-[15px] font-semibold text-hero-title transition-colors hover:border-hero-title/70 hover:bg-hero-title/15",
  flag: "grid h-[22px] w-[22px] place-items-center rounded-full bg-white text-[15px] leading-none shadow-[0_1px_4px_rgba(7,9,42,.12)]",
  label: "uppercase tracking-wide text-current",
  itemFlag: "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-slate-100 text-[15px] leading-none",
  icon: "w-4 h-4 opacity-60",
  dropdown: "absolute end-0 z-[100] mt-2 w-36 overflow-hidden rounded-xl border border-line bg-paper shadow-pop animate-card-in",
  item: "flex w-full items-center justify-between px-4 py-2.5 text-start text-[13.5px] transition-colors hover:bg-cream",
  itemLeft: "flex items-center gap-2",
  itemActive: "bg-cream text-interactive font-medium",
  itemName: "text-ink",
  itemCode: "text-[11px] opacity-40 font-bold",
  inlineWrap: "flex items-center gap-1.5",
  inlineItem: "flex-1 rounded-[10px] border border-line px-2 py-2 text-center text-[13px] font-bold uppercase tracking-wide text-muted transition-colors hover:bg-cream",
  inlineItemActive: "border-terra bg-terra !text-white shadow-[0_10px_20px_-14px_rgba(1,20,93,.9)]",
} as const;

export default styles;

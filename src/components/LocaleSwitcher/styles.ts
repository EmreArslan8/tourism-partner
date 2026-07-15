 const styles = {
  wrapper: "relative inline-block text-start",
  button: "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[15px] font-semibold text-muted transition-colors hover:text-ink hover:bg-slate-100/60",
  buttonLight: "flex items-center gap-1.5 rounded-lg border border-white/55 bg-white/10 px-2.5 py-2 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/15",
  flag: "grid h-[22px] w-[22px] place-items-center rounded-full bg-white text-[15px] leading-none shadow-[0_1px_4px_rgba(7,9,42,.12)]",
  label: "uppercase tracking-wide text-current",
  itemFlag: "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-slate-100 text-[15px] leading-none",
  icon: "w-4 h-4 opacity-60",
  dropdown: "absolute end-0 mt-2 w-36 bg-white border border-line rounded-xl shadow-pop overflow-hidden z-[100] animate-card-in",
  item: "flex items-center justify-between w-full px-4 py-2.5 text-start text-[13.5px] transition-colors hover:bg-slate-50",
  itemLeft: "flex items-center gap-2",
  itemActive: "text-brand bg-brand/5 font-medium",
  itemName: "text-ink",
  itemCode: "text-[11px] opacity-40 font-bold",
} as const;

export default styles;

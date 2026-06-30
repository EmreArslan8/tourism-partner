 const styles = {
  wrapper: "relative inline-block text-left",
  button: "flex items-center gap-1 px-2.5 py-2 rounded-lg text-[15px] font-semibold text-muted transition-colors hover:text-ink hover:bg-slate-100/60",
  buttonLight: "flex items-center gap-1 px-2.5 py-2 rounded-lg text-[15px] font-semibold text-white/80 transition-colors hover:text-white hover:bg-white/10",
  label: "uppercase tracking-wide",
  itemFlag: "h-[22px] w-[22px] rounded-full object-cover",
  icon: "w-4 h-4 opacity-60",
  dropdown: "absolute right-0 mt-2 w-36 bg-white border border-line rounded-xl shadow-pop overflow-hidden z-[100] animate-card-in",
  item: "flex items-center justify-between w-full px-4 py-2.5 text-left text-[13.5px] transition-colors hover:bg-slate-50",
  itemLeft: "flex items-center gap-2",
  itemActive: "text-brand bg-brand/5 font-medium",
  itemName: "text-ink",
  itemCode: "text-[11px] opacity-40 font-bold",
} as const;

export default styles;

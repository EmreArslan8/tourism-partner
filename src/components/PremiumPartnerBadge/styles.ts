const styles = {
  base:
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[.08em] " +
    "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0",
  default:
    "border-star/60 bg-star/15 text-star shadow-[0_10px_24px_-18px_rgba(7,9,42,.55)] [&>svg]:text-star",
  onImage:
    "border-[#efbd45] bg-[#160d38] text-[#ffd15c] " +
    "shadow-[0_10px_26px_-12px_rgba(0,0,0,.9),inset_0_1px_0_rgba(255,255,255,.12)] " +
    "[&>svg]:text-[#ffd15c]",
} as const;

export default styles;

 const styles = {
  base: "inline-flex items-center justify-center rounded-pill border px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[.04em]",
  variants: {
    default: "bg-cream/60 text-muted border-line",
    gold: "bg-gold text-pine border-transparent shadow-[0_8px_18px_-10px_rgba(0,0,0,.5)]",
    terra: "bg-terra/15 text-terra-deep border-transparent",
    pine: "bg-group-acente/15 text-group-acente border-transparent",
    muted: "bg-black/45 text-white border-transparent backdrop-blur-sm",
  },
} as const;

export default styles;
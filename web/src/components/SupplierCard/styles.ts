/* SupplierCard — tedarikçi kartı ortak görünümü (vitrin + listeleme). */
export const s = {
  card:
    "flex animate-card-in flex-col overflow-hidden rounded-[16px] border border-line bg-paper shadow-card " +
    "transition-transform duration-300 ease-brand hover:-translate-y-[3px] hover:shadow-pop",
  flag:
    "absolute right-3 top-3 z-[2] rounded-pill bg-gold px-2.5 py-1 text-[10.5px] " +
    "font-bold uppercase tracking-[.06em] text-[#2a2208]",
  cover: "relative grid h-[116px] place-items-center text-white/90",
  mono: "font-display text-[40px] italic",
  body: "flex flex-1 flex-col gap-[7px] p-4 pt-3.5",
  tags: "flex flex-wrap items-center gap-2",
  badge:
    "rounded-pill border border-line px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-[.04em] text-muted",
  verified: "text-[10.5px] font-bold text-group-acente",
  name: "text-[19px]",
  loc: "flex items-center gap-2 text-[13px] text-muted",
  stars: "inline-flex text-[14px] text-gold",
  desc: "line-clamp-2 text-[13px] leading-normal text-muted",
  foot: "mt-auto flex flex-wrap items-center gap-2 pt-1.5",
} as const;

/* SupplierCard — tedarikçi kartı ortak görünümü (vitrin + listeleme). */
export const styles= {
  card:
    "group flex animate-card-in flex-col overflow-hidden rounded-[12px] border border-line bg-paper shadow-[0_16px_44px_-34px_rgba(7,9,42,.55)] " +
    "transition-transform duration-300 ease-brand hover:-translate-y-[2px] hover:shadow-pop",
  flag:
    "absolute right-2.5 top-2.5 z-[3] rounded-pill bg-gold px-2.5 py-1 text-[10px] " +
    "font-bold text-pine shadow-[0_6px_16px_-8px_rgba(0,0,0,.5)]",
  cover: "relative flex h-[148px] items-center justify-center overflow-hidden",
  coverImg: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.04]",
  coverGrad: "absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/5 to-transparent",
  coverRating:
    "absolute left-2.5 top-2.5 z-[2] inline-flex items-center gap-1 rounded-pill bg-black/35 px-2 py-1 " +
    "text-[11px] font-bold text-white backdrop-blur-sm",
  body: "flex flex-1 flex-col gap-[6px] p-3.5",
  tags: "flex flex-wrap items-center gap-2",
  badge:
    "rounded-pill border border-line px-2 py-[3px] text-[10px] font-bold uppercase text-muted",
  verified: "inline-flex items-center gap-1 text-[10.5px] font-bold text-group-acente",
  name: "text-[16.5px] leading-tight",
  loc: "text-[12.5px] text-muted",
  stars: "inline-flex text-[14px] text-gold",
  desc: "line-clamp-2 min-h-[34px] text-[12.75px] leading-normal text-muted",
  foot: "mt-auto flex flex-wrap items-center gap-2 pt-2",
} as const;

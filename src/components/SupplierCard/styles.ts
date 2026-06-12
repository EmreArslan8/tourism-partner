/* SupplierCard — tedarikçi kartı ortak görünümü (vitrin + listeleme). */
export const styles= {
  card:
    "group flex animate-card-in flex-col overflow-hidden rounded-[12px] border border-line bg-paper shadow-[0_18px_54px_-42px_rgba(7,9,42,.66)] " +
    "transition-all duration-300 ease-brand hover:-translate-y-[3px] hover:border-terra/35 hover:shadow-[0_28px_72px_-50px_rgba(7,9,42,.85)]",
  flag:
    "absolute right-3 top-3 z-[3] rounded-[999px] bg-gold px-2.5 py-1 text-[10px] " +
    "font-extrabold text-pine shadow-[0_8px_18px_-10px_rgba(0,0,0,.5)]",
  cover: "relative flex h-[178px] items-center justify-center overflow-hidden max-[1180px]:h-[168px] max-[640px]:h-[190px]",
  coverImg: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.045]",
  coverGrad: "absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/5 to-transparent",
  coverRating:
    "absolute left-3 top-3 z-[2] inline-flex items-center gap-1 rounded-[999px] bg-black/45 px-2.5 py-1 " +
    "text-[11px] font-extrabold text-white backdrop-blur-sm",
  body: "flex flex-1 flex-col gap-2.5 p-4",
  tags: "flex min-w-0 flex-wrap items-center gap-2",
  badge:
    "max-w-full truncate rounded-[999px] border border-line bg-cream/60 px-2.5 py-[4px] text-[10.5px] font-extrabold uppercase tracking-[.04em] text-muted",
  verified: "inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-terra-deep",
  name: "line-clamp-1 text-[19px] leading-tight tracking-[-.015em]",
  loc: "line-clamp-1 text-[13px] font-medium text-muted",
  stars: "inline-flex text-[14px] text-gold",
  desc: "line-clamp-2 min-h-[42px] text-[14px] leading-relaxed text-muted",
  foot:
    "mt-auto flex items-center justify-between gap-3 border-t border-line/80 pt-3 " +
    "[&_.btn]:h-10 [&_.btn]:rounded-[9px] [&_.btn]:px-4 [&_.btn]:font-extrabold " +
    "[&_.btn-outline]:border-[1.5px] [&_.btn-outline]:bg-white [&_.btn-outline]:text-ink " +
    "[&_.btn-solid]:min-w-[116px] [&_.btn-solid]:shadow-[0_14px_28px_-19px_rgba(53,66,238,.95)]",
} as const;

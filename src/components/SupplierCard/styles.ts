/* SupplierCard — tedarikçi kartı ortak görünümü (vitrin + listeleme). */
 const styles= {
  card:
    "group flex h-[520px] animate-card-in flex-col overflow-hidden rounded-[10px] border border-line bg-paper shadow-card " +
    "max-[640px]:h-[480px] " +
    "transition-all duration-300 ease-brand hover:-translate-y-[2px] hover:border-terra/35 hover:shadow-[0_18px_44px_-36px_rgba(7,9,42,.8)]",
  flag:
    "absolute left-3 top-3 z-[3] rounded-[999px] bg-gold px-2.5 py-1 text-[10px] " +
    "font-extrabold text-pine shadow-[0_8px_18px_-10px_rgba(0,0,0,.5)]",
  favorite: "absolute right-3 top-3 z-[5] pointer-events-auto",
  cover: "relative flex h-[280px] shrink-0 items-center justify-center overflow-hidden max-[640px]:h-[258px]",
  coverImg: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.045]",
  placeholder:
    "relative z-[1] inline-flex rounded-full border border-white/25 bg-white/18 px-3 py-1.5 text-[12px] font-bold text-white/90 backdrop-blur-sm",
  coverGrad: "absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/5 to-transparent",
  body: "flex min-h-0 flex-1 flex-col gap-1.5 p-4",
  // Kategori çipi — en küçük seviye, sessiz üst-etiket (label rolü).
  tags: "flex min-w-0 shrink-0 flex-wrap items-center gap-2",
  badge:
    "max-w-full truncate rounded-[8px] border border-line bg-[#eef3ff] px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[.06em] text-[#4b5875]",
  founderBadge:
    "inline-grid h-5 w-5 shrink-0 place-items-center text-terra-deep",
  verified: "inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-terra-deep",
  // Başlık — en baskın: kalın, büyük, koyu (hiyerarşinin tepesi).
  nameWrap: "flex min-w-0 shrink-0 items-center gap-1.5 py-0.5",
  name: "line-clamp-1 min-w-0 text-[18px] font-bold leading-snug tracking-[-.012em] text-ink",
  // Konum — ikincil meta: okunur ama başlıktan sessiz (orta ağırlık, koyu-mat renk).
  loc: "flex shrink-0 items-center justify-between gap-3 text-[12.5px] font-semibold text-[#48566e] [&>span:first-child]:min-w-0 [&>span:first-child]:truncate",
  rating: "ml-2 shrink-0 rounded-full bg-cream px-2 py-0.5 text-[12px] font-bold text-terra-deep",
  stars: "inline-flex text-[14px] text-gold",
  // Açıklama — gövde metni: normal ağırlık, yumuşak renk, rahat satır.
  desc: "line-clamp-2 min-h-[42px] text-[13px] font-normal leading-[1.55] text-[#5b6472]",
  foot:
    "mt-auto flex items-center justify-between gap-3 border-t border-line/80 pt-3 " +
    "[&_.btn]:h-10 [&_.btn]:rounded-[8px] [&_.btn]:px-4 [&_.btn]:font-semibold " +
    "[&_.btn-outline]:border [&_.btn-outline]:bg-white [&_.btn-outline]:text-ink " +
    "[&_.btn-solid]:min-w-[116px] [&_.btn-solid]:shadow-[0_14px_28px_-19px_rgba(53,66,238,.95)]",
} as const;

export default styles;

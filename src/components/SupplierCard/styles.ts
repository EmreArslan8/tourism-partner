/* SupplierCard — tedarikçi kartı ortak görünümü (vitrin + listeleme). */
 const styles= {
  card:
    "group flex h-[480px] animate-card-in flex-col overflow-hidden rounded-[10px] border border-line bg-paper shadow-card " +
    "min-[1440px]:h-[540px] min-[1800px]:h-[580px] " +
    "max-[640px]:h-[460px] " +
    "transition-all duration-300 ease-brand hover:-translate-y-[2px] hover:border-terra/35 hover:shadow-[0_18px_44px_-36px_rgba(7,9,42,.8)]",
  // Yatay varyant — explore tam genişlik listesi: görsel solda sabit sütun, içerik sağda.
  cardH:
    "group flex h-[224px] animate-card-in flex-row overflow-hidden rounded-[10px] border border-line bg-paper shadow-card " +
    "min-[1440px]:h-[240px] " +
    "max-[640px]:h-[172px] " +
    "transition-all duration-300 ease-brand hover:-translate-y-[2px] hover:border-terra/35 hover:shadow-[0_18px_44px_-36px_rgba(7,9,42,.8)]",
  premiumCard:
    "premium-card-attention border-[#d8aa45] ring-1 ring-[#f2cb6b]/50 " +
    "shadow-[0_18px_46px_-28px_rgba(164,108,0,.62),inset_0_0_0_1px_rgba(255,221,126,.08)] " +
    "hover:border-[#efc75e] hover:ring-[#e4b444]/75 hover:shadow-[0_24px_52px_-28px_rgba(164,108,0,.78)]",
  flag:
    "absolute start-3 top-3 z-[3]",
  premiumFlag:
    "px-3.5 py-1.5",
  favorite: "absolute end-3 top-3 z-[5] pointer-events-auto",
  cover: "relative flex h-[240px] shrink-0 items-center justify-center overflow-hidden min-[1440px]:h-[280px] min-[1800px]:h-[305px] max-[640px]:h-[230px]",
  // Yatay varyant görseli — solda sabit genişlikte, kartın tam yüksekliğinde.
  coverH: "relative flex h-full w-[200px] shrink-0 items-center justify-center overflow-hidden min-[1440px]:w-[236px] max-[640px]:w-[118px]",
  coverImg: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.045]",
  placeholder:
    "relative z-[1] flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,.18),transparent_34%),linear-gradient(145deg,rgba(9,23,71,.18),rgba(9,23,71,.52))] text-white/90",
  placeholderLogo: "grid h-14 w-14 place-items-center rounded-[15px] border border-white/20 bg-white/10 px-2 backdrop-blur-sm",
  placeholderLabel: "text-[10px] font-bold uppercase tracking-[.16em] text-white/70",
  coverGrad: "absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/5 to-transparent",
  body: "flex min-h-0 flex-1 flex-col gap-1.5 p-4 min-[1440px]:gap-2 min-[1440px]:p-5 min-[1800px]:p-6",
  // Kategori çipi — en küçük seviye, sessiz üst-etiket (label rolü).
  tags: "flex min-w-0 shrink-0 flex-wrap items-center gap-2",
  badge:
    "max-w-full truncate !rounded-none !border-0 !bg-transparent !px-0 !py-0 text-[11px] font-medium uppercase tracking-[.075em] text-ink/70",
  // Başlık — en baskın: kalın, büyük, koyu (hiyerarşinin tepesi).
  nameWrap: "flex min-w-0 shrink-0 items-start gap-2 py-0.5",
  name: "line-clamp-2 min-w-0 font-display text-[22px] font-medium leading-[1.18] tracking-[-.022em] text-ink min-[1440px]:text-[25px] min-[1800px]:text-[27px] max-[640px]:text-[20px]",
  verifiedBadge: "mt-0.5",
  partnerMedal: "mt-0.5 !h-6 !w-[22px]",
  // Konum — ikincil meta: okunur ama başlıktan sessiz (orta ağırlık, koyu-mat renk).
  loc: "flex shrink-0 items-center justify-between gap-3 text-[12.5px] font-semibold text-muted min-[1440px]:text-[13.5px] min-[1800px]:text-[14px] [&>span:first-child]:min-w-0 [&>span:first-child]:truncate",
  rating: "ms-2 shrink-0 rounded-full bg-cream px-2 py-0.5 text-[12px] font-bold text-terra-deep",
  stars: "inline-flex text-[14px] text-gold",
  // Açıklama — gövde metni: normal ağırlık, yumuşak renk, rahat satır.
  desc: "line-clamp-2 min-h-[42px] text-[13px] font-normal leading-[1.55] text-muted min-[1440px]:min-h-[48px] min-[1440px]:text-[14px] min-[1800px]:text-[15px]",
  foot:
    "mt-auto flex items-center justify-between gap-3 border-t border-line/80 pt-3 " +
    "[&_.btn]:h-10 [&_.btn]:rounded-[8px] [&_.btn]:px-4 [&_.btn]:font-semibold " +
    "[&_.btn-outline]:border [&_.btn-outline]:bg-paper [&_.btn-outline]:text-ink " +
    "[&_.btn-solid]:min-w-[116px] [&_.btn-solid]:shadow-[0_14px_28px_-19px_rgba(53,66,238,.95)]",
  actions: "ms-auto flex shrink-0 items-center gap-2",
} as const;

export default styles;

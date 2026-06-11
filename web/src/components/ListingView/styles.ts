/* ListingView — Tailwind sınıf token'ları (filtreleme + düzen).
   Kart görünümü SupplierCard'da; burada yalnız filtre/sonuç/harita düzeni. */
export const s = {
  head: "mb-5",
  title: "text-[clamp(28px,3.4vw,40px)]",
  sub: "mt-2 text-[15px] text-muted",

  bar: "mt-5 flex flex-wrap items-center gap-2.5 rounded-[16px] border border-line bg-paper p-3.5 shadow-card",
  chips: "flex flex-wrap gap-2 border-r border-line pr-3 mr-1 max-[700px]:mr-0 max-[700px]:w-full max-[700px]:border-r-0 max-[700px]:pr-0",
  chip:
    "inline-flex items-center gap-2 rounded-pill border-[1.5px] border-line bg-paper px-3 py-2 " +
    "text-[13px] font-semibold text-ink transition-colors hover:border-terra",
  chipActive: "!border-terra !bg-terra !text-white",
  chipDot: "h-2 w-2 rounded-full",
  field: "field h-[42px] max-[640px]:w-full",
  search: "field h-[42px] min-w-[160px] flex-1 max-[640px]:w-full max-[640px]:flex-none",

  active: "mt-3.5 flex flex-wrap items-center gap-2",
  activeLabel: "text-[12.5px] font-semibold text-muted",
  tag:
    "inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-terra/30 bg-terra/10 " +
    "px-2.5 py-1 text-[12.5px] font-semibold text-terra-deep transition-colors hover:bg-terra/20",
  tagX: "text-[14px] leading-none opacity-70",
  clearTag:
    "rounded-pill border-[1.5px] border-line bg-transparent px-2.5 py-1 text-[12.5px] " +
    "font-semibold text-muted transition-colors hover:border-terra hover:text-terra-deep",

  resultsBar: "mt-4 mb-4 flex flex-wrap items-center justify-between gap-3",
  count: "text-[14px] font-medium text-muted",
  countStrong: "text-ink",
  barRight: "flex items-center gap-3 max-[560px]:w-full max-[560px]:justify-between",
  viewToggle: "inline-flex items-center gap-1 rounded-pill border border-line bg-paper p-1",
  viewBtn:
    "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-ink",
  viewBtnActive: "!bg-terra !text-white hover:!text-white",
  viewIcon: "h-3.5 w-3.5",
  sortWrap: "flex items-center gap-2.5",
  sortLabel: "text-[13px] text-muted max-[560px]:hidden",
  sortSelect:
    "h-auto rounded-pill border-[1.5px] border-line bg-paper py-2 pl-4 pr-8 text-[13.5px] font-semibold focus:border-terra focus:outline-none",

  region:
    "mb-5 flex flex-wrap items-center gap-2.5 rounded-[14px] border border-dashed border-gold/50 " +
    "bg-gradient-to-br from-gold/[.07] to-paper/50 px-4 py-3.5",
  regionLabel: "mr-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink",
  regionChip:
    "inline-flex items-center gap-2 rounded-pill border-[1.5px] border-line bg-paper py-1.5 pl-3 pr-2 " +
    "text-[13px] font-semibold text-ink transition-all hover:-translate-y-px hover:border-terra",
  regionCount:
    "inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-cream-deep px-1.5 text-[11.5px] font-bold text-muted",

  shell: "grid grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)] items-start gap-5 max-[1000px]:grid-cols-1",
  mapAside: "sticky top-[84px] max-[1000px]:static",
  grid: "grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4",
  gridWide: "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4",

  empty: "rounded-[14px] border border-dashed border-line bg-paper px-6 py-14 text-center",
  emptyTitle: "mb-2 text-[22px]",
  emptyText: "mb-4 text-[14.5px] text-muted",

  pagination: "mt-7 flex justify-center gap-2",
  pageBtn:
    "grid h-9 min-w-9 place-items-center rounded-[9px] border border-line bg-paper px-2 text-[14px] " +
    "font-semibold text-ink transition-colors hover:border-terra disabled:opacity-40 disabled:hover:border-line",
  pageBtnActive: "!border-terra !bg-terra !text-white",
} as const;

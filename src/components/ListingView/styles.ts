/* ListingView — Tailwind sınıf token'ları (filtreleme + düzen).
   Kart görünümü SupplierCard'da; burada yalnız filtre/sonuç/harita düzeni. */
const styles= {
  head: "mb-5",
  title: "text-[clamp(28px,3.4vw,40px)]",
  sub: "mt-2 text-[15px] text-muted",

  bar:
    "mt-5 flex flex-wrap items-center gap-2.5 rounded-[18px] border border-line bg-paper p-3 shadow-card " +
    "max-[640px]:flex-nowrap max-[640px]:overflow-x-auto max-[640px]:[scrollbar-width:none] max-[640px]:[&::-webkit-scrollbar]:hidden",
  field: "field h-[42px] max-[640px]:shrink-0",

  acWrap: "relative shrink-0",
  acIconBtn: "field grid h-[42px] w-[42px] shrink-0 place-items-center !px-0 text-muted transition-colors hover:border-terra hover:text-ink",
  acInput: "field h-[42px] w-[260px] !rounded-[12px] pl-10 text-[14px] max-[640px]:w-[180px]",
  acSearchIcon: "pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted",
  acPanel:
    "absolute left-0 right-0 z-30 mt-1.5 overflow-hidden rounded-[12px] border border-line bg-paper " +
    "shadow-[0_24px_60px_-24px_rgba(7,9,42,.45)]",
  acGroup: "px-3 pb-1 pt-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted/70",
  acItem: "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-[13.5px] text-ink",
  acItemActive: "bg-terra/10",
  acItemMain: "min-w-0 flex-1 truncate font-medium",
  acItemSub: "shrink-0 text-[12px] font-medium text-muted",
  acDot: "h-2 w-2 shrink-0 rounded-full",
  acIcon: "h-3.5 w-3.5 shrink-0 text-muted",
  acEmpty: "px-3 py-3 text-[13px] text-muted",

  toggle:
    "inline-flex h-[42px] items-center justify-center gap-2 rounded-pill border-[1.5px] border-line bg-paper px-3.5 " +
    "text-[13px] font-semibold text-ink transition-colors hover:border-terra max-[640px]:shrink-0",
  toggleActive: "!border-terra !bg-terra/10 !text-terra-deep",
  toggleBox: "grid h-4 w-4 place-items-center rounded-[5px] border-[1.5px] border-current text-white",

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

  // Sol katalog + içerik düzeni
  layout: "grid grid-cols-[244px_minmax(0,1fr)] items-start gap-6 max-[1000px]:grid-cols-1 max-[1000px]:gap-0",
  content: "min-w-0",
  catalogAside: "sticky top-6 self-start max-h-[calc(100vh-48px)] overflow-y-auto max-[1000px]:hidden",

  catalog: "flex flex-col gap-1 rounded-[20px] border border-line bg-paper p-3 shadow-card",
  catalogTitle: "flex items-center gap-2 px-2.5 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted/70",
  catHead: "flex items-center rounded-[13px] transition-colors hover:bg-slate-50/80",
  catHeadActive: "!bg-terra/10",
  catHeadMain: "flex min-w-0 flex-1 items-center gap-3 rounded-l-[13px] py-3 pl-3 pr-1 text-[14.5px] font-semibold text-ink",
  catHeadMainActive: "!text-terra-deep",
  catDot: "h-2.5 w-2.5 shrink-0 rounded-full",
  catLabel: "min-w-0 flex-1 truncate text-left",
  catCount: "shrink-0 rounded-pill bg-ink/[.07] px-1.5 text-[11px] font-bold leading-[18px] text-muted",
  catChevBtn: "mr-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5",
  catChev: "h-4 w-4 transition-transform duration-200",
  catChevOpen: "rotate-90",
  catChildren: "mb-1.5 ml-[22px] mt-1 flex flex-col gap-1 border-l border-line pl-2.5",
  catChild: "flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13.5px] font-medium text-muted transition-colors hover:bg-slate-50/80 hover:text-ink",
  catChildActive: "!font-semibold !text-terra-deep",
  catChildLabel: "min-w-0 flex-1 truncate text-left",

  // Mobil araç çubuğu (arama + kategoriler + filtreler)
  toolbar: "mb-4 hidden items-center gap-2.5 max-[1000px]:flex",
  toolBtn:
    "inline-flex h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-line " +
    "bg-paper px-3 text-[13.5px] font-semibold text-ink shadow-card transition-colors hover:border-terra",
  toolBtnBadge: "grid h-5 min-w-5 place-items-center rounded-full bg-terra px-1 text-[11px] font-bold text-white",

  // Alttan açılan panel (bottom sheet)
  sheetOverlay: "fixed inset-0 z-[60] flex items-end bg-ink/45 backdrop-blur-[2px]",
  sheet: "flex max-h-[84vh] w-full flex-col rounded-t-[22px] bg-white shadow-[0_-12px_40px_-12px_rgba(7,9,42,.4)]",
  sheetGrab: "mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-line",
  sheetHead: "flex items-center justify-between px-4 pb-2 pt-2.5",
  sheetTitle: "text-[16px] font-bold",
  sheetClose: "grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-slate-100",
  sheetBody: "overflow-y-auto px-4 pb-5",
  sheetFilters: "flex flex-col gap-2.5",
  regionMobileHide: "max-[1000px]:hidden",

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
 export default styles
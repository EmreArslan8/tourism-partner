/* ListingView — Tailwind sınıf token'ları (filtreleme + düzen).
   Kart görünümü SupplierCard'da; burada yalnız filtre/sonuç/harita düzeni. */
const styles= {
  head: "mb-5 max-w-[760px]",
  eyebrow:
    "mb-2 text-[11.5px] font-extrabold uppercase tracking-[.11em] text-terra-deep",
  title: "text-[36px] tracking-[-.02em] max-[560px]:text-[29px]",
  sub: "mt-1.5 max-w-[620px] text-[14px] leading-6 text-muted",

  bar:
    "sticky top-[86px] z-30 grid grid-cols-[minmax(126px,.75fr)_minmax(126px,.75fr)_minmax(126px,.75fr)_minmax(142px,.8fr)_auto_minmax(310px,1.7fr)] " +
    "items-center gap-2 rounded-[15px] border border-line/80 bg-paper/92 p-2 shadow-[0_18px_54px_-48px_rgba(7,9,42,.72)] backdrop-blur-xl " +
    "max-[1280px]:grid-cols-[repeat(4,minmax(128px,1fr))_minmax(160px,.8fr)] max-[1280px]:[&>*:last-child]:col-span-5",
  field: "field h-[42px]",
  selectWrap: "relative block min-w-0",
  selectControl:
    "w-full appearance-none !rounded-[11px] !border-line/90 !bg-white !pl-3.5 !pr-9 text-[13px] font-bold " +
    "text-ink shadow-[0_10px_24px_-22px_rgba(7,9,42,.5)] hover:!border-terra/45 focus:!border-terra",
  selectChevron: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/75",
  selectField: "w-full",
  barSearch: "min-w-0 [&>div]:w-full [&_input]:w-full",

  acWrap: "relative min-w-0",
  acIconBtn: "field grid h-[42px] w-[42px] shrink-0 place-items-center !px-0 text-muted transition-colors hover:border-terra hover:text-ink",
  acInput:
    "field h-[42px] w-[360px] !rounded-[11px] !border-line/90 !bg-white pl-10 text-[14px] font-semibold " +
    "shadow-[0_10px_24px_-22px_rgba(7,9,42,.5)] placeholder:text-muted/60 hover:!border-terra/45 max-[1120px]:w-full",
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
    "inline-flex h-[42px] items-center justify-center gap-2 rounded-[11px] border-[1.5px] border-line/90 bg-white px-3.5 " +
    "text-[13px] font-extrabold text-ink shadow-[0_10px_24px_-22px_rgba(7,9,42,.5)] transition-all hover:border-terra/45 max-[640px]:shrink-0",
  toggleActive: "!border-terra !bg-terra !text-white",
  toggleBox: "grid h-4 w-4 place-items-center rounded-full border-[1.5px] border-current text-white",

  active: "mt-3.5 flex flex-wrap items-center gap-2",
  activeLabel: "text-[12.5px] font-semibold text-muted",
  tag:
    "inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-terra/30 bg-terra/10 " +
    "px-2.5 py-1 text-[12.5px] font-semibold text-terra-deep transition-colors hover:bg-terra/20",
  tagX: "text-[14px] leading-none opacity-70",
  clearTag:
    "rounded-pill border-[1.5px] border-line bg-transparent px-2.5 py-1 text-[12.5px] " +
    "font-semibold text-muted transition-colors hover:border-terra hover:text-terra-deep",

  // Hizmet/koşul facet paneli (sol kenar — filtreleme motoru)
  facetWrap: "mt-3 flex flex-col rounded-[14px] border border-line bg-paper p-2 shadow-card",
  // Kategori kartının içine gömülü (aynı stack) hâli — kart yok, sadece bölüm
  facetBare: "mt-1 flex flex-col border-t border-line/70 pt-2",
  facetHead:
    "mb-1 flex items-center gap-2 px-2.5 py-2 text-[11.5px] font-bold uppercase tracking-[.04em] text-muted",
  facetHeadIcon: "h-3.5 w-3.5 text-terra",
  facetClear:
    "ml-auto rounded-pill border border-line bg-paper px-2 py-0.5 text-[10.5px] font-semibold normal-case " +
    "text-muted transition-colors hover:border-terra hover:text-terra-deep",
  facetGroups: "flex flex-col gap-3 px-2.5 pb-1 pt-0.5",
  facetRow: "flex flex-col gap-1.5",
  facetRowLabel: "text-[11.5px] font-bold uppercase tracking-[.05em] text-muted",
  facetChips: "flex flex-wrap items-center gap-1.5",
  facetChip:
    "inline-flex cursor-pointer select-none items-center rounded-pill border-[1.5px] border-line bg-paper px-3 py-1 " +
    "text-[12.5px] font-semibold text-ink transition-colors hover:border-terra",
  facetChipActive: "!border-terra !bg-terra/10 !text-terra-deep",
  // Checkbox listesi (chip yerine)
  facetCheckList: "flex flex-col gap-0.5",
  facetCheck:
    "flex cursor-pointer select-none items-center gap-2 rounded-[8px] px-1.5 py-[5px] text-[12.5px] font-medium text-ink hover:bg-cream",
  facetCheckActive: "text-terra-deep",
  facetCheckbox: "h-[15px] w-[15px] shrink-0 accent-terra",

  resultsBar: "mb-4 mt-4 flex flex-wrap items-center justify-between gap-3 px-[10px] py-1",
  count: "text-[14px] font-semibold text-muted",
  countStrong: "text-ink",
  barRight: "flex items-center gap-3 max-[560px]:w-full max-[560px]:justify-between",
  viewToggle: "inline-flex items-center gap-1 rounded-[13px] border border-line bg-cream/80 p-1",
  viewBtn:
    "inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-bold text-muted transition-colors hover:text-ink",
  viewBtnActive: "!bg-terra !text-white shadow-[0_10px_24px_-16px_rgba(53,66,238,.9)] hover:!text-white",
  viewIcon: "h-3.5 w-3.5",
  sortWrap: "flex items-center gap-2.5",
  sortLabel: "text-[13px] text-muted max-[560px]:hidden",
  sortSelectWrap: "relative inline-flex w-[106px]",
  sortSelect:
    "h-auto w-full appearance-none rounded-[10px] border-[1.5px] border-line bg-paper py-[7px] pl-2.5 pr-7 text-[13px] font-bold focus:border-terra focus:outline-none",
  sortChevron: "pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70",

  region:
    "mb-5 flex flex-wrap items-center gap-2 rounded-[15px] border border-dashed border-terra/25 " +
    "bg-[linear-gradient(135deg,rgba(255,255,255,.84),rgba(231,236,255,.5))] px-3.5 py-3",
  regionLabel: "mr-1 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-ink",
  regionChip:
    "inline-flex items-center gap-2 rounded-pill border-[1.5px] border-line bg-paper py-1.5 pl-3 pr-2 " +
    "text-[13px] font-bold text-ink transition-all hover:-translate-y-px hover:border-terra hover:shadow-[0_12px_28px_-24px_rgba(7,9,42,.7)]",
  regionCount:
    "inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-cream-deep px-1.5 text-[11.5px] font-bold text-muted",

  // Sol katalog + içerik düzeni
  layout: "grid grid-cols-[260px_minmax(0,1fr)] items-start gap-5 max-[1120px]:grid-cols-1 max-[1120px]:gap-0",
  content: "min-w-0",
  catalogAside: "sticky top-[92px] self-start max-h-[calc(100vh-112px)] overflow-y-auto pr-1 max-[1120px]:hidden",

  catalog: "flex flex-col rounded-[16px] border border-line/90 bg-paper/92 p-2 shadow-[0_20px_60px_-46px_rgba(7,9,42,.7)]",
  catalogTitle:
    "mb-1 flex items-center justify-between px-2.5 py-2 text-[11.5px] font-bold uppercase text-muted",
  catalogTitleText: "inline-flex min-w-0 items-center gap-2",
  catalogTotal: "grid h-5 min-w-5 place-items-center rounded-full bg-cream-deep px-1.5 text-[11px] font-bold text-muted",
  catHead:
    "group relative flex w-full items-center gap-2 rounded-[11px] border border-transparent py-2.5 pl-3 pr-1 text-left " +
    "text-[14px] font-semibold text-ink transition-colors focus-visible:!outline-none " +
    "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-transparent " +
    "hover:bg-cream/80",
  catHeadActive: "!border-line/90 !bg-cream before:!bg-terra",
  catHeadMain:
    "flex min-w-0 flex-1 items-center gap-2.5 rounded-l-[10px] py-2.5 pl-3 pr-1 text-[14px] font-semibold text-ink " +
    "focus-visible:!outline-none",
  catHeadMainActive: "!text-terra-deep",
  catDot: "h-1.5 w-1.5 shrink-0 rounded-full",
  catLabel: "min-w-0 flex-1 truncate text-left",
  catCount: "shrink-0 rounded-full bg-ink/[.06] px-2 text-[11px] font-bold leading-[20px] text-muted",
  catChevBtn: "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted",
  catChev: "h-3.5 w-3.5 transition-transform duration-200",
  catChevOpen: "rotate-90",
  catChildren: "mb-1 ml-[17px] mt-0.5 flex flex-col gap-0.5 border-l border-line pl-3",
  catChild:
    "flex items-center gap-2 rounded-[9px] px-3 py-1.5 text-[13px] font-medium text-muted " +
    "transition-colors hover:bg-cream hover:text-ink focus-visible:!outline-none",
  catChildActive: "!bg-terra/10 !font-semibold !text-terra-deep",
  catChildLabel: "min-w-0 flex-1 truncate text-left",

  // Mobil araç çubuğu (arama + kategoriler + filtreler)
  toolbar: "mb-4 hidden grid-cols-2 gap-2.5 max-[1120px]:grid",
  toolbarSearch: "col-span-2 min-w-0 [&>div]:w-full",
  toolBtn:
    "inline-flex h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-line " +
    "bg-paper px-3 text-[13.5px] font-bold text-ink shadow-card transition-colors hover:border-terra",
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

  shell: "grid grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)] items-start gap-5 max-[1120px]:grid-cols-1",
  mapAside: "sticky top-[84px] max-[1120px]:static",
  grid: "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4",
  gridWide: "grid grid-cols-3 gap-5 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1",

  empty: "rounded-[14px] border border-dashed border-line bg-paper px-6 py-14 text-center",
  emptyTitle: "mb-2 text-[22px]",
  emptyText: "mb-4 text-[14.5px] text-muted",

  pagination: "mt-7 flex justify-center gap-2",
  pageBtn:
    "grid h-9 min-w-9 place-items-center rounded-[9px] border border-line bg-paper px-2 text-[14px] " +
    "font-semibold text-ink transition-colors hover:border-terra disabled:opacity-40 disabled:hover:border-line",
  pageBtnActive: "!border-terra !bg-terra !text-white",
} as const;

export default styles;

/* ListingView — Tailwind sınıf token'ları (filtreleme + düzen).
   Kart görünümü SupplierCard'da; burada yalnız filtre/sonuç/harita düzeni. */
const styles= {
  head:
    "mb-4 max-[1120px]:mb-3 max-[640px]:mb-2.5",
  title: "font-body text-[28px] font-semibold leading-tight tracking-normal text-ink max-[640px]:text-[23px]",
  sub: "mt-1.5 text-[14.5px] font-normal leading-6 text-[#4b5875] max-[640px]:mt-1 max-[640px]:text-[13.5px] max-[640px]:leading-5",

  bar:
    "sticky top-[86px] z-40 grid grid-cols-[minmax(320px,1.8fr)_minmax(130px,.75fr)_minmax(130px,.75fr)_minmax(130px,.75fr)_minmax(146px,.8fr)] " +
    "items-center gap-2.5 rounded-[10px] border border-line bg-paper/95 p-2.5 shadow-card backdrop-blur-xl " +
    "max-[1280px]:grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(132px,1fr))]",
  field: "field h-[44px]",
  selectWrap: "relative block min-w-0",
  selectControl:
    "w-full appearance-none !rounded-[8px] !border-line !bg-white !pl-3.5 !pr-9 text-[14px] font-medium " +
    "text-ink shadow-none hover:!border-terra/45 focus:!border-terra",
  selectChevron: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70",
  selectField: "w-full",
  barSearch: "min-w-0 [&>div]:w-full [&_input]:w-full",

  acWrap: "relative min-w-0",
  acIconBtn: "field grid h-[44px] w-[44px] shrink-0 place-items-center !px-0 text-muted transition-colors hover:border-terra hover:text-ink",
  acInput:
    "field h-[44px] w-full !rounded-[8px] !border-line !bg-white pl-10 text-[14.5px] font-normal " +
    "!text-ink shadow-none placeholder:font-medium placeholder:text-[#3f4b67] hover:!border-terra/45 " +
    "max-[1120px]:h-[42px] max-[640px]:h-[40px] max-[640px]:rounded-[8px] max-[640px]:pl-9 max-[640px]:text-[14px]",
  acSearchIcon: "pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#3f4b67] max-[640px]:left-3 max-[640px]:h-4 max-[640px]:w-4",
  acPanel:
    "absolute left-0 right-0 z-30 mt-1.5 overflow-hidden rounded-[12px] border border-line bg-paper " +
    "shadow-[0_24px_60px_-24px_rgba(7,9,42,.45)]",
  acGroup: "px-3 pb-1 pt-2.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink",
  acItem: "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-[13.5px] text-ink",
  acItemActive: "bg-terra/10",
  acItemMain: "min-w-0 flex-1 truncate font-medium",
  acItemSub: "shrink-0 text-[12px] font-medium text-muted",
  acDot: "h-2 w-2 shrink-0 rounded-full",
  acIcon: "h-4 w-4 shrink-0 text-[#0b102f]",
  acEmpty: "px-3 py-3 text-[13px] text-muted",

  toggle:
    "inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] border border-line bg-white px-4 " +
    "text-[13.5px] font-medium text-ink shadow-none transition-all hover:border-terra/45 max-[640px]:shrink-0",
  toggleActive: "!border-terra !bg-terra !text-white",
  toggleBox: "grid h-4 w-4 place-items-center rounded-full border-[1.5px] border-current text-white",

  active: "mt-3 flex flex-wrap items-center gap-2",
  activeLabel: "text-[12.5px] font-semibold text-[#4b5875]",
  tag:
    "inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-terra/30 bg-terra/10 " +
    "px-2.5 py-1 text-[12.5px] font-semibold text-terra-deep transition-colors hover:bg-terra/20",
  tagX: "text-[14px] leading-none opacity-70",
  clearTag:
    "rounded-pill border-[1.5px] border-[#9fb1d8] bg-white px-2.5 py-1 text-[12.5px] " +
    "font-bold text-[#0b102f] transition-colors hover:border-terra hover:text-terra-deep",

  // Hizmet/koşul facet paneli (sol kenar — filtreleme motoru)
  facetWrap: "mt-3 flex flex-col rounded-[14px] border border-line bg-paper p-2 shadow-card",
  // Kategori kartının içine gömülü (aynı stack) hâli — kart yok, sadece bölüm
  facetBare: "mt-0 flex flex-col pt-0",
  facetHead: "hidden",
  facetHeadIcon: "h-[18px] w-[18px] text-terra",
  facetCollapse:
    "flex min-w-0 flex-1 items-center justify-between gap-2 text-left text-[14px] font-bold text-ink transition-colors hover:text-terra-deep",
  facetChevron: "h-4 w-4 shrink-0 text-terra transition-transform duration-200",
  facetChevronOpen: "rotate-180",
  facetClear:
    "rounded-pill border border-line bg-paper px-2 py-0.5 text-[11px] font-semibold normal-case " +
    "text-muted transition-colors hover:border-terra hover:text-terra-deep",
  facetGroups: "flex flex-col pb-0 pt-0",
  facetRow: "flex flex-col border-b border-[#e1e5ee] last:border-b-0",
  facetRowHead: "flex min-h-[44px] items-center justify-between gap-2 px-0 py-2",
  facetRowToggle:
    "flex min-w-0 flex-1 items-center justify-between gap-2 text-left !text-[14px] !leading-5 transition-colors hover:text-terra-deep",
  facetRowLabel: "!text-[14px] !leading-5 font-semibold tracking-normal text-[#20263a]",
  facetChips: "flex flex-wrap items-center gap-2",
  facetChip:
    "inline-flex cursor-pointer select-none items-center rounded-pill border-[1.5px] border-line bg-paper px-3.5 py-1.5 " +
    "text-[13.5px] font-medium text-ink transition-colors hover:border-terra",
  facetChipActive: "!border-terra !bg-terra/10 !text-terra-deep",
  // Checkbox listesi (chip yerine)
  facetCheckList: "flex flex-col pb-2",
  facetCheck:
    "flex h-[25px] cursor-pointer select-none items-center gap-2.5 rounded-none px-0 text-[14px] font-medium text-[#444444] hover:text-[#0f3bb0]",
  facetCheckActive: "text-terra-deep",
  facetCheckbox: "h-[17px] w-[17px] shrink-0 accent-terra",

  resultsBar:
    "mb-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-line bg-paper px-4 py-3 shadow-card " +
    "max-[1120px]:mb-3 max-[1120px]:mt-3 max-[1120px]:gap-2 max-[640px]:mb-2.5 max-[640px]:mt-2.5 max-[640px]:px-3 max-[640px]:py-2.5",
  count: "text-[14px] font-semibold text-[#4b5875]",
  countStrong: "text-ink",
  barRight: "flex items-center gap-3 max-[560px]:w-full max-[560px]:justify-between max-[560px]:gap-2",
  viewToggle: "inline-flex items-center gap-1 rounded-[8px] border border-line bg-cream/80 p-1 max-[640px]:p-0.5",
  viewBtn:
    "inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[13px] font-semibold text-[#0b102f] transition-colors hover:bg-white hover:text-terra-deep max-[640px]:gap-1 max-[640px]:px-2.5 max-[640px]:py-1.5 max-[640px]:text-[12px]",
  viewBtnActive: "!bg-terra !text-white shadow-card hover:!text-white",
  viewIcon: "h-3.5 w-3.5",
  sortWrap: "flex items-center gap-2.5",
  sortLabel: "text-[13px] font-medium text-[#4b5875] max-[560px]:hidden",
  sortSelectWrap: "relative inline-flex w-[106px] max-[640px]:w-[98px]",
  sortSelect:
    "h-auto w-full appearance-none rounded-[8px] border border-line bg-paper py-[7px] pl-2.5 pr-7 text-[13px] font-semibold focus:border-terra focus:outline-none max-[640px]:py-1.5 max-[640px]:text-[12px]",
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
  catalogAside: "sticky top-[92px] z-20 self-start h-[calc(100dvh-112px)] overflow-y-auto overscroll-contain pr-1 max-[1120px]:hidden",

  catalog:
    "flex flex-col rounded-[10px] border border-line bg-paper px-3 py-2 shadow-card",
  catalogTitle:
    "mb-0 flex min-h-[44px] items-center justify-between border-b border-[#e1e5ee] py-2 !text-[14px] font-semibold normal-case tracking-normal text-[#333333]",
  catalogTitleText: "inline-flex min-w-0 items-center gap-2",
  catalogTotal: "grid h-5 min-w-5 place-items-center rounded-full bg-cream-deep px-1.5 text-[11px] font-bold text-muted",
  catalogCollapse:
    "flex min-w-0 flex-1 items-center justify-between gap-2 text-left !text-[14px] !leading-5 font-semibold text-[#333333] transition-colors hover:text-terra-deep",
  catalogChevron: "h-4 w-4 shrink-0 text-terra transition-transform duration-200",
  catalogChevronOpen: "rotate-180",
  catalogSearch:
    "my-2 h-[34px] w-full rounded-[7px] border border-[#d8dce5] bg-[#fafafa] px-2.5 text-[13px] font-medium text-[#333333] " +
    "placeholder:text-[#6b6b6b] focus:border-[#0f3bb0] focus:bg-white focus:outline-none",
  catList: "flex flex-col",
  catBlock: "",
  catHead:
    "group relative flex h-[25px] w-full items-center gap-2.5 rounded-none border-0 bg-transparent px-0 text-left " +
    "text-[14px] font-medium text-[#333333] transition-colors focus-visible:!outline-none " +
    "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-transparent " +
    "hover:text-[#0f3bb0]",
  catHeadActive: "!bg-transparent !text-[#0f3bb0] before:!bg-transparent",
  catHeadMain:
    "flex min-w-0 flex-1 items-center gap-2.5 rounded-l-[10px] py-2.5 pl-3 pr-1 text-[14px] font-semibold text-ink " +
    "focus-visible:!outline-none",
  catHeadMainActive: "!text-terra-deep",
  catDot: "h-1.5 w-1.5 shrink-0 rounded-full",
  catLabel: "min-w-0 flex-1 truncate text-left",
  catCheckbox:
    "grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[5px] border-2 border-[#d2d2d2] bg-white transition-colors " +
    "after:hidden after:h-[10px] after:w-[6px] after:rotate-45 after:border-b-2 after:border-r-2 after:border-white after:content-['']",
  catCheckboxActive: "!border-[#0f3bb0] !bg-[#0f3bb0] after:block",
  catCount: "shrink-0 rounded-full bg-[#dfe7fb] px-2 text-[11px] font-bold leading-[20px] text-[#24304a]",
  catChevBtn: "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#4b5875]",
  catChev: "h-3.5 w-3.5 transition-transform duration-200",
  catChevOpen: "rotate-90",
  catChildren: "mb-2 ml-[18px] mt-1 flex flex-col pl-3",
  catChild:
    "flex h-[25px] items-center gap-2.5 rounded-none px-0 text-[14px] font-medium text-[#444444] " +
    "transition-colors hover:text-[#0f3bb0] focus-visible:!outline-none",
  catChildActive: "!border-[#0f3bb0] !font-semibold !text-terra-deep",
  catChildLabel: "min-w-0 flex-1 truncate text-left",

  // Mobil araç çubuğu (arama + kategoriler + filtreler)
  toolbar: "mb-4 hidden grid-cols-2 gap-2.5 max-[1120px]:grid max-[640px]:mb-2.5 max-[640px]:gap-2",
  toolbarSearch: "col-span-2 min-w-0 [&>div]:w-full max-[640px]:hidden",
  toolBtn:
    "inline-flex h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] border border-line " +
    "bg-paper px-3 text-[13.5px] font-semibold text-ink shadow-card transition-colors hover:border-terra " +
    "max-[640px]:h-[38px] max-[640px]:gap-1.5 max-[640px]:text-[12.5px] max-[640px]:shadow-none",
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

  // Hibrit erişim bandı (misafir kullanıcı — toplu kartlar kapalı, yalnız sayı açık)
  gate:
    "mb-4 flex flex-wrap items-center gap-3 rounded-[14px] border border-terra/25 " +
    "bg-[linear-gradient(135deg,rgba(255,255,255,.9),rgba(231,236,255,.6))] px-4 py-3 " +
    "shadow-[0_18px_54px_-48px_rgba(7,9,42,.72)]",
  gateBadge: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-terra/12 text-terra-deep",
  gateBody: "min-w-[200px] flex-1",
  gateTitle: "text-[15px] font-extrabold text-ink",
  gateText: "mt-0.5 text-[13px] text-muted",
  gateActions: "flex shrink-0 flex-wrap items-center gap-2",

  // Misafir bilgilendirme şeridi (yalnız dopingli/premium işletmeler gösterilir)
  guestBanner:
    "mb-4 flex flex-wrap items-center gap-3 rounded-[14px] border border-terra/25 " +
    "bg-[linear-gradient(135deg,rgba(255,255,255,.9),rgba(231,236,255,.6))] px-4 py-3 " +
    "shadow-[0_18px_54px_-48px_rgba(7,9,42,.72)]",
  guestBannerIcon: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terra/12 text-terra-deep",
  guestBannerText: "min-w-[200px] flex-1",
  guestBannerTitle: "text-[14.5px] font-extrabold text-ink",
  guestBannerSub: "mt-0.5 text-[13px] text-muted",
  guestBannerActions: "flex shrink-0 flex-wrap items-center gap-2",
  lockedShell:
    "relative min-h-[460px] overflow-hidden rounded-[18px] border border-line bg-[#f8faff] shadow-[0_22px_70px_-54px_rgba(7,9,42,.8)]",
  lockedPreview:
    "grid grid-cols-3 gap-5 p-5 saturate-[.9] opacity-100 select-none pointer-events-none " +
    "max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1",
  lockedPreviewCard:
    "overflow-hidden rounded-[14px] border border-[#d9e0ef] bg-white shadow-[0_18px_42px_-28px_rgba(7,9,42,.48)]",
  lockedPreviewMedia:
    "h-[152px] bg-[linear-gradient(135deg,rgba(15,59,176,.34),rgba(142,162,255,.42),rgba(226,232,255,.86))]",
  lockedPreviewBody: "space-y-3 p-4 blur-[3px]",
  lockedPreviewLineWide: "block h-4 w-4/5 rounded-full bg-ink/36",
  lockedPreviewLine: "block h-3 w-2/3 rounded-full bg-ink/24",
  lockedPreviewLineShort: "block h-3 w-1/2 rounded-full bg-ink/20",
  lockedPreviewActions: "flex gap-2 pt-2 [&>span]:h-9 [&>span]:flex-1 [&>span]:rounded-[10px] [&>span]:bg-sapphire/30",
  lockedOverlay:
    "absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,rgba(248,250,255,.78)_0%,rgba(248,250,255,.52)_42%,rgba(248,250,255,.2)_100%)] px-6 py-10 text-center",
  lockedIcon: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[16px] bg-cream-deep text-terra-deep",
  lockedEyebrow: "eyebrow mb-2 text-terra-deep",
  lockedTitle: "max-w-[560px] text-[30px] font-extrabold leading-[1.12] text-ink max-[560px]:text-[24px]",
  lockedText: "mt-3 max-w-[560px] text-[15px] leading-7 text-muted",
  lockedActions: "mt-5 flex flex-wrap justify-center gap-2.5",
  lockedPanel:
    "w-full max-w-[560px] rounded-[18px] border border-white/80 bg-white/88 px-6 py-7 text-center shadow-[0_28px_80px_-34px_rgba(7,9,42,.58)] backdrop-blur-md",

  // Kelime araması için "önce ülke seç" ekranı
  countryAsk:
    "flex flex-col items-center rounded-[18px] border border-line bg-[linear-gradient(160deg,rgba(255,255,255,.96),rgba(231,236,255,.5))] " +
    "px-6 py-14 text-center shadow-[0_24px_70px_-50px_rgba(7,9,42,.7)]",
  countryAskIcon: "mb-4 grid h-12 w-12 place-items-center rounded-full bg-terra/12 text-terra-deep",
  countryAskTitle: "heading-section text-[22px] text-ink",
  countryAskText: "mt-1.5 max-w-[440px] text-[14.5px] text-muted",
  countryAskChips: "mt-5 flex flex-wrap items-center justify-center gap-2",
  countryChip:
    "inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-line bg-paper px-4 py-2 text-[13.5px] font-bold text-ink " +
    "transition-all hover:-translate-y-px hover:border-terra hover:text-terra-deep hover:shadow-[0_12px_28px_-24px_rgba(7,9,42,.7)]",

  empty: "rounded-[14px] border border-dashed border-line bg-paper px-6 py-14 text-center",
  emptyTitle: "mb-2 text-[22px]",
  emptyText: "mb-4 text-[14.5px] text-muted",

  loadMoreWrap: "mt-7 flex flex-col items-center gap-3 rounded-[10px] border border-line bg-paper px-4 py-5 shadow-card max-[640px]:mt-5",
  loadMoreText: "text-[13px] font-medium text-[#4b5875]",
  loadMoreBtn:
    "inline-flex h-11 min-w-[172px] items-center justify-center rounded-[11px] bg-sapphire px-5 text-[14px] " +
    "font-semibold text-paper shadow-[0_16px_34px_-22px_rgba(15,59,176,.9)] transition-colors hover:bg-sapphire-deep disabled:cursor-wait disabled:opacity-65",
  pagination: "mt-7 flex justify-center gap-2",
  pageBtn:
    "grid h-9 min-w-9 place-items-center rounded-[9px] border border-line bg-paper px-2 text-[14px] " +
    "font-semibold text-ink transition-colors hover:border-terra disabled:opacity-40 disabled:hover:border-line",
  pageBtnActive: "!border-terra !bg-terra !text-white",
} as const;

export default styles;

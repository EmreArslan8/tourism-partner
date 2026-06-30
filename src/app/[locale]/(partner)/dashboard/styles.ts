const styles = {
  main: "min-h-screen bg-cream text-ink min-[1040px]:grid min-[1040px]:grid-cols-[228px_minmax(0,1fr)]",
  sidebar:
    "border-b border-line bg-paper text-ink min-[1040px]:sticky min-[1040px]:top-0 min-[1040px]:h-screen min-[1040px]:border-b-0 min-[1040px]:border-r min-[1040px]:border-line",
  brandMark:
    "flex h-[77px] items-center border-b border-line px-4 text-ink",
  logoImg: "h-11 w-auto max-w-[154px] object-contain",
  brandIcon:
    "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-sapphire font-body text-dashboard-caption font-semibold tracking-normal text-white shadow-card",
  sideNav:
    "mt-4 grid gap-1 px-4 font-body text-dashboard-nav font-medium tracking-normal min-[1040px]:mt-5 [&>a]:flex [&>a]:items-center [&>a]:gap-2.5 [&>a]:rounded-[9px] [&>a]:px-3 [&>a]:py-2.5 [&>a]:text-muted [&>a]:transition-colors hover:[&>a]:bg-cream hover:[&>a]:text-brand",
  sideNavActive: "bg-cream !text-brand shadow-[inset_3px_0_0_theme(colors.sapphire)]",
  sidebarFoot:
    "mt-5 rounded-[10px] border border-line bg-cream p-3 text-[11.5px] text-muted min-[1040px]:absolute min-[1040px]:bottom-4 min-[1040px]:left-4 min-[1040px]:right-4 [&>b]:mt-1 [&>b]:block [&>b]:truncate [&>b]:text-[12.5px] [&>b]:text-ink",
  workspace: "min-w-0",
  content: "mx-auto w-full max-w-[1240px] px-5 pb-12 pt-5 min-[760px]:px-7 min-[1040px]:px-9",
  topbar:
    "sticky top-0 z-20 flex h-[77px] items-center justify-between gap-3 border-b border-line bg-cream/92 px-5 py-0 backdrop-blur min-[760px]:px-7 min-[1040px]:px-9",
  header: "mb-5 flex flex-wrap items-center justify-between gap-3",
  title: "font-body text-dashboard-title font-semibold tracking-normal text-ink",
  email: "mt-1 text-[14px] text-muted",
  actions: "flex items-center gap-2",
  hero:
    "mb-4 grid gap-4 rounded-[18px] border border-line bg-paper p-5 shadow-card min-[760px]:grid-cols-[minmax(0,1fr)_220px]",
  eyebrow: "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.1em] text-terra",
  heroTitle: "mt-2 text-[28px] leading-tight text-pine",
  heroText: "mt-2 max-w-[680px] text-[14px] text-muted",
  quickActions: "mt-4 flex flex-wrap gap-2",
  statusBox: "grid content-center gap-2 rounded-2xl border border-line bg-cream p-4",
  statusLabel: "text-[11px] font-bold uppercase tracking-[.08em] text-muted",
  statusBadge: "w-fit rounded-[999px] px-3 py-1 text-[12px] font-bold",
  statusColors: {
    approved: "bg-group-acente/15 text-group-acente",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-gold/20 text-brand",
  },
  verified: "w-fit rounded-[999px] bg-white px-3 py-1 text-[12px] font-bold text-group-acente",
  notice:
    "mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-[13.5px] text-brand [&>b]:font-bold",
  noticeDanger:
    "border-red-200 bg-red-50 text-red-700",
  statsGrid: "mb-5 grid gap-3 min-[720px]:grid-cols-3",
  metricCard:
    "rounded-[16px] border border-line bg-paper p-4 shadow-card [&>small]:mt-1 [&>small]:block [&>small]:text-[12.5px] [&>small]:text-muted [&>span]:text-[11px] [&>span]:font-bold [&>span]:uppercase [&>span]:tracking-[.08em] [&>span]:text-muted [&>strong]:mt-2 [&>strong]:block [&>strong]:text-[28px] [&>strong]:leading-none [&>strong]:text-pine",
  grid: "grid grid-cols-[minmax(0,1fr)_380px] items-start gap-5 max-[980px]:grid-cols-1",
  overviewSection: "min-w-0",
  overviewStack: "grid gap-4",
  overviewHero:
    "grid items-end gap-4 rounded-[14px] border border-line bg-paper p-5 shadow-card min-[820px]:grid-cols-[minmax(0,1fr)_220px] [&_h2]:mt-2 [&_h2]:font-body [&_h2]:text-dashboard-title [&_h2]:font-semibold [&_h2]:tracking-normal [&_h2]:text-ink [&_p]:mt-2 [&_p]:max-w-[680px] [&_p]:text-form-control [&_p]:text-muted",
  overviewStatus:
    "grid justify-start gap-2 rounded-[10px] border border-line bg-cream px-4 py-3 min-[820px]:justify-self-end [&>span]:font-body [&>span]:text-dashboard-caption [&>span]:font-semibold [&>span]:uppercase [&>span]:tracking-[.06em] [&>span]:text-muted",
  overviewGrid: "grid gap-4 min-[980px]:grid-cols-[minmax(0,1fr)_340px]",
  overviewListingCard:
    "grid min-w-0 gap-4 overflow-hidden rounded-[14px] border border-line bg-paper p-4 shadow-card min-[760px]:grid-cols-[240px_minmax(0,1fr)]",
  overviewCover:
    "grid h-[180px] place-items-center overflow-hidden rounded-[10px] border border-line bg-cream text-center text-form-label font-medium text-muted",
  overviewListingBody:
    "min-w-0 self-center [&>h3]:mt-2 [&>h3]:max-w-[18ch] [&>h3]:font-body [&>h3]:text-[28px] [&>h3]:font-semibold [&>h3]:leading-[1.1] [&>h3]:tracking-normal [&>h3]:text-ink [&>p]:mt-2 [&>p]:max-w-[34ch] [&>p]:text-form-control [&>p]:text-muted",
  overviewProgress:
    "mt-4 flex max-w-[360px] items-center justify-between rounded-[10px] border border-line bg-cream px-3 py-2 font-body text-form-label text-muted [&>b]:text-ink",
  overviewSide: "grid gap-4 content-start",
  homeGrid: "grid gap-3 min-[860px]:grid-cols-[minmax(0,1.35fr)_minmax(220px,.7fr)_minmax(220px,.7fr)]",
  homeCard:
    "grid content-start gap-3 rounded-[14px] border border-line bg-paper p-4 shadow-card [&>p]:text-form-control [&>p]:text-muted",
  homeCardHead:
    "flex min-h-7 flex-wrap items-center justify-between gap-2 font-body text-dashboard-caption font-semibold uppercase tracking-[.06em] text-muted",
  homeListing: "grid gap-3 min-[620px]:grid-cols-[132px_minmax(0,1fr)] [&_h3]:text-[22px] [&_h3]:leading-tight [&_h3]:text-ink [&_p]:mt-1 [&_p]:text-[13.5px] [&_p]:text-muted",
  homeCover:
    "grid aspect-[4/3] min-h-[98px] place-items-center overflow-hidden rounded-[8px] border border-line bg-cream text-center text-[12px] font-bold text-muted",
  homeNumber: "block text-[32px] leading-none text-pine",
  editGrid: "!block",
  sideStack: "grid gap-5",
  section: "rounded-[18px] border border-line bg-paper p-5 shadow-card",
  editSection: "mx-auto max-w-[920px] rounded-[12px] p-5 min-[760px]:p-6",
  sectionTitle: "font-body text-dashboard-section font-semibold tracking-normal text-ink",
  sectionSub: "mb-4 mt-1 text-[13.5px] text-muted",
  editIntro: "mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4",
  form: "flex flex-col gap-4",
  formSection: "rounded-[10px] border border-line bg-cream p-4",
  formSectionTitle: "mb-3 font-body text-form-section font-semibold tracking-normal text-ink/90",
  formActions: "sticky bottom-0 z-10 -mx-5 -mb-5 flex justify-end gap-2 border-t border-line bg-paper/95 px-5 py-4 backdrop-blur min-[760px]:-mx-6 min-[760px]:-mb-6 min-[760px]:px-6",
  fieldCls:
    "field h-[44px] rounded-[8px] border-line bg-white px-3.5 font-body text-form-control font-normal tracking-normal text-ink placeholder:text-muted/45",
  labelCls: "flex flex-col gap-1.5 font-body text-form-label font-medium normal-case tracking-normal text-ink/75",
  photoWrap: "flex flex-col gap-2",
  photoList: "flex flex-wrap gap-2.5",
  photoBtn:
    "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-line bg-cream text-[12px] text-muted hover:border-terra",
  photoBadge: "absolute bottom-0 left-0 right-0 bg-ink/60 py-1 text-center text-[10px] font-bold text-white",
  photoItem: "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-line",
  photoDelete:
    "absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-[13px] font-bold text-white hover:bg-red-600",
  photoAdd:
    "grid h-[92px] w-[128px] place-items-center rounded-[8px] border border-dashed border-line bg-cream text-[12px] font-bold text-muted hover:border-terra",
  threeCol: "grid grid-cols-3 gap-3 max-[620px]:grid-cols-1",
  twoCol: "grid grid-cols-2 gap-3 max-[620px]:grid-cols-1",
  textarea:
    "field min-h-[108px] rounded-[8px] border-line bg-white px-3.5 py-2.5 font-body text-form-control font-normal tracking-normal text-ink placeholder:text-muted/45",
  checklist: "flex flex-col gap-3",
  checkGroup: "mb-2 font-body text-[13.5px] font-medium tracking-normal text-ink/80",
  checkList: "flex flex-wrap gap-1.5",
  checkLabel:
    "flex cursor-pointer items-center gap-1.5 rounded-[999px] border border-line px-3 py-1.5 text-[12.5px] has-[:checked]:border-terra has-[:checked]:bg-terra/10",
  guideBox:
    "rounded-2xl border border-line bg-cream p-4 [&>h3]:text-[15px] [&>h3]:font-bold [&>p]:mt-1 [&>p]:text-[13px] [&>p]:text-muted",
  guideTags: "mt-3 flex flex-wrap gap-1.5 [&>span]:rounded-[999px] [&>span]:border [&>span]:border-line [&>span]:bg-paper [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[12.5px] [&>span]:font-bold",
  // Kategori-bazlı dinamik alanlar + evrak
  dynBox: "rounded-[10px] border border-line bg-cream p-4",
  dynGrid: "mt-2.5 grid grid-cols-2 gap-3 max-[620px]:grid-cols-1",
  dynHint: "font-normal normal-case tracking-normal text-muted/65",
  docList: "mt-3 flex flex-col gap-2",
  docRow: "flex items-center justify-between gap-3 rounded-[8px] border border-line bg-paper px-3 py-2.5",
  docInfo: "flex min-w-0 flex-col gap-0.5",
  docLabel: "font-body text-[13.5px] font-medium tracking-normal text-ink/85",
  docReq: "not-italic text-red-600",
  docFile: "truncate text-[12px] font-medium text-terra hover:underline",
  docActions: "flex shrink-0 items-center gap-1.5",
  docDelete: "grid h-7 w-7 place-items-center rounded-[7px] border border-line text-[16px] leading-none text-muted hover:border-red-400 hover:text-red-600",
  error: "text-[13px] font-bold text-red-600",
  success: "text-[13px] font-bold text-group-acente",
  workflowList: "grid gap-2",
  workflowItem:
    "grid grid-cols-[10px_minmax(0,1fr)] gap-2 rounded-[8px] border border-line bg-cream p-3 text-[13.5px] text-ink/85 [&>span]:mt-1.5 [&>span]:h-2 [&>span]:w-2 [&>span]:rounded-full [&>span]:bg-terra",
  membershipBox:
    "grid gap-1 rounded-2xl border border-line bg-cream p-4 [&>b]:text-[24px] [&>b]:text-pine [&>small]:text-[12.5px] [&>small]:text-muted [&>span]:text-[11px] [&>span]:font-bold [&>span]:uppercase [&>span]:tracking-[.08em] [&>span]:text-muted",
  listingDashboard: "grid gap-4",
  listingHead: "flex flex-wrap items-start justify-between gap-3",
  listingSummary: "grid gap-4 rounded-[12px] border border-line bg-cream p-3 min-[680px]:grid-cols-[180px_minmax(0,1fr)]",
  listingCover: "grid aspect-[4/3] min-h-[128px] place-items-center overflow-hidden rounded-[8px] border border-line bg-paper text-center text-[12px] font-bold text-muted",
  listingInfo: "min-w-0 self-center [&>h3]:mt-1 [&>h3]:truncate [&>h3]:text-[24px] [&>h3]:leading-tight [&>h3]:text-ink [&>p]:mt-1 [&>p]:text-[13.5px] [&>p]:text-muted",
  listingChips: "mt-3 flex flex-wrap gap-2 [&>span]:rounded-[999px] [&>span]:border [&>span]:border-line [&>span]:bg-paper [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[12px] [&>span]:font-bold [&>span]:text-ink/80",
  listingNext: "grid gap-1 rounded-[10px] border border-line bg-paper px-4 py-3 text-[13.5px] text-muted [&>b]:text-[14px] [&>b]:text-ink",
  listingActions: "flex flex-wrap gap-2",
  requestBoard: "grid gap-3",
  quoteList: "flex max-h-[520px] flex-col gap-3 overflow-auto pr-1",
  quoteItem: "rounded-[8px] border border-line bg-cream p-3.5",
  quoteHead: "flex items-center justify-between gap-2",
  quoteName: "truncate text-[14px] font-bold",
  quoteDate: "shrink-0 text-[11.5px] text-muted",
  quoteMeta: "mt-1 text-[12.5px] text-muted",
  quoteSvc: "mt-1.5 text-[12.5px] font-bold text-ink",
  quoteMsg: "mt-1.5 line-clamp-4 text-[13px] text-ink/80",
  emptyQuotes:
    "rounded-[8px] border border-dashed border-line bg-cream px-4 py-6 text-center text-[13.5px] text-muted",
} as const;

export default styles;

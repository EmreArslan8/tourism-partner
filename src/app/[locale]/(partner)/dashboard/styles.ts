import { panelUi } from "@/components/workspace-ui";

const styles = {
  main: `${panelUi.shell} min-[1040px]:grid min-[1040px]:grid-cols-[264px_minmax(0,1fr)]`,
  sidebar:
    "border-b border-line bg-paper/90 text-ink min-[1040px]:sticky min-[1040px]:top-0 min-[1040px]:h-screen min-[1040px]:border-b-0 min-[1040px]:border-r min-[1040px]:border-line",
  brandMark:
    "flex h-[92px] items-center border-b border-line/80 px-6 text-ink",
  logoImg: "h-[42px] w-auto max-w-[165px] object-contain",
  brandIcon:
    "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-sapphire font-body text-dashboard-caption font-semibold tracking-normal text-paper shadow-card",
  sideNav:
    "mt-4 grid gap-1 px-4 font-body text-dashboard-nav font-medium tracking-normal min-[1040px]:mt-5 [&>a]:flex [&>a]:items-center [&>a]:gap-2.5 [&>a]:rounded-[8px] [&>a]:px-3 [&>a]:py-2.5 [&>a]:text-muted [&>a]:transition-colors hover:[&>a]:bg-cream/70 hover:[&>a]:text-brand",
  sideNavActive: "bg-cream !text-brand",
  sidebarFoot:
    "mt-5 rounded-[10px] border border-line bg-cream/45 p-3 text-[11.5px] text-muted min-[1040px]:absolute min-[1040px]:bottom-4 min-[1040px]:left-4 min-[1040px]:right-4 [&>b]:mt-1 [&>b]:block [&>b]:truncate [&>b]:text-[12.5px] [&>b]:font-medium [&>b]:text-ink",
  workspace: "min-w-0",
  content: `${panelUi.page} px-5 pb-12 pt-7 min-[760px]:px-7 min-[1040px]:px-9`,
  topbar:
    "sticky top-0 z-20 border-b border-line bg-paper/94 px-5 py-4 shadow-card backdrop-blur min-[760px]:px-7 min-[1040px]:px-9",
  topbarInner:
    `${panelUi.page} flex min-h-[56px] items-center justify-between gap-4`,
  topbarText: "min-w-0",
  header: "mb-5 flex flex-wrap items-center justify-between gap-3",
  title: "truncate font-body text-[24px] font-medium leading-tight tracking-normal text-ink min-[760px]:text-[28px]",
  email: "mt-1 truncate text-[13.5px] font-normal leading-5 text-muted",
  actions: "flex shrink-0 flex-wrap items-center justify-end gap-2",
  pageEyebrow: panelUi.eyebrow,
  pageTitle: "text-[34px] font-medium leading-tight tracking-[0] text-ink",
  pageDesc: "mt-2 max-w-[760px] text-[14px] font-normal leading-6 text-muted",
  panel: `${panelUi.panel} p-5`,
  softPanel: "rounded-[10px] border border-line bg-cream/45 p-3.5",
  emptyPanel: "rounded-[10px] border border-dashed border-line bg-paper px-6 py-14 text-center",
  primaryButton: panelUi.primaryButton,
  secondaryButton: panelUi.secondaryButton,
  compactPrimaryButton: `${panelUi.primaryButton} h-9 px-3.5`,
  compactSecondaryButton: `${panelUi.secondaryButton} h-9 px-3.5`,
  hero:
    `mb-4 grid gap-4 ${panelUi.hero} min-[760px]:grid-cols-[minmax(0,1fr)_220px]`,
  eyebrow: `inline-flex items-center gap-1.5 ${panelUi.eyebrow}`,
  heroTitle: "mt-2 text-[30px] font-medium leading-tight tracking-[0] text-ink",
  heroText: "mt-2 max-w-[680px] text-[14px] font-normal leading-6 text-muted",
  quickActions: "mt-4 flex flex-wrap gap-2",
  statusBox: "grid content-center gap-2 rounded-[10px] border border-line bg-paper/80 p-4",
  statusLabel: "text-[11px] font-medium uppercase tracking-[.08em] text-muted",
  statusBadge: "w-fit rounded-[999px] px-3 py-1 text-[12px] font-medium",
  statusColors: {
    approved: "bg-group-acente/15 text-group-acente",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-gold/20 text-brand",
  },
  verified: "w-fit rounded-[999px] bg-paper px-3 py-1 text-[12px] font-medium text-group-saglik",
  notice:
    "mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-[13.5px] text-brand [&>b]:font-bold",
  noticeDanger:
    "border-red-200 bg-red-50 text-red-700",
  statsGrid: "mb-5 grid gap-3 min-[720px]:grid-cols-3",
  metricCard:
    `${panelUi.metric} [&>small]:mt-2 [&>small]:block [&>small]:text-[12.5px] [&>small]:font-normal [&>small]:text-muted [&>span]:text-[13px] [&>span]:font-normal [&>span]:normal-case [&>span]:tracking-[0] [&>span]:text-muted [&>strong]:mt-1 [&>strong]:block [&>strong]:text-[28px] [&>strong]:font-medium [&>strong]:leading-none [&>strong]:tracking-[0] [&>strong]:text-ink`,
  grid: "grid grid-cols-[minmax(0,1fr)_380px] items-start gap-5 max-[980px]:grid-cols-1",
  overviewSection: "min-w-0",
  overviewStack: "grid gap-4",
  overviewHero:
    `grid items-end gap-5 ${panelUi.hero} min-[820px]:grid-cols-[minmax(0,1fr)_240px] [&_h2]:mt-2 [&_h2]:font-body [&_h2]:text-[32px] [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:tracking-normal [&_h2]:text-ink [&_p]:mt-2 [&_p]:max-w-[720px] [&_p]:text-[14px] [&_p]:leading-6 [&_p]:font-normal [&_p]:text-muted`,
  overviewStatus:
    "grid justify-start gap-2 rounded-[10px] border border-line bg-paper/85 px-4 py-3 min-[820px]:justify-self-end [&>span]:font-body [&>span]:text-[11px] [&>span]:font-medium [&>span]:uppercase [&>span]:tracking-[.06em] [&>span]:text-muted",
  overviewGrid: "grid gap-4 min-[980px]:grid-cols-[minmax(0,1fr)_340px]",
  overviewListingCard:
    `${panelUi.panel} grid min-w-0 items-stretch gap-4 overflow-hidden p-4 min-[760px]:grid-cols-[240px_minmax(0,1fr)]`,
  overviewCover:
    "grid h-full min-h-[200px] place-items-center overflow-hidden rounded-[10px] border border-dashed border-line bg-cream/45 text-center text-[13px] font-medium text-muted transition-colors hover:border-sapphire hover:bg-cream/70",
  overviewListingBody:
    "flex min-w-0 flex-col self-start [&>h3]:mt-1.5 [&>h3]:max-w-[22ch] [&>h3]:font-body [&>h3]:text-[26px] [&>h3]:font-semibold [&>h3]:leading-[1.12] [&>h3]:tracking-normal [&>h3]:text-ink [&>p]:mt-2 [&>p]:max-w-[44ch] [&>p]:text-[14px] [&>p]:leading-6 [&>p]:text-muted",
  overviewProgress: "mt-4 grid max-w-[440px] gap-2",
  overviewProgressHead:
    "flex items-center justify-between text-[12.5px] font-medium text-muted [&>b]:font-semibold [&>b]:text-ink",
  progressTrack: "h-2 w-full overflow-hidden rounded-full bg-line/55",
  progressFill: "h-full rounded-full bg-sapphire transition-[width] duration-500",
  overviewSide: "grid gap-4 content-start",
  homeGrid: "grid gap-3 min-[860px]:grid-cols-[minmax(0,1.35fr)_minmax(220px,.7fr)_minmax(220px,.7fr)]",
  homeCard:
    `${panelUi.panel} grid content-start gap-3 p-4 [&>p]:text-form-control [&>p]:text-muted`,
  homeCardHead:
    "flex min-h-7 flex-wrap items-center justify-between gap-2 font-body text-dashboard-caption font-semibold uppercase tracking-[.06em] text-muted",
  homeListing: "grid gap-3 min-[620px]:grid-cols-[132px_minmax(0,1fr)] [&_h3]:text-[22px] [&_h3]:leading-tight [&_h3]:text-ink [&_p]:mt-1 [&_p]:text-[13.5px] [&_p]:text-muted",
  homeCover:
    "grid aspect-[4/3] min-h-[98px] place-items-center overflow-hidden rounded-[8px] border border-line bg-cream/45 text-center text-[12px] font-bold text-muted",
  homeNumber: "block text-[32px] leading-none text-pine",
  editGrid: "!block",
  sideStack: "grid gap-5",
  section: `${panelUi.panel} p-5`,
  editSection: "max-w-[900px]",
  sectionTitle: "font-body text-dashboard-section font-semibold tracking-normal text-ink",
  sectionSub: "mb-4 mt-1 text-[13.5px] text-muted",
  editIntro: "mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4",
  form: "flex flex-col gap-4",
  formSection: "rounded-[10px] border border-line bg-paper/85 p-4",
  basicFormSection: "rounded-[10px] border border-line bg-paper/85 p-4",
  formSectionTitle: "mb-3 font-body text-form-section font-semibold tracking-normal text-ink/90",
  formActions: "sticky bottom-0 z-10 mt-1 flex justify-end gap-2 border-t border-line bg-panel-bg/92 py-4 backdrop-blur",
  fieldCls:
    `${panelUi.input} h-[44px] px-3.5 font-body text-form-control placeholder:text-muted/50`,
  labelCls: "flex flex-col gap-1.5 font-body text-form-label font-medium normal-case tracking-normal text-ink/75",
  photoWrap: "flex flex-col gap-2",
  photoList: "flex flex-wrap gap-2.5",
  photoBtn:
    "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-line bg-cream/45 text-[12px] text-muted hover:border-sapphire",
  photoBadge: "absolute bottom-0 left-0 right-0 bg-ink/60 py-1 text-center text-[10px] font-bold text-paper",
  photoItem: "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-line",
  photoDelete:
    "absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-[13px] font-bold text-paper hover:bg-red-600",
  photoAdd:
    "grid h-[92px] w-[128px] place-items-center rounded-[8px] border border-dashed border-line bg-cream/45 text-[12px] font-bold text-muted hover:border-sapphire",
  threeCol: "grid grid-cols-3 gap-3 max-[620px]:grid-cols-1",
  twoCol: "grid grid-cols-2 gap-3 max-[620px]:grid-cols-1",
  textarea:
    `${panelUi.input} min-h-[108px] px-3.5 py-2.5 font-body text-form-control placeholder:text-muted/50`,
  checklist: "flex flex-col gap-3",
  checkGroup: "mb-2 font-body text-[13.5px] font-medium tracking-normal text-ink/80",
  checkList: "flex flex-wrap gap-1.5",
  checkLabel:
    "flex cursor-pointer items-center gap-1.5 rounded-[999px] border border-line px-3 py-1.5 text-[12.5px] has-[:checked]:border-sapphire has-[:checked]:bg-cream",
  guideBox:
    "rounded-2xl border border-line bg-cream/45 p-4 [&>h3]:text-[15px] [&>h3]:font-bold [&>p]:mt-1 [&>p]:text-[13px] [&>p]:text-muted",
  guideTags: "mt-3 flex flex-wrap gap-1.5 [&>span]:rounded-[999px] [&>span]:border [&>span]:border-line [&>span]:bg-paper [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[12.5px] [&>span]:font-bold",
  // Kategori-bazlı dinamik alanlar + evrak
  dynBox: "rounded-[10px] border border-line bg-cream/45 p-4",
  dynGrid: "mt-2.5 grid grid-cols-2 gap-3 max-[620px]:grid-cols-1",
  dynHint: "font-normal normal-case tracking-normal text-muted/65",
  docList: "mt-3 flex flex-col gap-2",
  docRow: "flex items-center justify-between gap-3 rounded-[8px] border border-line bg-paper px-3 py-2.5",
  docInfo: "flex min-w-0 flex-col gap-0.5",
  docLabel: "font-body text-[13.5px] font-medium tracking-normal text-ink/85",
  docReq: "not-italic text-red-600",
  docFile: "truncate text-[12px] font-medium text-brand hover:underline",
  docActions: "flex shrink-0 items-center gap-1.5",
  docDelete: "grid h-7 w-7 place-items-center rounded-[7px] border border-line text-[16px] leading-none text-muted hover:border-red-400 hover:text-red-600",
  error: "text-[13px] font-bold text-red-600",
  success: "text-[13px] font-bold text-group-acente",
  workflowList: "grid gap-2",
  workflowItem:
    "grid grid-cols-[10px_minmax(0,1fr)] gap-2 rounded-[8px] border border-line bg-cream/45 p-3 text-[13.5px] text-ink/85 [&>span]:mt-1.5 [&>span]:h-2 [&>span]:w-2 [&>span]:rounded-full [&>span]:bg-sapphire",
  membershipBox:
    "grid gap-1 rounded-2xl border border-line bg-cream/45 p-4 [&>b]:text-[24px] [&>b]:text-pine [&>small]:text-[12.5px] [&>small]:text-muted [&>span]:text-[11px] [&>span]:font-bold [&>span]:uppercase [&>span]:tracking-[.08em] [&>span]:text-muted",
  listingDashboard: "grid gap-4",
  listingHead: "flex flex-wrap items-start justify-between gap-3",
  listingSummary: "grid gap-4 rounded-[12px] border border-line bg-cream/45 p-3 min-[680px]:grid-cols-[180px_minmax(0,1fr)]",
  listingCover: "grid aspect-[4/3] min-h-[128px] place-items-center overflow-hidden rounded-[8px] border border-line bg-paper text-center text-[12px] font-bold text-muted",
  listingInfo: "min-w-0 self-center [&>h3]:mt-1 [&>h3]:truncate [&>h3]:text-[24px] [&>h3]:leading-tight [&>h3]:text-ink [&>p]:mt-1 [&>p]:text-[13.5px] [&>p]:text-muted",
  listingChips: "mt-3 flex flex-wrap gap-2 [&>span]:rounded-[999px] [&>span]:border [&>span]:border-line [&>span]:bg-paper [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[12px] [&>span]:font-bold [&>span]:text-ink/80",
  listingNext: "grid gap-1 rounded-[10px] border border-line bg-paper px-4 py-3 text-[13.5px] text-muted [&>b]:text-[14px] [&>b]:text-ink",
  listingActions: "flex flex-wrap gap-2",
  requestBoard: "grid gap-3",
  quoteList: "flex max-h-[520px] flex-col gap-3 overflow-auto pr-1",
  quoteItem: "rounded-[8px] border border-line bg-cream/45 p-3.5",
  quoteHead: "flex items-center justify-between gap-2",
  quoteName: "truncate text-[14px] font-bold",
  quoteDate: "shrink-0 text-[11.5px] text-muted",
  quoteMeta: "mt-1 text-[12.5px] text-muted",
  quoteSvc: "mt-1.5 text-[12.5px] font-bold text-ink",
  quoteMsg: "mt-1.5 line-clamp-4 text-[13px] text-ink/80",
  emptyQuotes:
    "rounded-[8px] border border-dashed border-line bg-cream/45 px-4 py-6 text-center text-[13.5px] text-muted",
} as const;

export default styles;

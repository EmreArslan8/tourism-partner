import { panelUi } from "@/components/workspace-ui";

const styles = {
  main: `${panelUi.shell} min-[900px]:grid min-[900px]:grid-cols-[264px_minmax(0,1fr)]`,
  mobileHeader:
    "flex h-[72px] items-center justify-between border-b border-line bg-paper px-5 text-ink shadow-[0_8px_22px_-20px_rgba(7,9,42,.55)] min-[900px]:hidden",
  mobileHeaderMeta: "flex items-center gap-3",
  sidebar:
    "border-b border-line bg-paper text-ink transition-transform duration-300 max-[899px]:z-50 max-[899px]:shadow-[14px_0_40px_-28px_rgba(7,9,42,.45)] max-[899px]:fixed max-[899px]:inset-y-0 max-[899px]:start-0 max-[899px]:w-[min(82vw,310px)] max-[899px]:ltr:-translate-x-full max-[899px]:rtl:translate-x-full max-[899px]:overflow-y-auto min-[900px]:sticky min-[900px]:top-0 min-[900px]:h-screen min-[900px]:border-b-0 min-[900px]:border-e min-[900px]:border-line",
  sidebarOpen: "max-[899px]:translate-x-0",
  mobileMenuButton:
    "grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-cream/45 text-brand transition-[transform,background-color] duration-200 hover:bg-cream active:scale-95",
  mobileBackdrop: "fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px] min-[900px]:hidden",
  brandMark:
    "flex h-[92px] items-center border-b border-line/80 px-6 text-ink",
  logoImg: "h-[42px] w-auto max-w-[165px] object-contain",
  brandIcon:
    "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-sapphire font-body text-dashboard-caption font-semibold tracking-normal text-paper shadow-card",
  sideNav:
    "mt-4 grid gap-1 px-4 font-body text-dashboard-nav font-medium tracking-normal min-[900px]:mt-5 [&>a]:flex [&>a]:items-center [&>a]:gap-2.5 [&>a]:rounded-[8px] [&>a]:px-3 [&>a]:py-2.5 [&>a]:text-muted [&>a]:transition-colors hover:[&>a]:bg-cream/70 hover:[&>a]:text-brand",
  sideNavActive: "bg-cream !text-brand",
  sidebarFoot:
    "mt-5 rounded-[10px] border border-line bg-cream/45 p-3 text-[11.5px] text-muted min-[900px]:absolute min-[900px]:bottom-4 min-[900px]:start-4 min-[900px]:end-4 [&>b]:mt-1 [&>b]:block [&>b]:truncate [&>b]:text-[12.5px] [&>b]:font-medium [&>b]:text-ink",
  workspace: "min-w-0",
  content: `${panelUi.page} px-5 pb-12 pt-7 min-[760px]:px-7 min-[900px]:px-9`,
  topbar:
    "sticky top-0 z-40 border-b border-line bg-paper px-5 py-4 shadow-card min-[760px]:px-7 min-[900px]:px-9",
  topbarInner:
    `${panelUi.page} grid min-h-[56px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3`,
  topbarText: "min-w-0",
  header: "mb-5 flex flex-wrap items-center justify-between gap-3",
  title: "truncate font-body text-[24px] font-medium leading-tight tracking-normal text-ink min-[760px]:text-[28px]",
  email: "mt-1 truncate text-[13.5px] font-normal leading-5 text-muted",
  actions:
    "flex min-w-0 shrink-0 flex-nowrap items-center justify-end gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>a]:shrink-0 [&>button]:shrink-0 [&>form]:shrink-0 [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap max-[680px]:w-auto max-[680px]:overflow-visible max-[680px]:justify-start max-[680px]:[&>a]:h-10 max-[680px]:[&>a]:w-10 max-[680px]:[&>a]:justify-center max-[680px]:[&>a]:px-0",
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
  statsGrid: "mb-5 grid grid-cols-3 gap-3 max-[899px]:gap-2",
  metricCard:
    `${panelUi.metric} max-[899px]:p-4 max-[559px]:p-3 [&>small]:mt-2 [&>small]:block [&>small]:text-[12.5px] [&>small]:font-normal [&>small]:text-muted [&>span]:text-[13px] [&>span]:font-normal [&>span]:normal-case [&>span]:tracking-[0] [&>span]:text-muted [&>strong]:mt-1 [&>strong]:block [&>strong]:text-[28px] [&>strong]:font-medium [&>strong]:leading-none [&>strong]:tracking-[0] [&>strong]:text-ink max-[899px]:[&>span]:text-[12px] max-[899px]:[&>strong]:text-[24px] max-[899px]:[&>small]:mt-1.5 max-[899px]:[&>small]:text-[11.5px] max-[559px]:[&>span]:text-[10px] max-[559px]:[&>strong]:text-[20px] max-[559px]:[&>small]:text-[10px] max-[559px]:[&>small]:leading-4`,
  grid: "grid grid-cols-[minmax(0,1fr)_380px] items-start gap-5 max-[980px]:grid-cols-1",
  overviewSection: "min-w-0",
  overviewStack: "grid gap-4 max-[899px]:gap-3",
  overviewHero:
    `grid items-end gap-5 ${panelUi.hero} min-[560px]:p-5 min-[820px]:grid-cols-[minmax(0,1fr)_240px] max-[899px]:gap-3 max-[899px]:p-4 [&_h2]:mt-2 [&_h2]:font-body [&_h2]:text-[32px] [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:tracking-normal [&_h2]:text-ink max-[899px]:[&_h2]:text-[28px] [&_p]:mt-2 [&_p]:max-w-[720px] [&_p]:text-[14px] [&_p]:leading-6 [&_p]:font-normal [&_p]:text-muted max-[899px]:[&_p]:text-[13px] max-[899px]:[&_p]:leading-5`,
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
  editSection: "min-w-0",
  sectionTitle: "font-body text-dashboard-section font-semibold tracking-normal text-ink",
  sectionSub: "mb-4 mt-1 text-[13.5px] text-muted",
  editIntro: "mb-4 flex flex-wrap items-start justify-between gap-4",
  editIntroEyebrow: "mb-1.5 block text-[11px] font-semibold uppercase tracking-[.08em] text-sapphire",
  form: "flex flex-col gap-4",
  editProgress: "grid grid-cols-[auto_minmax(140px,340px)_auto] items-center gap-3 rounded-[10px] border border-line bg-paper px-4 py-3 max-[680px]:grid-cols-[1fr_auto] [&>div:first-child]:flex [&>div:first-child]:items-baseline [&>div:first-child]:gap-2 [&>div:first-child>span]:text-[12px] [&>div:first-child>span]:font-medium [&>div:first-child>span]:text-muted [&>div:first-child>strong]:text-[20px] [&>div:first-child>strong]:font-semibold [&>p]:text-end [&>p]:text-[12px] [&>p]:font-medium [&>p]:text-muted max-[680px]:[&>p]:text-start",
  editProgressTrack: "h-1.5 overflow-hidden rounded-full bg-line max-[680px]:col-span-2 max-[680px]:row-start-2 [&>i]:block [&>i]:h-full [&>i]:rounded-full [&>i]:bg-sapphire [&>i]:transition-[width] [&>i]:duration-500",
  editTabs: "grid w-full grid-flow-col auto-cols-[minmax(136px,1fr)] gap-1.5 overflow-x-auto rounded-[11px] border border-line bg-cream/55 p-1.5 shadow-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  editTab: "group inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-[8px] border border-transparent px-3 text-[13px] font-medium text-muted transition-[color,background-color,border-color,box-shadow,transform] duration-200 hover:bg-paper/70 hover:text-ink active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire [&>span]:truncate",
  editTabActive: "!border-sapphire !bg-sapphire !text-paper shadow-[0_8px_20px_-10px_rgba(21,87,194,.85)] hover:!bg-sapphire hover:!text-paper",
  editTabCheck: "text-emerald-600 group-aria-selected:text-paper",
  editFormLayout: "grid min-w-0 items-start gap-5 min-[1120px]:grid-cols-[minmax(0,1fr)_260px]",
  editFormMain: "min-w-0",
  formSection: "rounded-[10px] border border-line bg-paper/85 p-5",
  basicFormSection: "rounded-[10px] border border-line bg-paper/85 p-5",
  hiddenSection: "hidden",
  formSectionTitle: "mb-4 font-body text-[18px] font-semibold tracking-normal text-ink",
  publishChecklist: "grid content-start gap-3 rounded-[10px] border border-line bg-paper p-4 min-[1120px]:sticky min-[1120px]:top-[108px] [&>p]:text-[12.5px] [&>p]:leading-5 [&>p]:text-muted [&>a]:mt-1 [&>a]:justify-center",
  publishChecklistHead: "flex items-center justify-between gap-3 [&>span]:text-[15px] [&>span]:font-semibold [&>span]:text-ink [&>strong]:rounded-full [&>strong]:bg-cream [&>strong]:px-2.5 [&>strong]:py-1 [&>strong]:text-[12px] [&>strong]:font-semibold [&>strong]:text-brand",
  publishChecklistItems: "grid border-y border-line py-1 [&>button]:grid [&>button]:grid-cols-[18px_minmax(0,1fr)_auto] [&>button]:items-center [&>button]:gap-2 [&>button]:rounded-[7px] [&>button]:px-2 [&>button]:py-2.5 [&>button]:text-start [&>button]:text-muted [&>button]:transition-colors hover:[&>button]:bg-cream/70 hover:[&>button]:text-ink [&>button>span]:truncate [&>button>span]:text-[12.5px] [&>button>span]:font-medium [&>button>small]:text-[10.5px] [&>button>small]:text-muted",
  formActions: "sticky bottom-0 z-10 mt-1 flex justify-end gap-2 border-t border-line bg-panel-bg/92 py-4 backdrop-blur",
  fieldCls:
    `${panelUi.input} h-[44px] px-3.5 font-body text-form-control placeholder:text-muted/50`,
  labelCls: "flex flex-col gap-1.5 font-body text-form-label font-medium normal-case tracking-normal text-ink/75",
  photoWrap: "flex flex-col gap-2",
  photoList: "flex flex-wrap gap-2.5",
  photoBtn:
    "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-line bg-cream/45 text-[12px] text-muted hover:border-sapphire",
  photoBadge: "absolute bottom-0 start-0 end-0 bg-ink/60 py-1 text-center text-[10px] font-bold text-paper",
  photoItem: "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-line",
  photoDelete:
    "absolute end-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-[13px] font-bold text-paper hover:bg-red-600",
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
  partnerPickGrid: "mt-3 grid gap-2 min-[680px]:grid-cols-2",
  partnerPickItem:
    "grid min-h-[72px] content-center rounded-[8px] border border-line bg-paper px-3 py-2.5 text-start transition-colors hover:border-sapphire/45 hover:bg-cream/45",
  partnerPickItemActive: "!border-sapphire bg-sapphire/10",
  partnerPickName: "truncate text-[13.5px] font-semibold text-ink",
  partnerPickMeta: "mt-1 truncate text-[12px] font-medium text-muted",
  partnerRequestList: "mt-4 flex flex-col gap-2",
  partnerRequestTitle: "text-[12px] font-extrabold uppercase tracking-[.06em] text-muted",
  partnerRequestItem:
    "flex items-center justify-between gap-3 rounded-[8px] border border-line bg-paper px-3 py-2.5 max-[560px]:items-start max-[560px]:flex-col",
  partnerRequestActions: "flex shrink-0 items-center gap-2",
  partnerAddRow: "mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line/75 pt-4 text-[12.5px] leading-5 text-muted",
  partnerAddButton: `${panelUi.primaryButton} h-10 gap-2 px-3.5 disabled:cursor-not-allowed disabled:opacity-50`,
  partnerDialog: "max-h-[92vh] max-w-[680px] overflow-y-auto !p-5 min-[640px]:!p-6 [&>h2]:pe-10",
  partnerPicker: "mt-5",
  partnerSearch: "flex h-11 items-center gap-2.5 rounded-[10px] border border-line bg-cream/45 px-3 text-muted transition-colors focus-within:border-sapphire focus-within:bg-paper [&>input]:min-w-0 [&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-[14px] [&>input]:text-ink [&>input]:outline-none [&>input]:placeholder:text-muted/70",
  partnerFilters: "mt-3 grid grid-cols-2 gap-2 max-[480px]:grid-cols-1 [&>select]:h-10 [&>select]:rounded-[8px] [&>select]:border [&>select]:border-line [&>select]:bg-paper [&>select]:px-3 [&>select]:text-[13px] [&>select]:text-ink [&>select]:outline-none focus:[&>select]:border-sapphire",
  partnerResultCount: "mt-4 text-[12px] font-semibold uppercase tracking-[.06em] text-muted",
  partnerResultList: "mt-2 grid max-h-[348px] gap-2 overflow-y-auto pe-1",
  partnerResultItem: "grid min-h-[76px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-[10px] border border-line bg-paper px-3.5 py-3 text-start transition-all hover:border-sapphire hover:bg-cream/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire [&>span:nth-child(2)]:col-start-1",
  partnerResultAction: "row-span-2 rounded-full bg-sapphire/10 px-2.5 py-1 text-[11px] font-semibold text-brand",
  partnerNoResult: "rounded-[10px] border border-dashed border-line bg-cream/45 px-4 py-8 text-center text-[13px] text-muted",
  partnerConfirm: "mt-5 grid gap-4",
  partnerConfirmCard: "rounded-[10px] border border-sapphire/30 bg-sapphire/10 px-4 py-3",
  partnerDialogActions: "flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 [&_button]:inline-flex [&_button]:items-center [&_button]:gap-1.5",
  partnerResultState: "mt-5 grid justify-items-center gap-3 rounded-[12px] border border-emerald-200 bg-emerald-50/70 px-5 py-7 text-center [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-ink [&_p]:mt-1 [&_p]:max-w-[440px] [&_p]:text-[13.5px] [&_p]:leading-5 [&_p]:text-muted [&>button]:mt-1",
  partnerSuccessIcon: "grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-700",
  partnerSendError: "flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-medium leading-5 text-red-700",
  guideBox:
    "rounded-2xl border border-line bg-cream/45 p-4 [&>h3]:text-[15px] [&>h3]:font-bold [&>p]:mt-1 [&>p]:text-[13px] [&>p]:text-muted",
  guideTags: "mt-3 flex flex-wrap gap-1.5 [&>span]:rounded-[999px] [&>span]:border [&>span]:border-line [&>span]:bg-paper [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[12.5px] [&>span]:font-bold",
  // Kategori-bazlı dinamik alanlar + evrak
  dynBox: "rounded-[10px] border border-line bg-cream/45 p-4",
  dynGrid: "mt-2.5 grid grid-cols-2 gap-3 max-[620px]:grid-cols-1",
  dynLabelText: "inline-flex min-w-0 flex-wrap items-baseline gap-1",
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
  listingDashboard: "grid gap-3",
  listingHead: "flex flex-wrap items-start justify-between gap-3",
  listingSummary: "grid gap-4 overflow-hidden rounded-[12px] border border-line bg-cream/45 p-3 min-[680px]:grid-cols-[140px_minmax(0,1fr)]",
  listingCover: "grid aspect-[4/3] min-h-[105px] place-items-center overflow-hidden rounded-[9px] border border-[#d6e0f0] bg-[#e8effb] text-center text-[12px] font-bold text-[#5a6a86] [&>span:first-child]:flex [&>span:first-child]:flex-col [&>span:first-child]:items-center [&>span:first-child]:gap-1.5",
  listingInfo: "flex min-w-0 flex-col self-center [&>h3]:mt-0.5 [&>h3]:truncate [&>h3]:font-body [&>h3]:text-[24px] [&>h3]:font-semibold [&>h3]:leading-tight [&>h3]:tracking-normal [&>h3]:text-ink [&>p]:mt-1 [&>p]:text-[13.5px] [&>p]:font-medium [&>p]:text-muted",
  listingMetrics: "mt-3 flex flex-wrap items-center gap-1.5",
  listingProgress: "inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] text-muted [&>span]:hidden [&>strong]:font-bold [&>strong]:text-ink [&>i]:h-1.5 [&>i]:w-12 [&>i]:overflow-hidden [&>i]:rounded-full [&>i]:bg-[#dfe7f5] [&>i>i]:block [&>i>i]:h-full [&>i>i]:rounded-full [&>i>i]:bg-sapphire",
  listingMetric: "inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] text-muted [&>strong]:font-bold [&>strong]:text-ink",
  listingActions: "mt-3 flex flex-wrap gap-2 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5",
  requestBoard: "grid gap-3",
  quoteList: "flex max-h-[520px] flex-col gap-3 overflow-auto pe-1",
  quoteItem: "rounded-[8px] border border-line bg-cream/45 p-3.5",
  quoteHead: "flex items-center justify-between gap-2",
  quoteName: "truncate text-[14px] font-bold",
  quoteDate: "shrink-0 text-[11.5px] text-muted",
  quoteMeta: "mt-1 text-[12.5px] text-muted",
  quoteSvc: "mt-1.5 text-[12.5px] font-bold text-ink",
  quoteDeadline: "mt-2 w-fit rounded-full bg-amber-100 px-2.5 py-1 text-[11.5px] font-semibold text-amber-800",
  quoteMsg: "mt-1.5 line-clamp-4 text-[13px] text-ink/80",
  emptyQuotes:
    "rounded-[8px] border border-dashed border-line bg-cream/45 px-4 py-6 text-center text-[13.5px] text-muted",
} as const;

export default styles;

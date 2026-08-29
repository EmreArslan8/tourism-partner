import { panelUi } from "@/components/workspace-ui";

const styles = {
  main: `${panelUi.shell} min-[900px]:grid min-[900px]:grid-cols-[254px_minmax(0,1fr)]`,
  mobileHeader:
    "relative z-[50] flex h-[72px] select-none items-center justify-between border-b border-line bg-paper px-5 text-ink shadow-[0_8px_22px_-20px_rgba(7,9,42,.55)] min-[900px]:hidden",
  mobileHeaderMeta: "flex items-center gap-3",
  sidebar:
    "flex flex-col border-b border-white/10 bg-[#0d0b2c] text-white transition-transform duration-300 max-[899px]:z-[70] max-[899px]:shadow-[14px_0_40px_-28px_rgba(7,9,42,.75)] max-[899px]:fixed max-[899px]:inset-y-0 max-[899px]:start-0 max-[899px]:w-[min(86vw,328px)] max-[899px]:ltr:-translate-x-full max-[899px]:rtl:translate-x-full max-[899px]:overflow-y-auto min-[900px]:sticky min-[900px]:top-0 min-[900px]:h-screen min-[900px]:border-b-0 min-[900px]:border-e min-[900px]:border-white/10",
  // Kapalı hâlin ltr/rtl translate kuralları eşit specificity'de ve CSS'te sonra
  // geldiği için normal `translate-x-0` kaybediyordu; açık hâli !important ile
  // kesinleştir (aksi hâlde mobilde sidebar açılmıyor).
  sidebarOpen: "max-[899px]:!translate-x-0",
  mobileMenuButton:
    "grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-cream/45 text-brand transition-[transform,background-color] duration-200 hover:bg-cream active:scale-95",
  mobileBackdrop: "fixed inset-0 z-[55] bg-ink/35 backdrop-blur-[2px] min-[900px]:hidden",
  brandMark:
    "flex h-[92px] shrink-0 items-center px-6 text-white",
  logoImg: "h-[44px] w-auto max-w-[174px] object-contain",
  brandIcon:
    "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-sapphire font-body text-dashboard-caption font-semibold tracking-normal text-paper shadow-card",
  sideNav:
    "mt-1 grid shrink-0 gap-1.5 px-5 font-body text-[13px] font-medium tracking-normal [&>a]:flex [&>a]:min-h-[43px] [&>a]:items-center [&>a]:gap-3.5 [&>a]:rounded-[9px] [&>a]:px-3.5 [&>a]:py-2.5 [&>a]:text-white/72 [&>a]:transition-all hover:[&>a]:translate-x-0.5 hover:[&>a]:bg-white/8 hover:[&>a]:text-white [&_svg]:h-[19px] [&_svg]:w-[19px] [&_svg]:shrink-0",
  sideNavActive: "!bg-gradient-to-r !from-[#7c3aed] !to-[#5b21b6] !text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,.9)]",
  sideNavBoost:
    "tp-sidebar-doping-nav !border !border-[#ffe49a]/85 !bg-[linear-gradient(100deg,#fff8dc_0%,#f7d982_52%,#fff1bd_100%)] !text-[#563700] shadow-[0_12px_28px_-17px_rgba(255,210,91,.95),inset_0_1px_0_rgba(255,255,255,.72)] hover:!border-[#fff0bd] hover:!text-[#3f2700] hover:brightness-105",
  sideNavBoostActive:
    "!border-[#fff0bd] !bg-[linear-gradient(100deg,#fffbed_0%,#f4cc66_52%,#ffeaa7_100%)] !text-[#432900] ring-1 ring-[#ffe29a]/55 shadow-[0_14px_32px_-15px_rgba(255,211,91,.98)]",
  sidebarPromo:
    "mx-5 mb-0 mt-3 grid shrink-0 justify-items-center gap-2.5 rounded-[13px] border border-[#f4d47c]/55 bg-[linear-gradient(145deg,#5b3a08_0%,#9a6814_48%,#4b2f06_100%)] px-4 py-4 text-center text-[#fff9e8] shadow-[0_16px_38px_-22px_rgba(245,190,55,.9),inset_0_1px_0_rgba(255,244,199,.28)] [@media(max-height:820px)]:hidden [&>svg]:h-[27px] [&>svg]:w-[27px] [&>svg]:text-[#ffe7a0] [&_strong]:block [&_strong]:text-[13px] [&_strong]:font-semibold [&_span]:mt-1.5 [&_span]:line-clamp-2 [&_span]:block [&_span]:text-[10.5px] [&_span]:leading-[1.55] [&_span]:text-[#fff4cf]/72 [&>a]:mt-1 [&>a]:min-w-[132px] [&>a]:rounded-[8px] [&>a]:border [&>a]:border-[#ffe5a0]/70 [&>a]:bg-[linear-gradient(180deg,#fff4c7_0%,#e8b84c_100%)] [&>a]:px-3.5 [&>a]:py-2 [&>a]:text-[10.5px] [&>a]:font-semibold [&>a]:text-[#4b2d00] [&>a]:shadow-[0_7px_18px_-10px_rgba(20,10,0,.85)] [&>a]:transition-[transform,filter] hover:[&>a]:-translate-y-0.5 hover:[&>a]:brightness-110",
  sidebarFoot:
    "mx-5 mb-4 mt-auto shrink-0 rounded-[11px] border border-white/15 bg-white/6 p-3.5 text-[11.5px] text-white/58 [&>b]:mt-1 [&>b]:block [&>b]:truncate [&>b]:text-[12.5px] [&>b]:font-medium [&>b]:text-white",
  workspace: "min-w-0",
  content: `${panelUi.page} px-4 pb-8 pt-4 min-[760px]:px-5 min-[900px]:px-6`,
  topbar:
    "sticky top-0 z-40 border-b border-line/70 bg-paper/95 px-4 py-2.5 backdrop-blur-xl min-[760px]:px-5 min-[900px]:px-6",
  topbarInner:
    `${panelUi.page} grid min-h-[58px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4`,
  topbarText: "min-w-0",
  header: "mb-5 flex flex-wrap items-center justify-between gap-3",
  title: "truncate font-body text-[24px] font-medium leading-tight tracking-normal text-ink min-[760px]:text-[28px]",
  email: "mt-1 truncate text-[13.5px] font-normal leading-5 text-muted",
  actions:
    "flex min-w-0 shrink-0 flex-nowrap items-center justify-end gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>a]:shrink-0 [&>button]:shrink-0 [&>form]:shrink-0 [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap max-[680px]:w-auto max-[680px]:overflow-visible max-[680px]:justify-start max-[680px]:[&>a]:h-10 max-[680px]:[&>a]:w-10 max-[680px]:[&>a]:justify-center max-[680px]:[&>a]:px-0",
  dashboardSearch:
    "flex h-10 w-full max-w-[560px] items-center gap-2.5 rounded-[10px] border border-line/75 bg-paper px-3.5 text-muted shadow-[0_8px_24px_-24px_rgba(44,25,94,.7)] transition focus-within:border-[#a78bfa] focus-within:ring-2 focus-within:ring-[#7c3aed]/10 [&>input]:min-w-0 [&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-[12px] [&>input]:text-ink [&>input]:outline-none [&>input]:placeholder:text-muted/65",
  dashboardTopIcon:
    "relative grid h-10 w-10 place-items-center rounded-[9px] text-violet-500 transition hover:bg-cream/60 [&>svg]:h-5 [&>svg]:w-5 [&>i]:absolute [&>i]:end-1.5 [&>i]:top-1.5 [&>i]:h-1.5 [&>i]:w-1.5 [&>i]:rounded-full [&>i]:bg-[#7c3aed] [&>i]:ring-2 [&>i]:ring-white",
  notifWrap: "relative shrink-0",
  notifMenu:
    "absolute end-0 top-[calc(100%+8px)] z-50 w-[280px] overflow-hidden rounded-xl border border-line bg-paper shadow-[0_16px_44px_-16px_rgba(15,23,42,.35)]",
  notifHead: "border-b border-line/70 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-muted",
  notifList: "max-h-[320px] divide-y divide-line/60 overflow-y-auto",
  notifRow:
    "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-cream [&>span>strong]:block [&>span>strong]:truncate [&>span>strong]:text-[13px] [&>span>strong]:font-semibold [&>span>strong]:text-ink [&>span>small]:mt-0.5 [&>span>small]:block [&>span>small]:truncate [&>span>small]:text-[11.5px] [&>span>small]:text-muted",
  notifIcon: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f3edff] text-[#6d28d9]",
  notifDot: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500",
  notifEmpty: "px-4 py-6 text-center text-[13px] text-muted",
  dashboardAccount:
    "ms-1 flex min-w-0 items-center gap-3 border-s border-line/70 ps-4 [&>span]:grid [&>span]:h-11 [&>span]:w-11 [&>span]:shrink-0 [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-gradient-to-br [&>span]:from-[#7c3aed] [&>span]:to-[#3b167c] [&>span]:text-dashboard-caption [&>span]:font-semibold [&>span]:text-white [&>div]:max-w-[190px] max-[760px]:[&>div]:hidden [&_small]:block [&_small]:text-[11px] [&_small]:font-normal [&_small]:leading-4 [&_small]:text-muted [&_strong]:mt-0.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-dashboard-nav [&_strong]:font-semibold [&_strong]:leading-5 [&_strong]:tracking-normal [&_strong]:text-ink",
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
  dashboardOverview: "grid items-start gap-y-4 min-[1180px]:grid-cols-[minmax(0,1fr)_306px]",
  dashboardMainColumn: "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6",
  dashboardHero:
    "relative isolate min-h-[268px] overflow-hidden rounded-[15px] bg-[#1c124c] bg-cover bg-center shadow-[0_22px_55px_-35px_rgba(32,19,84,.9)] [background-image:url('/assets/dashboard-cappadocia-hero-v2.webp')]",
  dashboardHeroShade:
    "absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,13,72,.96)_0%,rgba(42,24,103,.78)_47%,rgba(64,32,118,.18)_100%)]",
  dashboardHeroContent:
    "relative z-10 max-w-[980px] px-6 pb-24 pt-8 text-white min-[680px]:px-8 min-[680px]:pb-7 min-[680px]:pe-[330px] min-[680px]:pt-9 [&>h2]:max-w-[18ch] [&>h2]:text-[29px] [&>h2]:font-medium [&>h2]:leading-[1.18] [&>h2]:tracking-[-.025em] min-[680px]:[&>h2]:text-[31px] [&>p]:mt-3 [&>p]:max-w-[44ch] [&>p]:text-[12.5px] [&>p]:leading-[1.6] [&>p]:text-white/78",
  dashboardHeroEyebrow: "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.13em] text-violet-200",
  dashboardHeroActions: "mt-5 flex flex-wrap gap-2.5",
  dashboardHeroPrimary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-white px-4 text-[12.5px] font-semibold text-[#7c3aed] shadow-[0_12px_24px_-12px_rgba(124,58,237,.9)] transition hover:-translate-y-0.5 hover:bg-white/90",
  dashboardHeroSecondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-white/30 bg-white/8 px-4 text-[12.5px] font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/14",
  dashboardHeroStats:
    "absolute bottom-0 end-0 z-10 grid w-full grid-cols-3 border-t border-white/15 bg-[#251650]/75 px-3 py-3 text-white backdrop-blur-md min-[680px]:bottom-auto min-[680px]:end-5 min-[680px]:top-[92px] min-[680px]:w-[360px] min-[680px]:rounded-[11px] min-[680px]:border [&>div]:flex [&>div]:min-w-0 [&>div]:items-center [&>div]:gap-2 [&>div]:px-3 [&>div+div]:border-s [&>div+div]:border-white/15 [&_svg]:h-[20px] [&_svg]:w-[20px] [&_svg]:shrink-0 [&_svg]:text-white [&_span]:min-w-0 [&_span]:truncate [&_span]:text-[9px] [&_span]:text-white/65 [&_strong]:block [&_strong]:text-[15px] [&_strong]:font-semibold [&_strong]:leading-5 [&_strong]:text-white",
  dashboardSectionHead: "mb-2.5 flex items-center justify-between [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:text-ink [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:text-[10.5px] [&_a]:font-semibold [&_a]:text-brand [&_svg]:h-3 [&_svg]:w-3",
  dashboardCategoryGrid: "grid grid-cols-2 gap-2 min-[600px]:grid-cols-4 min-[1280px]:grid-cols-7",
  dashboardCategoryCard: "group grid min-h-[136px] place-items-center content-center rounded-[10px] border border-line/75 bg-paper px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-[0_12px_25px_-20px_rgba(76,29,149,.65)] [&>span]:grid [&>span]:h-[42px] [&>span]:w-[42px] [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-[#f3edff] [&>span]:text-[#7137df] [&_svg]:h-[22px] [&_svg]:w-[22px] [&>strong]:mt-2 [&>strong]:text-[10.5px] [&>strong]:font-semibold [&>strong]:leading-4 [&>small]:mt-0.5 [&>small]:text-[9.5px] [&>small]:text-muted",
  dashboardFeaturedGrid: "grid grid-cols-[repeat(4,minmax(188px,1fr))] gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  dashboardEmptyState: "col-span-full grid min-h-[194px] place-items-center rounded-[11px] border border-dashed border-line bg-paper px-5 text-center text-[11px] text-muted",
  dashboardBusinessCard: "min-w-0 overflow-hidden rounded-[11px] border border-line/75 bg-paper shadow-[0_10px_24px_-23px_rgba(44,25,94,.65)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-23px_rgba(44,25,94,.8)]",
  dashboardBusinessImage: "relative h-[158px] overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>span]:absolute [&>span]:bottom-2 [&>span]:start-2 [&>span]:rounded-[5px] [&>span]:bg-white/90 [&>span]:px-1.5 [&>span]:py-0.5 [&>span]:text-[9.5px] [&>span]:font-semibold [&>i]:absolute [&>i]:end-2 [&>i]:top-2 [&>i]:grid [&>i]:h-8 [&>i]:w-8 [&>i]:place-items-center [&>i]:rounded-[8px] [&>i]:bg-white/90 [&>i]:text-violet-600 [&>i]:not-italic [&_svg]:h-4 [&_svg]:w-4",
  dashboardBusinessBody: "p-2.5 [&>strong]:block [&>strong]:truncate [&>strong]:text-[13px] [&>strong]:font-semibold [&>small]:mt-1 [&>small]:flex [&>small]:items-center [&>small]:gap-1 [&>small]:truncate [&>small]:text-[11px] [&>small]:text-muted [&>small>svg]:h-3 [&>small>svg]:w-3 [&>div]:mt-2 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:gap-2 [&>div>span]:flex [&>div>span]:items-center [&>div>span]:text-[11px] [&>div>span]:font-semibold [&>div>span>svg]:me-1 [&>div>span>svg]:h-3 [&>div>span>svg]:w-3 [&>div>span>svg]:fill-amber-400 [&>div>span>svg]:text-amber-400 [&>div>span>small]:ms-1 [&>div>span>small]:text-muted [&>div>em]:rounded-[5px] [&>div>em]:bg-[#f3edff] [&>div>em]:px-1.5 [&>div>em]:py-1 [&>div>em]:text-[9.5px] [&>div>em]:font-medium [&>div>em]:not-italic [&>div>em]:text-violet-700",
  dashboardQuickGrid: "grid grid-cols-2 gap-2.5 min-[760px]:grid-cols-4",
  dashboardQuickCard:
    "group grid min-h-[104px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] border border-line/75 bg-paper px-3.5 py-3 shadow-[0_8px_24px_-22px_rgba(44,25,94,.7)] transition-all hover:-translate-y-0.5 hover:border-[#a78bfa] hover:shadow-[0_16px_30px_-23px_rgba(91,33,182,.65)] [&>span]:grid [&>span]:h-10 [&>span]:w-10 [&>span]:place-items-center [&>span]:rounded-[10px] [&>span]:bg-[#f4efff] [&>span]:text-[#6d28d9] [&>svg]:text-muted/50 group-hover:[&>svg]:translate-x-0.5 group-hover:[&>svg]:text-brand [&_strong]:block [&_strong]:text-[12.5px] [&_strong]:font-semibold [&_strong]:leading-4 [&_strong]:text-ink [&_small]:mt-1 [&_small]:line-clamp-2 [&_small]:block [&_small]:text-[10.5px] [&_small]:leading-4 [&_small]:text-muted max-[520px]:grid-cols-[38px_minmax(0,1fr)] max-[520px]:[&>svg]:hidden",
  dashboardAnalytics: "rounded-[14px] border border-line/75 bg-paper p-5 shadow-[0_10px_30px_-26px_rgba(44,25,94,.6)]",
  dashboardAnalyticsHead:
    "flex flex-wrap items-start justify-between gap-4 [&>div:first-child>span]:text-[10px] [&>div:first-child>span]:font-semibold [&>div:first-child>span]:uppercase [&>div:first-child>span]:tracking-[.12em] [&>div:first-child>span]:text-brand/65 [&_h3]:mt-1 [&_h3]:text-[18px] [&_h3]:font-semibold [&_p]:mt-1 [&_p]:text-[11.5px] [&_p]:text-muted",
  dashboardAnalyticsTotal:
    "flex items-center gap-2 rounded-[10px] bg-[#f6f2ff] px-3 py-2 text-brand [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&_strong]:text-[19px] [&_strong]:font-semibold",
  dashboardEmptyChart: "mt-5 grid min-h-[190px] place-content-center justify-items-center gap-2 rounded-[10px] border border-dashed border-line bg-cream/25 text-center text-muted [&>p]:max-w-[38ch] [&>p]:text-[12.5px] [&>a]:inline-flex [&>a]:items-center [&>a]:gap-1 [&>a]:text-[12px] [&>a]:font-semibold [&>a]:text-brand",
  dashboardRail: "grid min-w-0 content-start gap-4 min-[1180px]:ms-5",
  dashboardRailCard: "overflow-hidden rounded-[13px] border border-line/75 bg-paper p-4 shadow-[0_10px_30px_-26px_rgba(44,25,94,.65)]",
  dashboardQuotePanel: "flex min-h-[268px] flex-col [&>ul]:flex-1 [&>ul]:content-start [&>div:last-child]:flex-1",
  dashboardRailHead:
    "flex items-start justify-between gap-3 border-b border-line/60 pb-3 [&_span]:block [&_span]:text-[13.5px] [&_span]:font-semibold [&_small]:mt-0.5 [&_small]:block [&_small]:text-[10px] [&_small]:text-muted [&>a]:inline-flex [&>a]:shrink-0 [&>a]:items-center [&>a]:gap-1 [&>a]:text-[10.5px] [&>a]:font-semibold [&>a]:text-brand",
  dashboardRailEmpty: "grid min-h-[96px] place-content-center justify-items-center gap-2 text-center [&>p]:text-[11.5px] [&>p]:text-muted [&>a]:text-[11px] [&>a]:font-semibold [&>a]:text-brand",
  dashboardQuoteList: "grid [&>li]:flex [&>li]:items-center [&>li]:justify-between [&>li]:gap-3 [&>li]:border-b [&>li]:border-line/45 [&>li]:py-3 last:[&>li]:border-0 last:[&>li]:pb-0 [&_strong]:block [&_strong]:max-w-[150px] [&_strong]:truncate [&_strong]:text-[11.5px] [&_strong]:font-semibold [&_span]:mt-0.5 [&_span]:block [&_span]:max-w-[150px] [&_span]:truncate [&_span]:text-[9.5px] [&_span]:text-muted [&_small]:shrink-0 [&_small]:rounded-full [&_small]:bg-cream/60 [&_small]:px-2 [&_small]:py-1 [&_small]:text-[9px] [&_small]:font-semibold [&_small]:text-muted",
  dashboardQuoteNew: "!bg-[#f1eaff] !text-[#6d28d9]",
  dashboardPromo:
    "relative isolate grid min-h-[190px] items-center overflow-hidden rounded-[13px] bg-[#160b47] bg-cover bg-center [background-image:url('/assets/premium-rocket-v2.jpg')] p-5 text-white shadow-[0_18px_35px_-25px_rgba(76,29,149,.9)] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-[#160b47]/95 before:via-[#21105b]/76 before:to-transparent [&>div]:relative [&>div]:z-10 [&_h3]:max-w-[14ch] [&_h3]:whitespace-pre-line [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:leading-[1.25] [&_p]:mt-3 [&_p]:max-w-[21ch] [&_p]:text-[10.5px] [&_p]:leading-[1.55] [&_p]:text-white/78 [&_a]:mt-4 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:rounded-[7px] [&_a]:bg-white [&_a]:px-3.5 [&_a]:py-2.5 [&_a]:text-[9.5px] [&_a]:font-semibold [&_a]:text-[#5b21b6] [&_a]:shadow-sm",
  dashboardAnnouncementList: "grid pt-1 [&>li]:grid [&>li]:grid-cols-[8px_minmax(0,1fr)] [&>li]:gap-2.5 [&>li]:py-2 [&>li>i]:mt-1.5 [&>li>i]:h-1.5 [&>li>i]:w-1.5 [&>li>i]:rounded-full [&>li>i]:bg-violet-500 [&>li>span]:text-[9.5px] [&>li>span]:font-medium [&>li>span>small]:mt-1 [&>li>span>small]:block [&>li>span>small]:text-[8px] [&>li>span>small]:font-normal [&>li>span>small]:text-muted",
  dashboardHow: "rounded-[13px] bg-gradient-to-r from-[#f7f4ff] to-[#fbfbff] px-5 py-4 min-[1180px]:col-span-2 [&>h3]:mb-2.5 [&>h3]:text-[16px] min-[1180px]:[&>h3]:text-[15px] [&>h3]:font-semibold [&>div]:grid [&>div]:gap-3 min-[760px]:[&>div]:grid-cols-2 min-[1180px]:[&>div]:grid-cols-4 [&_article]:relative [&_article]:grid [&_article]:grid-cols-[38px_minmax(0,1fr)_auto] [&_article]:items-start [&_article]:gap-3 [&_article>span]:grid [&_article>span]:h-[38px] [&_article>span]:w-[38px] [&_article>span]:place-items-center [&_article>span]:rounded-full [&_article>span]:border [&_article>span]:border-violet-200 [&_article>span]:bg-white [&_article>span]:text-[15px] [&_article>span]:font-semibold [&_article>span]:text-violet-800 [&_article>p>strong]:block [&_article>p>strong]:text-[13.5px] min-[760px]:[&_article>p>strong]:text-[12.5px] min-[1180px]:[&_article>p>strong]:text-[12px] [&_article>p>strong]:font-semibold [&_article>p>small]:mt-1 [&_article>p>small]:block [&_article>p>small]:text-[12.5px] [&_article>p>small]:leading-[1.5] min-[760px]:[&_article>p>small]:text-[11.5px] min-[760px]:[&_article>p>small]:leading-[1.45] min-[1180px]:[&_article>p>small]:text-[10.5px] min-[1180px]:[&_article>p>small]:leading-4 [&_article>p>small]:text-muted [&_article>svg]:mt-2.5 [&_article>svg]:h-4 [&_article>svg]:w-4 [&_article>svg]:text-muted max-[1179px]:[&_article>svg]:hidden",
  dashboardProfileHead:
    "flex items-start justify-between gap-3 [&_span]:block [&_span]:text-[13px] [&_span]:font-semibold [&_small]:mt-0.5 [&_small]:block [&_small]:text-[10px] [&_small]:text-muted [&>strong]:text-[19px] [&>strong]:font-semibold [&>strong]:text-brand",
  dashboardProgress: "my-3 h-1.5 overflow-hidden rounded-full bg-[#eee8fa] [&>i]:block [&>i]:h-full [&>i]:rounded-full [&>i]:bg-gradient-to-r [&>i]:from-[#7c3aed] [&>i]:to-[#a78bfa]",
  dashboardChecklist: "grid gap-2.5 [&>li]:grid [&>li]:grid-cols-[15px_minmax(0,1fr)_auto] [&>li]:items-center [&>li]:gap-2 [&>li]:text-[#d97706] [&_span]:truncate [&_span]:text-[10.5px] [&_span]:font-medium [&_span]:text-ink [&_a]:text-[9.5px] [&_a]:font-semibold [&_a]:text-brand",
  dashboardCheckDone: "!text-emerald-600 [&_span]:!text-muted [&_span]:line-through",
  dashboardStatusCard: "flex items-center gap-3 rounded-[12px] border border-line/70 bg-[#f8f5ff] px-4 py-3 [&>span]:text-[10px] [&>span]:font-semibold [&>span]:uppercase [&>span]:tracking-[.08em] [&>p]:ms-auto [&>p]:text-[9.5px] [&>p]:text-muted",
  dashboardDelta: "rounded-full px-2 py-0.5 text-[9.5px] font-semibold",
  dashboardDeltaNeutral: "rounded-full bg-white px-2 py-0.5 text-[9.5px] font-semibold text-muted",
  dashboardDeltaUp: "bg-emerald-100 text-emerald-700",
  dashboardDeltaDown: "bg-red-50 text-red-700",
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
  businessList: "grid gap-3",
  businessListItem: "grid gap-3 rounded-[10px] border border-line bg-paper p-3 shadow-card min-[760px]:grid-cols-[148px_minmax(0,1fr)]",
  businessListCover: "grid aspect-[4/3] min-h-[110px] place-items-center overflow-hidden rounded-[8px] border border-line bg-cream/45 text-muted",
  businessListBody: "min-w-0 [&>p]:mt-1 [&>p]:text-[13.5px] [&>p]:leading-5 [&>p]:text-muted",
  businessListTitleRow: "flex min-w-0 items-start justify-between gap-3 [&_h3]:mt-1 [&_h3]:truncate [&_h3]:font-body [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-ink",
  businessListMeta: "mt-3 flex flex-wrap gap-2 text-[12.5px] text-muted [&>span]:rounded-full [&>span]:border [&>span]:border-line [&>span]:bg-cream/45 [&>span]:px-2.5 [&>span]:py-1 [&_b]:font-semibold [&_b]:text-ink",
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

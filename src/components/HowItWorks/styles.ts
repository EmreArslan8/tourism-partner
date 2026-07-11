/* HowItWorks — tek sahnede iki rol ve üç adımlı canlı workflow. */
const styles = {
  section: "py-7 max-[640px]:py-4",
  headline:
    "mb-6 flex items-end justify-between gap-8 max-[860px]:items-start max-[860px]:flex-col max-[860px]:gap-2 max-[640px]:mb-4",
  eyebrow: "eyebrow mb-1.5 !text-[#9db4ff] max-[640px]:hidden",
  title: "heading-section text-white",
  lead:
    "section-desc max-w-[560px] pb-1 text-right !text-[#c7d3f0] max-[860px]:max-w-[62ch] max-[860px]:text-left max-[640px]:hidden",

  stage:
    "grid h-[520px] min-h-0 grid-cols-[minmax(390px,.86fr)_minmax(480px,1.14fr)] overflow-hidden rounded-[28px] border border-white/15 bg-white/[.045] " +
    "shadow-[0_34px_90px_-54px_rgba(0,0,0,.92)] backdrop-blur-sm " +
    "max-[1050px]:h-[500px] max-[1050px]:grid-cols-[minmax(340px,.9fr)_minmax(400px,1.1fr)] " +
    "max-[860px]:h-auto max-[860px]:min-h-0 max-[860px]:grid-cols-1 max-[640px]:rounded-[20px] max-[640px]:border-0",
  controls: "flex min-w-0 flex-col p-6 max-[1050px]:p-5 max-[640px]:p-3",
  tabs: "grid grid-cols-2 gap-1 rounded-[14px] border border-white/10 bg-black/10 p-1",
  tab:
    "flex h-[38px] items-center justify-center gap-1.5 rounded-[9px] border border-transparent px-2.5 text-[12px] font-bold !text-white/[.72] transition-all hover:border-white/10 hover:bg-white/[.055] hover:!text-white [&>svg]:h-3.5 [&>svg]:w-3.5",
  tabActive:
    "flex h-[38px] items-center justify-center gap-1.5 rounded-[9px] bg-white px-2.5 text-[12px] font-extrabold text-sapphire-deep shadow-[0_8px_20px_-16px_rgba(0,0,0,.75)] transition-all [&>svg]:h-3.5 [&>svg]:w-3.5",

  steps: "relative mt-4 grid flex-1 auto-rows-fr gap-1.5 before:absolute before:bottom-[52px] before:left-[21px] before:top-[52px] before:w-px before:bg-white/12 before:content-[''] " +
    "max-[640px]:hidden",
  mobileSteps: "mx-3 mb-2 hidden grid-cols-3 auto-rows-[54px] gap-1 max-[640px]:grid",
  stepItem: "relative z-10",
  step:
    "grid h-full min-h-[86px] w-full grid-cols-[44px_minmax(0,1fr)_22px] items-center gap-3 rounded-[16px] border border-transparent px-2 py-2.5 text-left transition-all duration-200 hover:bg-white/[.055] " +
    "max-[640px]:min-h-0 max-[640px]:grid-cols-1 max-[640px]:place-items-center max-[640px]:gap-0.5 max-[640px]:rounded-[10px] max-[640px]:px-1 max-[640px]:py-1 max-[640px]:text-center",
  stepActive:
    "grid h-full min-h-[86px] w-full grid-cols-[44px_minmax(0,1fr)_22px] items-center gap-3 rounded-[16px] border border-white/30 bg-white/[.085] px-2 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all duration-200 " +
    "max-[640px]:min-h-0 max-[640px]:grid-cols-1 max-[640px]:place-items-center max-[640px]:gap-0.5 max-[640px]:rounded-[10px] max-[640px]:px-1 max-[640px]:py-1 max-[640px]:text-center",
  stepMarker:
    "grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-sapphire-deep text-[11px] font-black text-white/45 max-[640px]:h-6 max-[640px]:w-6 max-[640px]:text-[8px]",
  stepMarkerActive:
    "grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white text-[11px] font-black text-sapphire-deep shadow-[0_10px_26px_-18px_rgba(255,255,255,.7)] max-[640px]:h-6 max-[640px]:w-6 max-[640px]:text-[8px]",
  stepMarkerComplete:
    "grid h-11 w-11 place-items-center rounded-full border border-[#9db4ff]/45 bg-[#9db4ff]/15 text-[#c7d3f0] max-[640px]:h-6 max-[640px]:w-6 max-[640px]:[&_svg]:h-3 max-[640px]:[&_svg]:w-3",
  stepCopy: "min-w-0",
  stepTitle: "block text-[15px] font-extrabold leading-tight text-white max-[640px]:line-clamp-2 max-[640px]:text-[9px] max-[640px]:leading-[1.1]",
  stepDesc:
    "mt-1 block overflow-hidden text-[12px] font-medium leading-[1.45] text-[#c7d3f0]/[.82] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] max-[640px]:hidden",
  stepIcon: "text-[#9db4ff] opacity-[.82] max-[640px]:hidden",
  cta:
    "mt-4 inline-flex h-[52px] items-center justify-between rounded-[13px] bg-white px-5 text-[14px] font-extrabold text-sapphire-deep shadow-[0_16px_34px_-24px_rgba(0,0,0,.72)] transition-all hover:bg-cream hover:px-[22px] active:scale-[.99] max-[640px]:hidden",
  mobileCta: "mx-3 mb-3 hidden h-11 items-center justify-between rounded-[10px] bg-white px-4 text-[12px] font-extrabold text-sapphire-deep shadow-[0_16px_34px_-24px_rgba(0,0,0,.72)] active:scale-[.99] max-[640px]:flex",

  preview:
    "relative m-3 ml-0 flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,.98),rgba(231,238,255,.94))] text-ink " +
    "shadow-[0_28px_70px_-40px_rgba(0,0,0,.9)] max-[860px]:m-3 max-[860px]:mt-0 max-[860px]:min-h-[390px] " +
    "max-[640px]:mx-3 max-[640px]:mb-3 max-[640px]:h-[360px] max-[640px]:min-h-[360px] max-[640px]:max-h-[360px] max-[640px]:rounded-[22px] max-[640px]:border-white/35",
  previewGlow:
    "pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(53,66,238,.16),transparent_70%)]",
  previewTopbar:
    "relative z-10 flex h-8 shrink-0 items-center gap-1.5 border-b border-sapphire/10 bg-white/[.55] px-3 [&>span]:h-1.5 [&>span]:w-1.5 [&>span]:rounded-full [&>span]:bg-sapphire/20 [&>em]:mx-auto [&>em]:pr-6 [&>em]:text-[9px] [&>em]:font-semibold [&>em]:not-italic [&>em]:text-muted/[.65] " +
    "max-[640px]:h-6 max-[640px]:justify-center max-[640px]:border-0 max-[640px]:bg-transparent max-[640px]:px-0 " +
    "max-[640px]:after:h-1.5 max-[640px]:after:w-16 max-[640px]:after:rounded-full max-[640px]:after:bg-ink max-[640px]:after:content-[''] " +
    "max-[640px]:[&>span]:hidden max-[640px]:[&>em]:hidden",
  previewBody: "relative z-10 grid min-h-0 flex-1 animate-card-in grid-rows-[20px_40px_32px_minmax(0,1fr)] p-4 max-[640px]:flex max-[640px]:flex-col max-[640px]:p-3.5",
  previewHead: "flex items-center justify-between text-brand",
  previewKicker: "text-[10.5px] font-black uppercase tracking-[.13em] text-brand/[.65]",
  previewTitle: "self-end truncate font-display text-[26px] font-medium leading-tight tracking-[-.025em] text-ink max-[640px]:hidden",
  previewSummary: "line-clamp-1 max-w-[54ch] self-center text-[12px] font-medium leading-4 text-muted max-[640px]:hidden",
  desktopDemo: "contents max-[640px]:hidden",
  mobileDemo: "hidden max-[640px]:flex max-[640px]:min-h-0 max-[640px]:flex-1 max-[640px]:items-stretch max-[640px]:justify-start",
  mobilePhone: "h-full w-full overflow-hidden bg-transparent",
  mobilePhoneBar: "hidden",
  mobilePhoneBody: "flex h-full min-h-0 flex-col justify-start gap-3 p-2",
  mobileUiToolbar: "[&>span]:flex [&>span]:items-center [&>span]:justify-between [&_strong]:text-[10px] [&_small]:text-[9px] [&_small]:font-bold [&_small]:text-brand [&>i]:mt-1.5 [&>i]:block [&>i]:h-1.5 [&>i]:overflow-hidden [&>i]:rounded-full [&>i]:bg-[#dce5ff] [&>i>b]:block [&>i>b]:h-full [&>i>b]:rounded-full [&>i>b]:bg-brand",
  mobileUiLabel: "block text-[7.5px] font-bold uppercase tracking-[.05em] text-muted",
  mobileUiProfile: "flex items-center gap-3 rounded-[11px] border border-line/70 bg-white p-3 [&>i]:grid [&>i]:h-10 [&>i]:w-10 [&>i]:place-items-center [&>i]:rounded-[9px] [&>i]:bg-brand [&>i]:text-[10px] [&>i]:font-black [&>i]:not-italic [&>i]:text-white [&>svg:first-child]:rounded-[9px] [&>svg:first-child]:bg-brand [&>svg:first-child]:p-1.5 [&>svg:first-child]:text-white [&>span]:min-w-0 [&>span]:flex-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[11px] [&_small]:mt-0.5 [&_small]:block [&_small]:truncate [&_small]:text-[9px] [&_small]:text-muted [&>svg:last-child]:text-brand",
  mobileUiFields: "grid grid-cols-2 gap-2.5 [&>span]:h-12 [&>span]:rounded-[9px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-[#f8faff] [&>span]:px-3 [&>span]:pt-2 [&>span]:text-[8px] [&>span]:font-bold [&>span]:text-muted [&>span>strong]:mt-0.5 [&>span>strong]:block [&>span>strong]:truncate [&>span>strong]:text-[9px] [&>span>strong]:text-ink",
  mobileUiChips: "flex flex-wrap gap-2 [&>span]:rounded-full [&>span]:bg-[#e8eefc] [&>span]:px-2.5 [&>span]:py-1.5 [&>span]:text-[8.5px] [&>span]:font-bold [&>span]:text-brand",
  mobileUiList: "grid gap-2.5 [&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span]:rounded-[10px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-3 [&_i]:grid [&_i]:h-7 [&_i]:w-7 [&_i]:place-items-center [&_i]:rounded-[7px] [&_i]:bg-brand [&_i]:text-white [&_strong]:min-w-0 [&_strong]:flex-1 [&_strong]:truncate [&_strong]:text-[10px] [&_small]:text-[8.5px] [&_small]:font-bold [&_small]:text-brand",
  mobileUiNotice: "flex items-center gap-2 rounded-[9px] border border-line bg-white p-2.5 text-brand [&>span]:min-w-0 [&_small]:block [&_small]:text-[7px] [&_small]:font-bold [&_strong]:block [&_strong]:truncate [&_strong]:text-[9px] [&_strong]:text-ink",
  mobileUiStats: "grid grid-cols-2 gap-2 [&>span]:rounded-[8px] [&>span]:bg-[#e8eefc] [&>span]:p-2 [&>span]:text-[10px] [&>span]:font-black [&>span]:text-brand [&_small]:ml-1 [&_small]:text-[6.5px] [&_small]:font-bold [&_small]:text-muted",
  mobileUiResults: "grid gap-1.5 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:rounded-[8px] [&>span]:border [&>span]:border-line/70 [&>span]:p-2 [&_i]:h-7 [&_i]:w-8 [&_i]:rounded-[6px] [&_i]:bg-[#e8eefc] [&_strong]:flex-1 [&_strong]:text-[8px] [&_small]:text-[7px] [&_small]:font-bold [&_small]:text-brand",
  mobileUiRequest: "rounded-[9px] border border-line/70 bg-white p-2.5 [&>small]:block [&>small]:text-[6.5px] [&>small]:font-bold [&>small]:uppercase [&>small]:text-brand [&>strong]:mt-1 [&>strong]:block [&>strong]:truncate [&>strong]:text-[9px] [&>button]:mt-2 [&>button]:h-6 [&>button]:w-full [&>button]:rounded-[6px] [&>button]:bg-brand [&>button]:text-[7px] [&>button]:font-bold [&>button]:text-white",
  mobileUiFlow: "relative grid grid-cols-3 before:absolute before:left-[17%] before:right-[17%] before:top-3 before:h-px before:bg-line [&>span]:relative [&>span]:z-10 [&>span]:flex [&>span]:flex-col [&>span]:items-center [&>span]:gap-1 [&_i]:grid [&_i]:h-6 [&_i]:min-w-6 [&_i]:place-items-center [&_i]:rounded-full [&_i]:bg-[#e8eefc] [&_i]:px-1 [&_i]:text-[7px] [&_i]:font-black [&_i]:not-italic [&_i]:text-brand [&_small]:text-[7px] [&_small]:font-bold [&_small]:text-muted",
  mobileUiActions: "mt-auto grid grid-cols-2 gap-2 [&>button]:h-8 [&>button]:rounded-[8px] [&>button]:text-[8px] [&>button]:font-bold [&>button:first-child]:border [&>button:first-child]:border-line [&>button:first-child]:bg-white [&>button:first-child]:text-brand [&>button:last-child]:bg-brand [&>button:last-child]:text-white",
  mobileUiChoiceRows: "grid grid-cols-3 gap-1.5 [&>span]:flex [&>span]:items-center [&>span]:gap-1 [&>span]:rounded-[8px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-2 [&_i]:text-[7px] [&_i]:font-black [&_i]:not-italic [&_i]:text-brand [&_strong]:min-w-0 [&_strong]:flex-1 [&_strong]:truncate [&_strong]:text-[7.5px] [&_svg]:text-brand",
  mobileUiSummary: "mt-auto flex items-center justify-between rounded-[8px] bg-[#e8eefc]/70 px-2.5 py-2 text-brand [&>span]:flex [&>span]:items-center [&>span]:gap-1 [&>span]:text-[7.5px] [&>span]:font-bold [&>strong]:text-[7.5px]",
  mobileUiRequestFields: "grid grid-cols-3 gap-1.5 [&>span]:min-w-0 [&>span]:rounded-[8px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-2 [&_small]:block [&_small]:truncate [&_small]:text-[6px] [&_small]:font-bold [&_small]:text-muted [&_strong]:mt-0.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-[7.5px]",
  mobileUiOfferRows: "grid gap-1.5 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:rounded-[8px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-2 [&>span>i]:grid [&>span>i]:h-7 [&>span>i]:w-7 [&>span>i]:place-items-center [&>span>i]:rounded-[7px] [&>span>i]:bg-[#e8eefc] [&>span>i]:text-[7px] [&>span>i]:font-black [&>span>i]:not-italic [&>span>i]:text-brand [&>span>b]:min-w-0 [&>span>b]:flex-1 [&>span>b]:font-normal [&_strong]:block [&_strong]:truncate [&_strong]:text-[8px] [&_small]:block [&_small]:truncate [&_small]:text-[6.5px] [&_small]:text-muted [&_em]:text-[8px] [&_em]:font-bold [&_em]:not-italic [&_em]:text-brand",
  mockArea:
    "mt-2 flex h-full min-h-0 flex-col justify-center overflow-hidden rounded-[15px] border border-sapphire/10 bg-white/[.66] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.9)] max-[640px]:mt-3 max-[640px]:min-h-[300px] max-[640px]:justify-start max-[640px]:p-3.5",

  demoStack: "flex min-h-0 flex-col gap-2",
  demoToolbar: "flex flex-col gap-2 [&>span:first-child]:flex [&>span:first-child]:items-center [&>span:first-child]:justify-between [&_strong]:text-[12px] [&_strong]:text-ink [&_small]:text-[11px] [&_small]:font-bold [&_small]:text-brand",
  demoProgress: "h-1.5 overflow-hidden rounded-full bg-sapphire/10 [&>i]:block [&>i]:h-full [&>i]:rounded-full [&>i]:bg-brand [&>i]:transition-[width] [&>i]:duration-300",
  demoIdentity: "flex min-w-0 flex-1 flex-col [&>strong]:truncate [&>strong]:text-[12.5px] [&>strong]:text-ink [&>small]:mt-0.5 [&>small]:truncate [&>small]:text-[10.5px] [&>small]:font-medium [&>small]:text-muted",
  demoFields: "grid grid-cols-2 gap-2 max-[480px]:grid-cols-1 [&>span]:rounded-[9px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:px-2.5 [&>span]:py-2 [&_small]:block [&_small]:text-[9px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[.05em] [&_small]:text-muted [&_strong]:mt-0.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-[11px] [&_strong]:text-ink",
  demoChoice: "[&>small]:text-[10px] [&>small]:font-bold [&>small]:uppercase [&>small]:tracking-[.06em] [&>small]:text-muted [&>div]:mt-2 [&>div]:flex [&>div]:flex-wrap [&>div]:gap-2",
  demoChip: "inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-bold text-muted transition-all hover:border-sapphire/25 hover:text-brand",
  demoChipActive: "inline-flex items-center gap-1 rounded-full border border-brand/25 bg-[#e8eefc] px-2.5 py-1 text-[10px] font-bold text-brand transition-all",

  profileRow: "flex items-center gap-3 rounded-[11px] border border-line/70 bg-white p-2.5",
  mockLogo: "grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-brand text-[10px] font-black text-white",
  mockLines: "flex min-w-0 flex-1 flex-col gap-2 [&>i]:block [&>i]:h-2 [&>i]:rounded-full [&>i]:bg-sapphire/10 [&>i:first-child]:w-3/4 [&>i:nth-child(2)]:w-1/2 [&>i:nth-child(3)]:w-2/3",
  mockStatus: "rounded-full bg-[#e8eefc] px-2.5 py-1 text-[10px] font-bold text-brand",
  mockGrid: "mt-3 grid grid-cols-2 gap-3 [&>span]:h-12 [&>span]:rounded-[11px] [&>span]:border [&>span]:border-line/[.65] [&>span]:bg-cream/[.45]",
  verifyPanel: "flex flex-col items-center justify-center py-3 text-center text-brand [&>strong]:mt-3 [&>strong]:text-[18px] [&>strong]:text-ink [&>small]:mt-2 [&>small]:font-semibold [&>small]:text-muted",
  verifyLine: "mt-4 h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-sapphire/10 [&>i]:block [&>i]:h-full [&>i]:w-[82%] [&>i]:rounded-full [&>i]:bg-brand",
  documentList: "grid gap-2 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:rounded-[11px] [&>button]:border [&>button]:border-line/70 [&>button]:bg-white [&>button]:p-3 [&>button]:text-left [&>button]:transition-all [&>button:hover]:border-brand/25 [&_strong]:min-w-0 [&_strong]:flex-1 [&_strong]:truncate [&_strong]:text-[11.5px] [&_strong]:text-ink [&_small]:text-[10px] [&_small]:font-bold",
  documentCheck: "grid h-6 w-6 shrink-0 place-items-center rounded-[7px] border border-line bg-cream/40 text-white",
  documentCheckActive: "grid h-6 w-6 shrink-0 place-items-center rounded-[7px] border border-brand bg-brand text-white",
  approved: "text-emerald-700",
  pending: "text-amber-700",
  quotePanel: "flex items-center gap-4 rounded-[14px] border border-line/70 bg-white p-4 shadow-[0_16px_34px_-28px_rgba(7,9,42,.4)] [&>span:nth-child(2)]:min-w-0 [&_small]:block [&_small]:text-[11px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[.08em] [&_small]:text-brand [&_strong]:mt-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[14px] [&>i]:ml-auto [&>i]:font-bold [&>i]:not-italic [&>i]:text-brand",
  quotePanelOpen: "flex items-center gap-4 rounded-[14px] border border-brand/30 bg-[#f2f5ff] p-4 shadow-[0_16px_34px_-28px_rgba(7,9,42,.4)] [&>span:nth-child(2)]:min-w-0 [&_small]:block [&_small]:text-[11px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[.08em] [&_small]:text-brand [&_strong]:mt-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[14px] [&>i]:ml-auto [&>i]:font-bold [&>i]:not-italic [&>i]:text-brand",
  quoteIcon: "grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-brand text-white",
  quoteDetails: "grid grid-cols-3 gap-2 overflow-hidden transition-all duration-300 data-[open=false]:max-h-0 data-[open=false]:opacity-0 data-[open=true]:max-h-24 data-[open=true]:opacity-100 [&>span]:rounded-[10px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-2.5 [&_small]:block [&_small]:text-[9px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[.05em] [&_small]:text-muted [&_strong]:mt-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[11px] [&_strong]:text-ink",
  quoteFlow: "relative grid grid-cols-3 gap-2 before:absolute before:left-[16%] before:right-[16%] before:top-3 before:h-px before:bg-line before:content-[''] [&>span]:relative [&>span]:z-10 [&>span]:flex [&>span]:flex-col [&>span]:items-center [&>span]:gap-1.5 [&_i]:grid [&_i]:h-6 [&_i]:min-w-6 [&_i]:place-items-center [&_i]:rounded-full [&_i]:bg-[#e8eefc] [&_i]:px-1 [&_i]:text-[8px] [&_i]:font-black [&_i]:not-italic [&_i]:text-brand [&_small]:text-center [&_small]:text-[9px] [&_small]:font-bold [&_small]:text-muted",
  quoteActions: "grid grid-cols-2 gap-2 [&>button]:h-8 [&>button]:rounded-[8px] [&>button]:text-[10.5px] [&>button]:font-bold [&>button]:transition-colors [&>button:first-child]:border [&>button:first-child]:border-line [&>button:first-child]:bg-white [&>button:first-child]:text-brand [&>button:last-child]:bg-brand [&>button:last-child]:text-white [&>button:last-child:hover]:bg-brand-deep",
  joinPanel: "flex items-center gap-4 rounded-[14px] border border-line/70 bg-white p-5 text-brand [&>svg:last-child]:ml-auto",
  joinIcon: "grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-brand text-white",
  joinDetails: "grid grid-cols-3 gap-2.5 max-[520px]:grid-cols-1 [&>button]:flex [&>button]:items-center [&>button]:gap-2 [&>button]:rounded-[11px] [&>button]:border [&>button]:border-line/[.65] [&>button]:bg-white/80 [&>button]:p-3 [&>button]:text-left [&>button]:transition-all [&_i]:grid [&_i]:h-6 [&_i]:w-6 [&_i]:shrink-0 [&_i]:place-items-center [&_i]:rounded-full [&_i]:bg-[#e8eefc] [&_i]:text-[9px] [&_i]:font-black [&_i]:not-italic [&_i]:text-brand [&_strong]:min-w-0 [&_strong]:flex-1 [&_strong]:truncate [&_strong]:text-[11px] [&_strong]:text-ink [&_svg]:text-brand",
  joinDetailActive: "!border-brand/25 !bg-[#eef3ff] shadow-[0_10px_24px_-20px_rgba(7,9,42,.5)]",
  filterSummary: "flex items-center justify-between rounded-[9px] bg-[#e8eefc]/70 px-3 py-2 text-brand [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1.5 [&>span]:text-[9.5px] [&>span]:font-bold [&>strong]:text-[9.5px]",
  filterRow: "flex flex-wrap gap-2 [&>button]:inline-flex [&>button]:items-center [&>button]:gap-1 [&>button]:rounded-full [&>button]:border [&>button]:border-sapphire/10 [&>button]:bg-white [&>button]:px-3 [&>button]:py-1.5 [&>button]:text-[11.5px] [&>button]:font-bold [&>button]:text-brand [&>button]:transition-all",
  filterActive: "!border-brand/30 !bg-[#e8eefc]",
  resultCount: "text-[10.5px] font-bold uppercase tracking-[.06em] text-muted",
  resultRows: "grid gap-2 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:rounded-[11px] [&>button]:border [&>button]:border-line/70 [&>button]:bg-white [&>button]:p-2.5 [&>button]:text-left [&>button]:transition-all [&>button:hover]:border-brand/25 [&_i]:h-8 [&_i]:w-10 [&_i]:shrink-0 [&_i]:rounded-[7px] [&_i]:bg-[linear-gradient(135deg,#dce5ff,#eef3ff)] [&_button>span:nth-child(2)]:min-w-0 [&_button>span:nth-child(2)]:flex-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[10.5px] [&_strong]:text-ink [&_small]:block [&_small]:truncate [&_small]:text-[9px] [&_small]:text-muted [&_button>span:last-child]:text-[10px] [&_button>span:last-child]:font-bold [&_button>span:last-child]:text-brand",
  requestDemo: "flex flex-col gap-2.5",
  requestFields: "grid grid-cols-3 gap-2 [&>span]:rounded-[9px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-2.5 [&_small]:block [&_small]:text-[8.5px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[.05em] [&_small]:text-muted [&_strong]:mt-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[10.5px] [&_strong]:text-ink",
  requestBrief: "flex items-center gap-3 rounded-[13px] border border-line/70 bg-white p-4 [&>span]:min-w-0 [&>span]:flex-1 [&_small]:block [&_small]:text-[9.5px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[.06em] [&_small]:text-brand [&_strong]:mt-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[12px] [&_strong]:text-ink [&>button]:inline-flex [&>button]:shrink-0 [&>button]:items-center [&>button]:gap-1 [&>button]:rounded-[9px] [&>button]:bg-brand [&>button]:px-3 [&>button]:py-2 [&>button]:text-[10.5px] [&>button]:font-bold [&>button]:text-white",
  requestHint: "rounded-[9px] border border-dashed border-line bg-white/55 px-3 py-2 text-center text-[9.5px] font-semibold text-muted",
  offerList: "grid max-h-0 gap-2 overflow-hidden opacity-0 transition-all duration-300 [&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span]:rounded-[11px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-3 [&>span>i]:grid [&>span>i]:h-8 [&>span>i]:w-8 [&>span>i]:shrink-0 [&>span>i]:place-items-center [&>span>i]:rounded-[8px] [&>span>i]:bg-[#e8eefc] [&>span>i]:text-[9px] [&>span>i]:font-black [&>span>i]:not-italic [&>span>i]:text-brand [&>span>span]:min-w-0 [&>span>span]:flex-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[11px] [&_strong]:text-ink [&_small]:block [&_small]:text-[9.5px] [&_small]:text-muted [&>span>em]:font-bold [&>span>em]:not-italic [&>span>em]:text-brand",
  offerListVisible: "grid max-h-40 gap-2 overflow-hidden opacity-100 transition-all duration-300 [&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span]:rounded-[11px] [&>span]:border [&>span]:border-line/70 [&>span]:bg-white [&>span]:p-3 [&>span>i]:grid [&>span>i]:h-8 [&>span>i]:w-8 [&>span>i]:shrink-0 [&>span>i]:place-items-center [&>span>i]:rounded-[8px] [&>span>i]:bg-[#e8eefc] [&>span>i]:text-[9px] [&>span>i]:font-black [&>span>i]:not-italic [&>span>i]:text-brand [&>span>span]:min-w-0 [&>span>span]:flex-1 [&_strong]:block [&_strong]:truncate [&_strong]:text-[11px] [&_strong]:text-ink [&_small]:block [&_small]:text-[9.5px] [&_small]:text-muted [&>span>em]:font-bold [&>span>em]:not-italic [&>span>em]:text-brand",
  progress: "relative z-10 flex h-5 items-center justify-center gap-1.5",
  progressDot: "h-1 w-4 rounded-full bg-sapphire/12 transition-all",
  progressActive: "h-1 w-8 rounded-full bg-brand transition-all duration-300",

  trustRow: "mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 max-[860px]:mt-6 max-[860px]:gap-x-8 max-[640px]:hidden",
  trustChip: "inline-flex items-center gap-2 text-[13px] font-bold text-[#d8e1f7] [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#aebfff]",
} as const;

export default styles;

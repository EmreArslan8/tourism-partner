const styles = {
  main: "container-px mx-auto w-full max-w-[1080px] pb-16 pt-[104px]",
  header: "mb-6 flex flex-wrap items-center justify-between gap-3",
  title: "text-[28px]",
  email: "mt-1 text-[13.5px] text-muted",
  actions: "flex items-center gap-2",
  statusStrip:
    "mb-6 flex flex-wrap items-center gap-2 rounded-[14px] border border-line bg-cream px-5 py-3.5 text-[13.5px]",
  statusLabel: "font-semibold",
  statusBadge: "rounded-pill px-2.5 py-0.5 text-[12px] font-bold",
  statusColors: {
    approved: "bg-group-acente/15 text-group-acente",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-gold/15 text-[#9a7b00]",
  },
  verified: "font-semibold text-group-acente",
  pendingHint: "text-muted",
  grid: "grid grid-cols-[minmax(0,1fr)_minmax(0,400px)] items-start gap-7 max-[860px]:grid-cols-1",
  section: "rounded-[16px] border border-line bg-paper p-6 shadow-card",
  sectionTitle: "mb-1 text-[20px]",
  sectionSub: "mb-4 text-[13px] text-muted",
  form: "flex flex-col gap-4",
  fieldCls: "field h-[44px] font-normal",
  labelCls: "flex flex-col gap-1 text-[12.5px] font-semibold text-muted",
  photoWrap: "flex flex-col gap-2",
  photoList: "flex flex-wrap gap-2.5",
  photoBtn:
    "relative h-[88px] w-[120px] overflow-hidden rounded-[10px] border border-line bg-cream text-[11px] text-muted hover:border-terra",
  photoBadge:
    "absolute bottom-0 left-0 right-0 bg-ink/55 py-0.5 text-center text-[10px] font-semibold text-white",
  photoItem:
    "relative h-[88px] w-[120px] overflow-hidden rounded-[10px] border border-line",
  photoDelete:
    "absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-[12px] font-bold text-white hover:bg-red-600",
  photoAdd:
    "grid h-[88px] w-[120px] place-items-center rounded-[10px] border border-dashed border-line bg-cream text-[12px] text-muted hover:border-terra",
  threeCol: "grid grid-cols-3 gap-3 max-[480px]:grid-cols-1",
  twoCol: "grid grid-cols-2 gap-3 max-[480px]:grid-cols-1",
  textarea: "field min-h-[96px] py-2.5 font-normal",
  checklist: "flex flex-col gap-3",
  checkGroup: "mb-1 text-[12px] font-semibold text-ink/70",
  checkList: "flex flex-wrap gap-1.5",
  checkLabel:
    "flex cursor-pointer items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 text-[12.5px] has-[:checked]:border-terra has-[:checked]:bg-terra/10",
  error: "text-[13px] font-medium text-red-600",
  success: "text-[13px] font-medium text-group-acente",
  quoteList: "flex flex-col gap-3",
  quoteItem: "rounded-[12px] border border-line p-3.5",
  quoteHead: "flex items-center justify-between gap-2",
  quoteName: "text-[14px] font-semibold",
  quoteDate: "text-[11.5px] text-muted",
  quoteMeta: "mt-0.5 text-[12.5px] text-muted",
  quoteSvc: "mt-1.5 text-[12.5px]",
  quoteMsg: "mt-1.5 text-[13px] text-ink/80",
  emptyQuotes:
    "rounded-[12px] border border-dashed border-line bg-cream px-4 py-6 text-center text-[13.5px] text-muted",
} as const;

export default styles;
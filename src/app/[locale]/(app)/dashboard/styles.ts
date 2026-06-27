const styles = {
  main: "container-px mx-auto w-full max-w-[1180px] pb-16 pt-8",
  header: "mb-5 flex flex-wrap items-center justify-between gap-3",
  title: "text-[34px] leading-tight text-ink",
  email: "mt-1 text-[14px] text-muted",
  actions: "flex items-center gap-2",
  hero:
    "mb-4 grid gap-4 rounded-[8px] border border-[#d9ded7] bg-white p-5 shadow-[0_20px_60px_-50px_rgba(16,24,40,.5)] min-[760px]:grid-cols-[minmax(0,1fr)_220px]",
  eyebrow: "text-[11px] font-bold uppercase tracking-[.1em] text-terra",
  heroTitle: "mt-2 text-[28px] leading-tight text-pine",
  heroText: "mt-2 max-w-[680px] text-[14px] text-muted",
  quickActions: "mt-4 flex flex-wrap gap-2",
  statusBox: "grid content-center gap-2 rounded-[8px] border border-[#d8ded7] bg-[#f8faf7] p-4",
  statusLabel: "text-[11px] font-bold uppercase tracking-[.08em] text-muted",
  statusBadge: "w-fit rounded-[999px] px-3 py-1 text-[12px] font-bold",
  statusColors: {
    approved: "bg-group-acente/15 text-group-acente",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-gold/20 text-[#806400]",
  },
  verified: "w-fit rounded-[999px] bg-white px-3 py-1 text-[12px] font-bold text-group-acente",
  notice:
    "mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[8px] border border-gold/40 bg-gold/10 px-4 py-3 text-[13.5px] text-[#6f5600] [&>b]:font-bold",
  noticeDanger:
    "border-red-200 bg-red-50 text-red-700",
  statsGrid: "mb-5 grid gap-3 min-[720px]:grid-cols-3",
  metricCard:
    "rounded-[8px] border border-[#d9ded7] bg-white p-4 shadow-[0_16px_48px_-42px_rgba(16,24,40,.5)] [&>small]:mt-1 [&>small]:block [&>small]:text-[12.5px] [&>small]:text-muted [&>span]:text-[11px] [&>span]:font-bold [&>span]:uppercase [&>span]:tracking-[.08em] [&>span]:text-muted [&>strong]:mt-2 [&>strong]:block [&>strong]:text-[28px] [&>strong]:leading-none [&>strong]:text-pine",
  grid: "grid grid-cols-[minmax(0,1fr)_380px] items-start gap-5 max-[980px]:grid-cols-1",
  sideStack: "grid gap-5",
  section: "rounded-[8px] border border-[#d9ded7] bg-white p-5 shadow-[0_20px_60px_-50px_rgba(16,24,40,.5)]",
  sectionTitle: "text-[24px] leading-tight text-ink",
  sectionSub: "mb-4 mt-1 text-[13.5px] text-muted",
  form: "flex flex-col gap-4",
  fieldCls: "field h-[44px] rounded-[8px] font-normal",
  labelCls: "flex flex-col gap-1.5 text-[12px] font-bold uppercase tracking-[.06em] text-muted",
  photoWrap: "flex flex-col gap-2",
  photoList: "flex flex-wrap gap-2.5",
  photoBtn:
    "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-[#d8ded7] bg-[#f8faf7] text-[12px] text-muted hover:border-terra",
  photoBadge: "absolute bottom-0 left-0 right-0 bg-ink/60 py-1 text-center text-[10px] font-bold text-white",
  photoItem: "relative h-[92px] w-[128px] overflow-hidden rounded-[8px] border border-[#d8ded7]",
  photoDelete:
    "absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-[13px] font-bold text-white hover:bg-red-600",
  photoAdd:
    "grid h-[92px] w-[128px] place-items-center rounded-[8px] border border-dashed border-[#d8ded7] bg-[#f8faf7] text-[12px] font-bold text-muted hover:border-terra",
  threeCol: "grid grid-cols-3 gap-3 max-[620px]:grid-cols-1",
  twoCol: "grid grid-cols-2 gap-3 max-[620px]:grid-cols-1",
  textarea: "field min-h-[108px] rounded-[8px] py-2.5 font-normal",
  checklist: "flex flex-col gap-3",
  checkGroup: "mb-2 text-[13px] font-bold text-ink",
  checkList: "flex flex-wrap gap-1.5",
  checkLabel:
    "flex cursor-pointer items-center gap-1.5 rounded-[999px] border border-[#d8ded7] px-3 py-1.5 text-[12.5px] has-[:checked]:border-terra has-[:checked]:bg-terra/10",
  guideBox:
    "rounded-[8px] border border-[#d8ded7] bg-[#f8faf7] p-4 [&>h3]:text-[15px] [&>h3]:font-bold [&>p]:mt-1 [&>p]:text-[13px] [&>p]:text-muted",
  guideTags: "mt-3 flex flex-wrap gap-1.5 [&>span]:rounded-[999px] [&>span]:border [&>span]:border-[#d8ded7] [&>span]:bg-white [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[12.5px] [&>span]:font-bold",
  error: "text-[13px] font-bold text-red-600",
  success: "text-[13px] font-bold text-group-acente",
  workflowList: "grid gap-2",
  workflowItem:
    "grid grid-cols-[10px_minmax(0,1fr)] gap-2 rounded-[8px] border border-[#d8ded7] bg-[#f8faf7] p-3 text-[13.5px] text-ink/85 [&>span]:mt-1.5 [&>span]:h-2 [&>span]:w-2 [&>span]:rounded-full [&>span]:bg-terra",
  membershipBox:
    "grid gap-1 rounded-[8px] border border-[#d8ded7] bg-[#f8faf7] p-4 [&>b]:text-[24px] [&>b]:text-pine [&>small]:text-[12.5px] [&>small]:text-muted [&>span]:text-[11px] [&>span]:font-bold [&>span]:uppercase [&>span]:tracking-[.08em] [&>span]:text-muted",
  requestBoard: "grid gap-3",
  quoteList: "flex max-h-[520px] flex-col gap-3 overflow-auto pr-1",
  quoteItem: "rounded-[8px] border border-[#d8ded7] bg-[#f8faf7] p-3.5",
  quoteHead: "flex items-center justify-between gap-2",
  quoteName: "truncate text-[14px] font-bold",
  quoteDate: "shrink-0 text-[11.5px] text-muted",
  quoteMeta: "mt-1 text-[12.5px] text-muted",
  quoteSvc: "mt-1.5 text-[12.5px] font-bold text-ink",
  quoteMsg: "mt-1.5 line-clamp-4 text-[13px] text-ink/80",
  emptyQuotes:
    "rounded-[8px] border border-dashed border-[#d8ded7] bg-[#f8faf7] px-4 py-6 text-center text-[13.5px] text-muted",
} as const;

export default styles;

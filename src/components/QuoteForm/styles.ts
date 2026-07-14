/* QuoteForm — Tailwind sınıf token'ları */
 const styles= {
  card: "mx-auto max-w-[640px] rounded-card-lg border border-line bg-paper p-7 shadow-card min-[1440px]:max-w-[760px] min-[1440px]:p-9 min-[1800px]:max-w-[820px] min-[1800px]:p-10",
  header: "mb-6 min-[1440px]:mb-8",
  supplier: "mb-5 flex items-center gap-3 rounded-[12px] border border-line bg-cream p-3.5",
  supplierMono: "grid h-12 w-12 shrink-0 place-items-center rounded-[10px] font-display text-[20px] italic text-white/90",
  supplierName: "text-[16px] font-semibold text-ink",
  supplierMeta: "text-[13px] text-muted",
  form: "flex flex-col gap-4 min-[1440px]:gap-5",
  label: "flex flex-col gap-1.5 text-[13px] font-semibold text-ink min-[1440px]:text-[14px] min-[1800px]:text-[14.5px]",
  labelLine: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 [&>small]:text-[11.5px] [&>small]:font-normal [&>small]:text-muted",
  field: "field h-[46px] font-normal min-[1440px]:h-[52px] min-[1800px]:h-[56px]",
  phoneField:
    "flex h-[46px] items-center rounded-[14px] border border-line bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 min-[1440px]:h-[52px] min-[1800px]:h-[56px]",
  phonePrefix: "shrink-0 pl-4 pr-1 text-[14px] font-semibold text-ink",
  phoneInput:
    "h-full min-w-[150px] flex-1 bg-transparent px-2 text-[14px] font-normal text-ink outline-none placeholder:text-ink/45",
  selectWrap: "relative block",
  select: "field h-[46px] w-full appearance-none pr-16 font-normal min-[1440px]:h-[52px] min-[1800px]:h-[56px]",
  selectChevron:
    "pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70",
  textarea: "field min-h-[110px] py-3.5 font-normal min-[1440px]:min-h-[132px] min-[1800px]:min-h-[148px]",
  row: "grid grid-cols-2 gap-4 max-[480px]:grid-cols-1",
  datePicker: "relative min-w-0",
  dateLegend: "mb-1.5 block text-[13px] font-semibold text-ink",
  dateTrigger:
    "flex h-[46px] w-full items-center gap-3 rounded-[14px] border border-line bg-white px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:border-primary/55 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
  dateTriggerText: "flex min-w-0 flex-1 items-center gap-2 text-[14px] font-medium",
  dateValue: "truncate text-ink [font-variant-numeric:tabular-nums]",
  datePlaceholder: "truncate text-ink/45",
  dateDash: "text-line",
  dateIcon:
    "grid h-4 w-4 shrink-0 place-items-center text-primary/70 [&_svg]:h-4 [&_svg]:w-4",
  datePopover:
    "absolute left-0 top-[calc(100%+8px)] z-30 w-[304px] rounded-[16px] border border-line bg-white p-3.5 shadow-[0_18px_46px_rgba(15,23,42,0.16)] max-[520px]:w-full",
  datePopoverFooter: "mt-3 flex items-center justify-between border-t border-line pt-3",
  dateClearButton:
    "rounded-full px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:bg-cream hover:text-ink",
  dateDoneButton:
    "rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-primary/90",
  note: "mt-2 text-[13px] font-medium text-ink/70",
} as const;

export default styles;

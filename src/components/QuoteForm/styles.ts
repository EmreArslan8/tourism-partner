/* QuoteForm — Tailwind sınıf token'ları */
 const styles= {
  card: "mx-auto max-w-[640px] rounded-card-lg border border-line bg-paper p-7 shadow-card",
  supplier: "mb-5 flex items-center gap-3 rounded-[12px] border border-line bg-cream p-3.5",
  supplierMono: "grid h-12 w-12 shrink-0 place-items-center rounded-[10px] font-display text-[20px] italic text-white/90",
  supplierName: "text-[16px] font-semibold text-ink",
  supplierMeta: "text-[13px] text-muted",
  form: "flex flex-col gap-4",
  label: "flex flex-col gap-1.5 text-[13px] font-semibold text-ink",
  field: "field h-[46px] font-normal",
  textarea: "field min-h-[110px] py-3.5 font-normal",
  row: "grid grid-cols-2 gap-4 max-[480px]:grid-cols-1",
  choiceSet: "rounded-[14px] border border-ink/10 bg-cream/55 p-3.5",
  choiceLegend: "mb-2.5 text-[13px] font-semibold text-ink",
  categoryGrid: "grid grid-cols-2 gap-2 max-[520px]:grid-cols-1",
  categoryOption:
    "flex min-h-[58px] items-center gap-2.5 rounded-[10px] border border-ink/15 bg-white px-3.5 py-3 text-left text-[13.5px] font-semibold text-ink transition-[border-color,box-shadow,transform] hover:-translate-y-px hover:border-ink/35",
  categoryOptionActive: "border-ink/70 shadow-[0_12px_28px_-22px_rgba(11,16,47,.8)]",
  categoryDot: "h-2.5 w-2.5 shrink-0 rounded-full",
  typeGrid: "grid grid-cols-2 gap-2 max-[520px]:grid-cols-1",
  typeOption:
    "min-h-[42px] rounded-[10px] border border-ink/15 bg-white px-3.5 py-2.5 text-left text-[13.5px] font-medium text-ink transition-[border-color,background-color,box-shadow] hover:border-ink/35",
  typeOptionActive: "border-ink/70 bg-ink text-white shadow-[0_12px_28px_-22px_rgba(11,16,47,.8)]",
  typeEmpty: "rounded-[10px] border border-dashed border-ink/20 bg-white/70 px-3.5 py-3 text-[13px] font-medium text-muted",
  note: "mt-1 text-[13px] text-muted",
} as const;

export default styles;

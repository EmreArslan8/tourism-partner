/* QuoteForm — Tailwind sınıf token'ları */
export const styles= {
  card: "mx-auto max-w-[640px] rounded-[18px] border border-line bg-paper p-7 shadow-card",
  supplier: "mb-5 flex items-center gap-3 rounded-[12px] border border-line bg-cream p-3.5",
  supplierMono: "grid h-12 w-12 shrink-0 place-items-center rounded-[10px] font-display text-[20px] italic text-white/90",
  supplierName: "text-[16px] font-semibold text-ink",
  supplierMeta: "text-[13px] text-muted",
  form: "flex flex-col gap-4",
  label: "flex flex-col gap-1.5 text-[13px] font-semibold text-ink",
  field: "field h-[46px] font-normal",
  textarea: "field min-h-[110px] py-3.5 font-normal",
  row: "grid grid-cols-2 gap-4 max-[480px]:grid-cols-1",
  note: "mt-1 text-[13px] text-muted",
} as const;

/* HowItWorks + FAQ — Tailwind sınıf token'ları */
export const styles= {
  section: "py-11",
  head: "mb-[30px] text-center",
  headTitle: "text-[clamp(24px,3vw,36px)]",
  grid: "grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]",
  card: "rounded-[16px] border border-line bg-paper p-[26px] shadow-card",
  num:
    "mb-3.5 inline-grid h-[38px] w-[38px] place-items-center rounded-full bg-pine " +
    "font-display text-[18px] text-cream",
  cardTitle: "mb-2 text-[20px]",
  cardText: "text-[14.5px] text-muted",
  faqList: "flex flex-col gap-2.5",
  faqItem: "rounded-xl border border-line bg-paper px-[18px] py-1",
  faqSummary:
    "flex cursor-pointer list-none items-center justify-between py-3.5 text-[15.5px] font-semibold " +
    "after:text-[20px] after:text-terra after:content-['+'] [details[open]>&]:after:content-['−']",
  faqText: "pb-4 text-[14.5px] text-muted",
} as const;

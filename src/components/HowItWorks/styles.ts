/* HowItWorks + FAQ — Tailwind sınıf token'ları */
 const styles= {
  section: "py-9 max-[640px]:py-6",
  headline: "mx-auto mb-7 max-w-[680px] text-center",
  eyebrow:
    "mb-2.5 inline-flex rounded-[8px] border border-line bg-paper px-2.5 py-1 " +
    "text-[11px] font-black text-pine shadow-[0_10px_30px_-24px_rgba(7,9,42,.6)]",
  title: "text-[clamp(22px,2.5vw,32px)] leading-[1.08] text-pine",
  lead: "mx-auto mt-3 max-w-[640px] text-[14.5px] leading-6 text-muted max-[560px]:text-[13px]",
  stage:
    "grid grid-cols-[minmax(0,0.95fr)_minmax(320px,1.15fr)] items-stretch gap-5 " +
    "max-[980px]:grid-cols-1 max-[980px]:gap-4",
  visual:
    "relative min-h-[430px] overflow-hidden rounded-[16px] border border-line bg-[#f8f9ff] shadow-card " +
    "max-[980px]:order-first max-[980px]:min-h-[360px] max-[560px]:min-h-[260px]",
  image:
    "object-cover opacity-0 scale-[1.03] transition-[opacity,transform] duration-700 ease-brand",
  imageActive:
    "object-cover opacity-100 scale-100 transition-[opacity,transform] duration-700 ease-brand",
  visualWash:
    "absolute inset-0 bg-[linear-gradient(180deg,rgba(246,248,255,.04)_0%,rgba(7,9,42,.04)_100%)]",
  steps:
    "grid h-full grid-rows-3 gap-2.5",
  step:
    "group relative grid h-full min-h-0 grid-cols-[38px_minmax(0,1fr)] items-start gap-3.5 overflow-hidden rounded-[14px] border border-line " +
    "bg-white px-4 py-5 text-left text-ink-soft shadow-[0_14px_44px_-40px_rgba(7,9,42,.55)] transition-all duration-300 ease-brand " +
    "hover:-translate-y-0.5 hover:border-terra/35 max-[560px]:min-h-[106px] max-[560px]:grid-cols-[34px_minmax(0,1fr)] max-[560px]:gap-3 max-[560px]:px-3 max-[560px]:py-4",
  stepActive:
    "group relative grid h-full min-h-0 grid-cols-[38px_minmax(0,1fr)] items-start gap-3.5 overflow-hidden rounded-[14px] border border-terra/10 " +
    "bg-[linear-gradient(135deg,#3542ee_0%,#5b6cff_58%,#8ea2ff_100%)] px-4 py-5 text-left text-white shadow-pop transition-all duration-300 ease-brand " +
    "max-[560px]:min-h-[106px] max-[560px]:grid-cols-[34px_minmax(0,1fr)] max-[560px]:gap-3 max-[560px]:px-3 max-[560px]:py-4",
  stepNum:
    "grid h-8 w-8 place-items-center rounded-[10px] bg-[#edf1ff] text-[16px] font-black leading-none tracking-[-.02em] text-terra transition-colors duration-300 ease-brand " +
    "group-aria-selected:bg-white/18 group-aria-selected:text-white max-[560px]:h-7 max-[560px]:w-7 max-[560px]:text-[14px]",
  stepText: "min-w-0",
  stepTitle: "block pt-[2px] text-[15.5px] font-semibold leading-[1.25] text-current max-[560px]:text-[14px]",
  stepDesc: "mt-1.5 block max-w-[58ch] text-[13.25px] leading-[1.5] text-current opacity-90 max-[560px]:text-[12.25px]",
  progress: "absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-terra/15",
  progressActive: "absolute bottom-0 left-0 h-[3px] w-full origin-left animate-[how-progress_5.6s_linear] bg-terra/70",
  actions: "mt-6 flex justify-center gap-3 max-[560px]:flex-col",
  headEyebrow: "mb-2 block text-[12px] font-bold uppercase tracking-[.16em] text-muted",
  headTitle: "text-[clamp(26px,3vw,40px)] font-semibold leading-tight tracking-[-0.01em] text-ink",
  faqWrap: "grid grid-cols-[0.85fr_1.15fr] gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-7",
  faqAside: "self-start max-[860px]:text-center lg:sticky lg:top-28",
  faqLead: "mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted max-[860px]:mx-auto",
  faqList: "flex w-full flex-col gap-3",
  faqItem:
    "group border-b border-line transition-colors first:border-t last:border-b " +
    "open:[&_summary]:text-terra",
  faqSummary:
    "flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16.5px] font-semibold text-ink " +
    "transition-colors group-hover:text-terra " +
    "after:grid after:h-8 after:w-8 after:shrink-0 after:place-items-center after:rounded-full " +
    "after:border after:border-line after:text-[20px] after:font-normal after:leading-none after:text-terra " +
    "after:transition-transform after:duration-300 after:content-['+'] [details[open]>&]:after:rotate-45 " +
    "[details[open]>&]:after:border-terra [details[open]>&]:after:bg-terra [details[open]>&]:after:text-white",
  faqText: "pb-5 pr-10 text-[15px] leading-relaxed text-muted max-[560px]:pr-2",
} as const;

export default styles;

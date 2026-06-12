/* HowItWorks + FAQ — Tailwind sınıf token'ları */
export const styles= {
  section: "py-16 max-[640px]:py-10",
  headline: "mx-auto mb-10 max-w-[760px] text-center",
  eyebrow:
    "mb-4 inline-flex rounded-[8px] border border-line bg-paper px-3 py-1.5 " +
    "text-[12px] font-black text-pine shadow-[0_10px_30px_-24px_rgba(7,9,42,.6)]",
  title: "text-[clamp(34px,4.7vw,60px)] leading-[1.02] text-pine",
  lead: "mx-auto mt-5 max-w-[720px] text-[16px] leading-7 text-muted max-[560px]:text-[14.5px]",
  stage:
    "grid grid-cols-[minmax(0,0.95fr)_minmax(420px,1.25fr)] items-stretch gap-8 " +
    "max-[980px]:grid-cols-1 max-[980px]:gap-5",
  visual:
    "relative min-h-[520px] overflow-hidden rounded-[18px] border border-line bg-[#f8f9ff] shadow-card " +
    "max-[980px]:min-h-[420px] max-[560px]:min-h-[320px]",
  image:
    "object-cover opacity-0 scale-[1.03] transition-[opacity,transform] duration-700 ease-brand",
  imageActive:
    "object-cover opacity-100 scale-100 transition-[opacity,transform] duration-700 ease-brand",
  visualWash:
    "absolute inset-0 bg-[linear-gradient(180deg,rgba(246,248,255,.06)_0%,rgba(7,9,42,.08)_48%,rgba(7,9,42,.56)_100%)]",
  visualCard:
    "absolute bottom-5 left-5 right-5 rounded-[14px] border border-white/20 bg-white/86 p-5 shadow-[0_24px_70px_-46px_rgba(7,9,42,.8)] backdrop-blur " +
    "max-[560px]:bottom-3 max-[560px]:left-3 max-[560px]:right-3 max-[560px]:p-4",
  visualKicker: "text-[11px] font-black uppercase tracking-[.12em] text-terra",
  visualTitle: "mt-2 block text-[clamp(22px,2.6vw,34px)] leading-tight text-pine",
  steps: "grid gap-3",
  step:
    "group relative grid min-h-[150px] grid-cols-[42px_minmax(0,1fr)] gap-5 overflow-hidden rounded-[16px] border border-line " +
    "bg-paper px-6 py-6 text-left text-muted shadow-[0_16px_48px_-42px_rgba(7,9,42,.55)] transition-all duration-300 ease-brand " +
    "hover:-translate-y-0.5 hover:border-terra/40 max-[560px]:min-h-[132px] max-[560px]:gap-3 max-[560px]:px-4 max-[560px]:py-5",
  stepActive:
    "group relative grid min-h-[150px] grid-cols-[42px_minmax(0,1fr)] gap-5 overflow-hidden rounded-[16px] border border-terra/10 " +
    "bg-[linear-gradient(135deg,#3542ee_0%,#5b6cff_58%,#8ea2ff_100%)] px-6 py-6 text-left text-white shadow-pop transition-all duration-300 ease-brand " +
    "max-[560px]:min-h-[132px] max-[560px]:gap-3 max-[560px]:px-4 max-[560px]:py-5",
  stepNum: "pt-0.5 text-[32px] font-black leading-none tracking-[-.02em] max-[560px]:text-[26px]",
  stepText: "min-w-0",
  stepTitle: "block text-[20px] leading-tight text-current max-[560px]:text-[18px]",
  stepDesc: "mt-3 block max-w-[640px] text-[15px] leading-6 text-current opacity-75 max-[560px]:text-[13.5px] max-[560px]:leading-5",
  progress: "absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-terra/25",
  progressActive: "absolute bottom-0 left-0 h-[3px] w-full origin-left animate-[how-progress_3.6s_linear] bg-white/72",
  actions: "mt-8 flex justify-center gap-3 max-[560px]:flex-col",
  head: "mb-[30px] text-center",
  headTitle: "text-[clamp(24px,3vw,36px)]",
  faqList: "flex flex-col gap-2.5",
  faqItem: "rounded-[8px] border border-line bg-paper px-[18px] py-1",
  faqSummary:
    "flex cursor-pointer list-none items-center justify-between py-3.5 text-[15.5px] font-semibold " +
    "after:text-[20px] after:text-terra after:content-['+'] [details[open]>&]:after:content-['−']",
  faqText: "pb-4 text-[14.5px] text-muted",
} as const;

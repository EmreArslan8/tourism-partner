/* HowItWorks — "Üç adımda iş birliği" adım şeridi + görsel sahnesi. */
const styles = {
  section: "py-9 max-[640px]:py-[19.2px]",
  headline: "section-copy mb-7 max-w-[680px] max-[560px]:mb-[22.4px]",
  title: "heading-panel text-pine",
  lead: "section-desc mt-3 max-w-[640px] max-[560px]:mt-[9.6px]",
  stage:
    "grid grid-cols-[minmax(0,0.95fr)_minmax(320px,1.15fr)] items-stretch gap-5 " +
    "max-[980px]:grid-cols-1 max-[980px]:gap-4 max-[560px]:gap-[12.8px]",
  steps: "grid h-full grid-rows-3 gap-2.5 max-[560px]:gap-2",
  step:
    "group relative grid h-full min-h-0 grid-cols-[38px_minmax(0,1fr)] items-start gap-3.5 overflow-hidden rounded-card border border-line " +
    "bg-white px-4 py-5 text-left text-ink-soft shadow-[0_14px_44px_-40px_rgba(7,9,42,.55)] transition-all duration-300 ease-brand " +
    "hover:-translate-y-0.5 hover:border-terra/35 max-[560px]:min-h-[84.8px] max-[560px]:grid-cols-[27.2px_minmax(0,1fr)] max-[560px]:gap-[9.6px] max-[560px]:px-[9.6px] max-[560px]:py-[12.8px]",
  stepActive:
    "group relative grid h-full min-h-0 grid-cols-[38px_minmax(0,1fr)] items-start gap-3.5 overflow-hidden rounded-card border border-terra/10 " +
    "bg-[linear-gradient(135deg,#3542ee_0%,#5b6cff_58%,#8ea2ff_100%)] px-4 py-5 text-left text-white shadow-pop transition-all duration-300 ease-brand " +
    "max-[560px]:min-h-[84.8px] max-[560px]:grid-cols-[27.2px_minmax(0,1fr)] max-[560px]:gap-[9.6px] max-[560px]:px-[9.6px] max-[560px]:py-[12.8px]",
  stepNum:
    "step-number-text grid h-8 w-8 place-items-center rounded-[10px] bg-[#edf1ff] text-terra transition-colors duration-300 ease-brand " +
    "group-aria-selected:bg-white/18 group-aria-selected:text-white max-[560px]:h-[22.4px] max-[560px]:w-[22.4px] max-[560px]:rounded-lg",
  stepText: "min-w-0",
  stepTitle: "step-title-text block pt-[2px] max-[560px]:pt-[1.6px]",
  stepDesc: "step-desc-text mt-1.5 block max-w-[58ch] max-[560px]:mt-[4.8px]",
  progress: "absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-terra/15 max-[560px]:h-[2.4px]",
  progressActive: "absolute bottom-0 left-0 h-[3px] w-full origin-left animate-[how-progress_5.6s_linear] bg-terra/70 max-[560px]:h-[2.4px]",
  visual:
    "relative min-h-[430px] overflow-hidden rounded-card-lg border border-line bg-[#f8f9ff] shadow-card " +
    "max-[980px]:order-first max-[980px]:min-h-[360px] max-[560px]:min-h-[208px]",
  image: "object-cover opacity-0 scale-[1.03] transition-[opacity,transform] duration-700 ease-brand",
  imageActive: "object-cover opacity-100 scale-100 transition-[opacity,transform] duration-700 ease-brand",
  visualWash: "absolute inset-0 bg-[linear-gradient(180deg,rgba(246,248,255,.04)_0%,rgba(7,9,42,.04)_100%)]",
} as const;

export default styles;

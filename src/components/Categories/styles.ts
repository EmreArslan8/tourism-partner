/* Categories - sekmeli liste + buyuk gorsel panel.
   Desktop/tablet: sol kategori listesi ve sag gorsel ayni yukseklikte.
   Mobile: liste ve gorsel alt alta, metinler tasma yapmadan kisaltilir. */
const styles = {
  section:
    "relative flex min-h-0 w-full shrink-0 flex-col justify-start gap-7 py-0 " +
    "max-[1100px]:gap-5 max-[640px]:gap-4",
  head: "flex items-end justify-between gap-4 max-[640px]:shrink-0",
  headCopy: "section-copy max-w-[700px]",
  eyebrow: "eyebrow mb-1.5 text-brand/65",
  headTitle: "heading-section text-ink",
  lead: "section-desc mt-2 max-w-[560px] font-medium",

  panel:
    "grid min-h-[478px] grid-cols-[minmax(480px,1.05fr)_minmax(430px,.95fr)] items-stretch gap-9 " +
    "max-[1280px]:min-h-[452px] max-[1280px]:grid-cols-[minmax(430px,1.04fr)_minmax(390px,.96fr)] max-[1280px]:gap-7 " +
    "max-[980px]:grid-cols-1 max-[980px]:gap-5 max-[980px]:min-h-0",
  list:
    "flex h-full min-h-0 flex-col justify-between gap-1.5 py-1 " +
    "max-[980px]:gap-2 max-[640px]:grid max-[640px]:grid-cols-2 max-[640px]:gap-2.5 max-[640px]:py-0",
  item:
    "group/category grid min-h-[68px] grid-cols-[28px_minmax(0,1fr)] gap-3 rounded-card px-5 py-3.5 text-left outline-none " +
    "transition-all duration-200 ease-brand hover:bg-white/70 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand/30 " +
    "max-[1280px]:min-h-[64px] max-[1280px]:px-4 max-[1280px]:py-3 " +
    "max-[640px]:relative max-[640px]:block max-[640px]:min-h-0 max-[640px]:overflow-hidden max-[640px]:bg-white max-[640px]:p-0 max-[640px]:shadow-[0_14px_32px_-26px_rgba(7,9,42,.55)] max-[640px]:aspect-[1.18/1]",
  itemActive:
    "bg-white shadow-[0_16px_36px_-30px_rgba(7,9,42,.55)] ring-1 ring-black/5 " +
    "[&_.category-index]:text-brand [&_.category-name]:text-ink [&_.category-badge]:bg-brand/10 [&_.category-badge]:text-brand",
  index:
    "category-index pt-1 text-[12px] font-bold leading-none text-brand/45 transition-colors " +
    "max-[640px]:hidden",
  mobileMedia:
    "relative hidden overflow-hidden bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] " +
    "max-[640px]:absolute max-[640px]:inset-0 max-[640px]:block max-[640px]:h-full max-[640px]:w-full",
  itemCopy:
    "flex min-w-0 flex-col gap-1.5 " +
    "max-[640px]:absolute max-[640px]:inset-x-0 max-[640px]:bottom-0 max-[640px]:z-10 max-[640px]:gap-0 max-[640px]:bg-white/92 max-[640px]:p-2 max-[640px]:backdrop-blur-md",
  titleRow:
    "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 " +
    "max-[640px]:w-full max-[640px]:flex-nowrap max-[640px]:items-start max-[640px]:justify-between max-[640px]:gap-1.5",
  name:
    "category-name min-w-0 text-[18px] font-extrabold leading-[1.08] tracking-normal text-ink/92 transition-colors " +
    "max-[1280px]:text-[16.5px] max-[640px]:max-w-[calc(100%-58px)] max-[640px]:text-[14px] max-[640px]:leading-[1.05]",
  badge:
    "category-badge inline-flex max-w-full shrink-0 rounded-full bg-brand/8 px-2.5 py-1 text-[11px] font-bold leading-none text-brand/70 transition-colors " +
    "max-[640px]:max-w-[58px] max-[640px]:items-center max-[640px]:justify-center max-[640px]:whitespace-normal max-[640px]:break-words max-[640px]:px-1.5 max-[640px]:py-0.5 max-[640px]:text-center max-[640px]:text-[8.5px] max-[640px]:leading-[1.05]",
  desc:
    "section-desc !mt-0 overflow-hidden !text-[12.5px] !leading-[1.55] text-ink/72 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] " +
    "max-[1280px]:!text-[12px] max-[640px]:hidden",

  visual:
    "group relative h-full min-h-[478px] overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,#E7EDF7,#F7F9FF)] shadow-[0_24px_58px_-38px_rgba(7,9,42,.65)] ring-1 ring-black/5 " +
    "transition-transform duration-300 ease-brand hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 " +
    "max-[1280px]:min-h-[452px] max-[980px]:h-[360px] max-[980px]:min-h-0 max-[640px]:hidden",
  img:
    "object-cover transition-[transform,opacity] duration-500 ease-brand group-hover:scale-[1.035]",
  visualShade:
    "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,42,0)_42%,rgba(7,9,42,.58)_100%)]",
  visualBadge:
    "absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/92 px-4 py-2 text-[13px] font-extrabold text-ink shadow-[0_14px_34px_-18px_rgba(7,9,42,.55)] backdrop-blur-md " +
    "max-[640px]:bottom-3 max-[640px]:left-3 max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-[11.5px]",
  badgeDot: "h-1.5 w-1.5 rounded-full bg-brand",
  visualCta:
    "absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/92 px-3.5 py-2 text-[12.5px] font-bold text-ink opacity-0 shadow-[0_14px_34px_-18px_rgba(7,9,42,.6)] backdrop-blur-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 " +
    "max-[980px]:opacity-100 max-[640px]:bottom-3 max-[640px]:right-3 max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-[11.5px]",
  ctaArrow: "transition-transform duration-200 group-hover:translate-x-1",

  mobileIcons: "hidden",
  mobileIcon: "hidden",
  mobileIconActive: "",
  icon: "h-5 w-5 text-brand",
} as const;

export default styles;

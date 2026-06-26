/* Showcase — tam genişlikte tek-tek kayan carousel (sol galeri / sağ bilgi). */
const styles = {
  head: "mb-4 flex items-end justify-between gap-4",
  eyebrow: "eyebrow mb-2",
  title: "heading-section text-ink",
  nav: "flex items-center gap-2",
  arrow:
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink " +
    "transition-all duration-200 hover:-translate-y-0.5 hover:border-terra hover:text-terra",

  viewport: "overflow-hidden",
  track: "flex transition-transform duration-500 ease-brand",
  slide: "min-w-full px-0.5 py-1",
  panel:
    "grid grid-cols-[1.1fr_1fr] gap-5 " +
    "max-[860px]:grid-cols-1 max-[860px]:gap-0 max-[860px]:overflow-hidden max-[860px]:rounded-card-lg " +
    "max-[860px]:border max-[860px]:border-line max-[860px]:shadow-card",

  /* SOL — galeri (mobilde üst kısım, birleşik) */
  gallery:
    "relative min-h-[360px] overflow-hidden rounded-card-lg shadow-card " +
    "max-[860px]:min-h-[300px] max-[860px]:rounded-none max-[860px]:shadow-none " +
    "max-[560px]:min-h-0 max-[560px]:aspect-[16/9]",
  galleryImg: "object-cover",
  thumbs: "absolute inset-x-0 bottom-0 flex gap-2 p-3",
  thumb:
    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-white/60 opacity-80 " +
    "transition hover:opacity-100 max-[560px]:h-11 max-[560px]:w-16",
  thumbActive:
    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-white opacity-100 " +
    "shadow-[0_6px_16px_-6px_rgba(0,0,0,.6)] max-[560px]:h-11 max-[560px]:w-16",

  /* SAĞ — bilgiler (ayrı box) */
  info:
    "flex flex-col gap-3 rounded-card-lg border border-line bg-paper p-7 shadow-card " +
    "max-[860px]:rounded-none max-[860px]:border-0 max-[860px]:shadow-none max-[560px]:gap-2.5 max-[560px]:p-4",
  infoTop: "flex flex-wrap items-center gap-2.5 max-[560px]:gap-1.5",
  cat: "rounded-full bg-cream-deep px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-brand max-[560px]:px-2.5 max-[560px]:text-[11px]",
  verified:
    "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600 max-[560px]:text-[11px]",
  name: "heading-card text-ink max-[560px]:text-[19px]",
  meta: "flex flex-wrap items-center gap-3 text-[14px] text-muted max-[560px]:gap-2 max-[560px]:text-[13px]",
  metaItem: "inline-flex items-center gap-1.5",
  metaIcon: "h-4 w-4 text-muted max-[560px]:h-3.5 max-[560px]:w-3.5",
  metaDot: "h-1 w-1 rounded-full bg-line",
  stars: "text-[15px] text-gold",
  ratingNum: "font-bold text-ink",
  reviews: "text-[13px] text-muted",
  desc: "line-clamp-2 text-[14.5px] leading-relaxed text-ink/70 max-[560px]:line-clamp-2 max-[560px]:text-[13.5px]",
  services: "flex flex-col gap-2 max-[560px]:hidden",
  servicesLabel: "text-[11.5px] font-bold uppercase tracking-[.12em] text-muted",
  chips: "flex flex-wrap gap-2",
  chip: "rounded-lg border border-line bg-cream px-2.5 py-1 text-[12.5px] font-semibold text-ink/75",
  foot: "mt-auto flex items-center gap-4 border-t border-line pt-4 max-[560px]:gap-3 max-[560px]:pt-3.5",
  quote: "text-[14px] font-semibold text-terra hover:text-terra-deep",

  dots: "mt-3 flex items-center justify-center gap-2 max-[640px]:hidden",
  dot: "h-2 w-2 rounded-full bg-line transition-colors hover:bg-muted",
  dotActive: "h-2 w-6 rounded-full bg-terra transition-all",
} as const;

export default styles;

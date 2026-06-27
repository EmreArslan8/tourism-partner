/* Showcase — tam genişlikte tek-tek kayan carousel (sol galeri / sağ bilgi). */
const styles = {
  head: "mb-4 flex items-end justify-between gap-4 max-[560px]:mb-[9.6px] max-[560px]:gap-[12.8px] [@media(max-height:720px)]:mb-2.5",
  copy: "section-copy",
  eyebrow: "eyebrow mb-2 text-muted max-[560px]:mb-[6.4px] [@media(max-height:720px)]:mb-1",
  title: "heading-section text-ink [@media(max-height:720px)]:text-[20px]",
  // Kısa ekranlarda alt açıklamayı gizle — galeriye yer açar.
  sub: "section-desc max-w-[52ch] [@media(max-height:720px)]:hidden",
  nav: "flex items-center gap-2 max-[560px]:gap-[6.4px]",
  arrow:
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink " +
    "transition-all duration-200 hover:-translate-y-0.5 hover:border-terra hover:text-terra " +
    "max-[560px]:h-8 max-[560px]:w-8 max-[560px]:[&_svg]:h-[14.4px] max-[560px]:[&_svg]:w-[14.4px]",

  viewport: "overflow-hidden",
  track: "flex transition-transform duration-500 ease-brand",
  slide: "min-w-full px-0.5 py-1 max-[560px]:px-[1.6px] max-[560px]:py-[3.2px]",
  panel:
    "grid grid-cols-[1.1fr_1fr] gap-5 " +
    "max-[860px]:grid-cols-1 max-[860px]:gap-0 max-[860px]:overflow-hidden max-[860px]:rounded-card-lg " +
    "max-[860px]:border max-[860px]:border-line max-[860px]:shadow-card",

  /* SOL — galeri (mobilde sabit ~3/2 oran ≈ %58 → kart her yükseklikte tutarlı ~60/40) */
  gallery:
    "relative min-h-[360px] overflow-hidden rounded-card-lg shadow-card " +
    "max-[860px]:min-h-[300px] max-[860px]:rounded-none max-[860px]:shadow-none " +
    "max-[640px]:min-h-0 max-[640px]:aspect-[3/2]",
  galleryImg: "object-cover",
  thumbs: "absolute inset-x-0 bottom-0 flex gap-2 p-3 max-[640px]:hidden",
  // Mobil: galeri swipe nokta göstergesi
  galleryDots:
    "pointer-events-none absolute inset-x-0 bottom-0 hidden items-center justify-center gap-1.5 p-3 " +
    "max-[640px]:flex",
  galleryDot: "h-1.5 w-1.5 rounded-full bg-white/50 transition-all",
  galleryDotActive: "h-1.5 w-4 rounded-full bg-white transition-all",
  thumb:
    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-white/60 opacity-80 " +
    "transition hover:opacity-100 max-[560px]:h-[35.2px] max-[560px]:w-[51.2px]",
  thumbActive:
    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-white opacity-100 " +
    "shadow-[0_6px_16px_-6px_rgba(0,0,0,.6)] max-[560px]:h-[35.2px] max-[560px]:w-[51.2px]",

  /* SAĞ — bilgiler (ayrı box) */
  info:
    "flex flex-col gap-3 rounded-card-lg border border-line bg-paper p-7 shadow-card " +
    "max-[860px]:rounded-none max-[860px]:border-0 max-[860px]:shadow-none max-[560px]:gap-[6.4px] max-[560px]:p-[11.2px]",
  infoTop: "flex flex-wrap items-center gap-2.5 max-[560px]:gap-[4.8px]",
  cat: "label-pill rounded-full bg-cream-deep px-3 py-1 text-brand max-[560px]:px-2 max-[560px]:py-[3.2px]",
  verified:
    "label-pill inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 " +
    "max-[560px]:gap-[3.2px] max-[560px]:px-2 max-[560px]:py-[3.2px] max-[560px]:[&_svg]:h-[10.4px] max-[560px]:[&_svg]:w-[10.4px]",
  name: "heading-card text-ink",
  meta: "meta-text flex flex-wrap items-center gap-3 max-[560px]:gap-[6.4px]",
  metaItem: "inline-flex items-center gap-1.5 max-[560px]:gap-[4.8px]",
  metaIcon: "h-4 w-4 text-muted max-[560px]:h-[12.8px] max-[560px]:w-[12.8px]",
  metaDot: "h-1 w-1 rounded-full bg-line max-[560px]:h-[3.2px] max-[560px]:w-[3.2px]",
  stars: "rating-star-text text-gold",
  ratingNum: "font-bold text-ink",
  reviews: "meta-text text-muted",
  desc: "body-muted line-clamp-2 text-ink/70 max-[560px]:line-clamp-2",
  services: "flex flex-col gap-2 max-[560px]:hidden",
  servicesLabel: "eyebrow text-muted",
  chips: "flex flex-wrap gap-2",
  chip: "meta-text rounded-lg border border-line bg-cream px-2.5 py-1 font-semibold text-ink/75",
  foot:
    "mt-auto flex items-center gap-4 border-t border-line pt-4 " +
    "max-[560px]:justify-between max-[560px]:gap-[9.6px] max-[560px]:pt-[9.6px]",
  quote:
    "inline-flex items-center justify-center rounded-button border border-line px-4 py-[9px] text-[13.5px] font-semibold text-terra " +
    "transition-colors hover:border-terra hover:text-terra-deep " +
    "max-[560px]:px-[12.8px] max-[560px]:py-[7.2px] max-[560px]:text-[10.8px]",

  dots: "mt-3 flex items-center justify-center gap-2 max-[640px]:hidden",
  dot: "h-2 w-2 rounded-full bg-line transition-colors hover:bg-muted",
  dotActive: "h-2 w-6 rounded-full bg-terra transition-all",
} as const;

export default styles;

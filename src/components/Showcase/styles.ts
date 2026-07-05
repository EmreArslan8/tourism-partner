/* Showcase — tam genişlikte tek-tek kayan carousel (sol galeri / sağ bilgi). */
const styles = {
  head: "mb-4 flex items-end justify-between gap-4 max-[560px]:mb-[9.6px] max-[560px]:gap-[12.8px] [@media(max-height:720px)]:mb-2.5",
  copy: "section-copy",
  eyebrow: "eyebrow mb-2 text-brand/75 max-[560px]:mb-[6.4px] [@media(max-height:720px)]:mb-1",
  title: "heading-section text-ink [@media(max-height:720px)]:text-[20px]",
  // Kısa ekranlarda alt açıklamayı gizle — galeriye yer açar.
  sub: "section-desc max-w-[52ch] text-ink/70 [@media(max-height:720px)]:hidden",
  nav: "flex items-center gap-2 max-[560px]:gap-[6.4px]",
  arrow:
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink " +
    "transition-all duration-200 hover:-translate-y-0.5 hover:border-terra hover:text-terra " +
    "max-[560px]:h-8 max-[560px]:w-8 max-[560px]:[&_svg]:h-[14.4px] max-[560px]:[&_svg]:w-[14.4px]",

  viewport: "overflow-hidden",
  track: "flex transition-transform duration-500 ease-brand",
  slide: "min-w-full px-0.5 py-1 max-[560px]:px-[1.6px] max-[560px]:py-0",
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
  placeholder:
    "grid h-full min-h-[360px] place-items-center text-[13px] font-bold text-white/90 " +
    "max-[860px]:min-h-[300px] max-[640px]:min-h-0 max-[640px]:aspect-[3/2]",
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
    "max-[860px]:rounded-none max-[860px]:border-0 max-[860px]:shadow-none max-[560px]:gap-2 max-[560px]:p-4",
  infoTop: "flex flex-wrap items-center gap-2.5 max-[560px]:gap-1.5",
  cat:
    "label-pill rounded-full bg-cream-deep px-3 py-1 text-brand " +
    "max-[560px]:px-2.5 max-[560px]:py-1 max-[560px]:text-[10.5px] max-[560px]:leading-none",
  verified:
    "label-pill inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 " +
    "max-[560px]:gap-1 max-[560px]:px-2.5 max-[560px]:py-1 max-[560px]:text-[10.5px] max-[560px]:leading-none " +
    "max-[560px]:[&_svg]:h-3 max-[560px]:[&_svg]:w-3",
  name: "heading-card text-ink max-[560px]:text-[1.08rem] max-[560px]:leading-[1.18]",
  meta:
    "flex flex-wrap items-center gap-2.5 text-[13px] font-semibold leading-tight text-ink/70 " +
    "max-[560px]:gap-x-2 max-[560px]:gap-y-0.5 max-[560px]:text-[12px] max-[560px]:leading-[1.3]",
  metaItem: "inline-flex min-w-0 items-center gap-1.5 max-[560px]:gap-1",
  metaIcon: "h-4 w-4 shrink-0 text-brand/60 max-[560px]:h-3.5 max-[560px]:w-3.5",
  metaDot: "h-1 w-1 rounded-full bg-line max-[560px]:h-[3.2px] max-[560px]:w-[3.2px]",
  stars: "rating-star-text text-gold",
  ratingNum: "font-bold text-ink",
  reviews: "text-[12.5px] font-semibold text-ink/58 max-[560px]:text-[11.5px] max-[560px]:leading-[1.3]",
  desc:
    "body-muted line-clamp-2 text-ink/70 " +
    "max-[560px]:line-clamp-2 max-[560px]:text-[14px] max-[560px]:leading-[1.45]",
  services: "flex flex-col gap-2.5 max-[560px]:hidden",
  servicesLabel:
    "text-[12px] font-extrabold leading-none tracking-normal text-ink/72",
  chips: "flex flex-wrap gap-1.5",
  chip:
    "rounded-[8px] border border-line/80 bg-[#f7f9ff] px-2.5 py-1.5 text-[12px] font-bold leading-none text-ink/72",
  foot:
    "mt-auto flex items-center gap-4 border-t border-line pt-4 " +
    "max-[560px]:grid max-[560px]:grid-cols-[1fr_auto] max-[560px]:items-center max-[560px]:gap-2 max-[560px]:pt-[9.6px] " +
    "max-[560px]:[&_.btn]:min-h-10 max-[560px]:[&_.btn]:px-4 max-[560px]:[&_.btn]:py-2 max-[560px]:[&_.btn]:text-[13px]",
  quote:
    "inline-flex items-center justify-center rounded-button border border-line px-4 py-[9px] text-[13.5px] font-semibold text-terra " +
    "transition-colors hover:border-terra hover:text-terra-deep " +
    "max-[560px]:min-h-10 max-[560px]:px-4 max-[560px]:py-2 max-[560px]:text-[13px]",

  dots: "mt-3 flex items-center justify-center gap-2 max-[640px]:hidden",
  dot: "h-2 w-2 rounded-full bg-line transition-colors hover:bg-muted",
  dotActive: "h-2 w-6 rounded-full bg-terra transition-all",
} as const;

export default styles;

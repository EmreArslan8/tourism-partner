/* Showcase — tam genişlikte tek-tek kayan carousel (sol galeri / sağ bilgi). */
const styles = {
  head: "mb-4 flex items-end justify-between gap-4 min-[1440px]:mb-6 min-[1800px]:mb-7 max-[560px]:mb-[9.6px] max-[560px]:gap-[12.8px] [@media(max-height:720px)]:mb-2.5",
  copy: "section-copy",
  /* Koyu (sapphire degrade) zemin üstünde başlıklar beyaz. */
  eyebrow: "eyebrow mb-2 !text-[#9db4ff] max-[560px]:mb-[6.4px] [@media(max-height:720px)]:mb-1",
  title: "heading-section text-white [@media(max-height:720px)]:text-[20px]",
  // Kısa ekranlarda alt açıklamayı gizle — galeriye yer açar.
  sub: "section-desc max-w-[52ch] !text-[#c7d3f0] [@media(max-height:720px)]:hidden",
  nav: "flex items-center gap-2 max-[560px]:gap-[6.4px]",
  arrow:
    "grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/95 text-sapphire-deep " +
    "shadow-[0_12px_28px_-18px_rgba(0,0,0,.7)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white hover:text-sapphire " +
    "min-[1440px]:h-12 min-[1440px]:w-12 min-[1800px]:h-14 min-[1800px]:w-14 " +
    "max-[560px]:h-8 max-[560px]:w-8 max-[560px]:[&_svg]:h-[14.4px] max-[560px]:[&_svg]:w-[14.4px]",

  viewport: "overflow-hidden",
  track: "flex transition-transform duration-500 ease-brand",
  slide: "min-w-full px-0.5 py-1 max-[560px]:px-[1.6px] max-[560px]:py-0",
  panel:
    "grid grid-cols-[1.1fr_1fr] gap-5 " +
    "min-[1440px]:gap-7 min-[1800px]:gap-8 " +
    "max-[860px]:grid-cols-1 max-[860px]:gap-0 max-[860px]:overflow-hidden max-[860px]:rounded-card-lg " +
    "max-[860px]:border max-[860px]:border-line max-[860px]:shadow-card",

  /* SOL — galeri (mobilde yükseklik viewport'a bağlı: dvh → kısa ekranda küçülür,
     böylece kart + CTA aynı 100dvh panele sığar, alttan kırpılmaz) */
  gallery:
    "relative min-h-[360px] overflow-hidden rounded-card-lg shadow-[0_26px_70px_-36px_rgba(0,0,0,.88)] ring-1 ring-white/15 " +
    "min-[1440px]:min-h-[460px] min-[1800px]:min-h-[520px] " +
    "max-[860px]:min-h-[300px] max-[860px]:rounded-none max-[860px]:shadow-none " +
    "max-[640px]:min-h-0 max-[640px]:h-[34dvh]",
  galleryImg: "object-cover",
  premium: "absolute left-4 top-4 z-[3]",
  placeholder:
    "grid h-full min-h-[360px] place-items-center text-[13px] font-bold text-white/90 " +
    "min-[1440px]:min-h-[460px] min-[1800px]:min-h-[520px] " +
    "max-[860px]:min-h-[300px] max-[640px]:min-h-0",
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
    "flex flex-col gap-3 rounded-card-lg border border-white/30 bg-white/[.94] p-6 shadow-[0_26px_70px_-38px_rgba(0,0,0,.78)] backdrop-blur-xl " +
    "min-[1440px]:gap-4 min-[1440px]:p-8 min-[1800px]:gap-5 min-[1800px]:p-9 " +
    "max-[860px]:rounded-none max-[860px]:border-0 max-[860px]:shadow-none max-[560px]:gap-1.5 max-[560px]:p-3.5",
  name:
    "font-display text-[28px] font-semibold leading-[1.12] tracking-[0] text-ink " +
    "min-[1440px]:text-[34px] min-[1800px]:text-[38px] " +
    "max-[980px]:text-[25px] max-[560px]:text-[1.08rem] max-[560px]:leading-[1.12]",
  categoryText:
    "-mt-1 text-[13px] font-semibold leading-tight text-brand/72 " +
    "max-[560px]:mt-0 max-[560px]:text-[12px]",
  meta:
    "flex flex-wrap items-center gap-2.5 text-[13px] font-semibold leading-tight text-ink/62 " +
    "max-[560px]:gap-x-2 max-[560px]:gap-y-0.5 max-[560px]:text-[12px] max-[560px]:leading-[1.3]",
  metaItem: "inline-flex min-w-0 items-center gap-1.5 max-[560px]:gap-1",
  metaIcon: "h-4 w-4 shrink-0 text-brand/60 max-[560px]:h-3.5 max-[560px]:w-3.5",
  metaDot: "h-1 w-1 rounded-full bg-line/90 max-[560px]:h-[3.2px] max-[560px]:w-[3.2px]",
  stars: "rating-star-text text-star",
  ratingNum: "font-bold text-ink",
  reviews: "text-[12.5px] font-semibold text-ink/58 max-[560px]:text-[11.5px] max-[560px]:leading-[1.3]",
  desc:
    "body-muted line-clamp-2 max-w-[56ch] text-ink/68 " +
    "max-[560px]:line-clamp-2 max-[560px]:text-[13px] max-[560px]:leading-[1.35]",
  services: "flex flex-col gap-3 max-[560px]:hidden",
  servicesLabel:
    "text-[14px] font-semibold leading-none tracking-[0] text-ink/78",
  chips: "flex flex-wrap gap-2",
  chip:
    "inline-flex items-center rounded-full bg-[#e8eefc] px-3 py-1.5 text-[13px] font-semibold leading-none text-[#183b82] ring-1 ring-sapphire/10",
  foot:
    "mt-auto flex items-center gap-3 border-t border-line/90 pt-4 " +
    "max-[560px]:mt-1 max-[560px]:grid max-[560px]:grid-cols-2 max-[560px]:items-center max-[560px]:gap-2 max-[560px]:border-t-0 max-[560px]:pt-1.5",
  detailButton:
    "h-11 w-[156px] rounded-[10px] px-5 text-[14px] font-semibold shadow-[0_14px_30px_-22px_rgba(15,59,176,.9)] max-[560px]:h-9 max-[560px]:w-full max-[560px]:text-[13px]",
  quote:
    "inline-flex h-11 w-[156px] items-center justify-center rounded-[10px] border border-line bg-white px-5 text-[14px] font-semibold text-terra " +
    "transition-colors hover:border-terra hover:bg-cream/60 hover:text-terra-deep " +
    "max-[560px]:h-9 max-[560px]:w-full max-[560px]:border-terra/45 max-[560px]:bg-cream/50 max-[560px]:px-4 max-[560px]:text-[13px] max-[560px]:font-bold",
} as const;

export default styles;

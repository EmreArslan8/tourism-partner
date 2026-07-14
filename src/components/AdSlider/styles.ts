/* AdSlider — sponsorlu banner carousel (landing gelir alanı). */
const styles = {
  section: "flex flex-col gap-3",
  viewport: "overflow-hidden rounded-card-lg shadow-card",
  track: "flex transition-transform duration-500 ease-brand",
  slide:
    "group relative flex min-w-full items-center gap-5 overflow-hidden px-7 py-6 text-white sm:px-12 " +
    "h-[200px] sm:h-[230px] max-[560px]:flex-col max-[560px]:items-start max-[560px]:justify-end max-[560px]:gap-2",
  img: "object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]",
  shade:
    "pointer-events-none absolute inset-0 " +
    "bg-[linear-gradient(90deg,rgba(7,11,42,.9)_0%,rgba(7,11,42,.6)_45%,rgba(7,11,42,.15)_100%)]",
  tag:
    "absolute right-4 top-4 z-10 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] " +
    "font-bold uppercase tracking-[.12em] text-white/90 backdrop-blur",
  body: "relative z-10 flex-1",
  title: "heading-panel text-white [text-shadow:0_2px_16px_rgba(0,0,0,.5)]",
  sub: "body-small mt-1 !text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,.5)]",
  cta:
    "relative z-10 inline-flex shrink-0 items-center gap-2 rounded-pill bg-white px-5 py-2.5 text-[14px] font-bold text-brand " +
    "transition-transform duration-200 ease-brand group-hover:translate-x-0.5",
  dots: "flex items-center justify-center gap-2",
  dot: "h-2 w-2 rounded-full bg-line transition-colors hover:bg-muted",
  dotActive: "h-2 w-5 rounded-full bg-terra transition-all",
} as const;

export default styles;

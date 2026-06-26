/* Regions — görsel kapaklı popüler bölge kartları (SEO + hızlı arama). */
const styles = {
  section: "py-2 max-[560px]:flex max-[560px]:min-h-0 max-[560px]:flex-1 max-[560px]:flex-col",
  head: "mb-7 max-[560px]:mb-4 max-[560px]:shrink-0",
  eyebrow: "eyebrow mb-2",
  title: "heading-section text-ink",
  sub: "body-muted mt-2 max-w-[60ch]",
  grid:
    "grid grid-cols-4 gap-4 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2 max-[560px]:gap-2.5 " +
    "max-[560px]:min-h-0 max-[560px]:flex-1 max-[560px]:grid-rows-4",
  card:
    "group relative block aspect-[4/3] overflow-hidden rounded-card shadow-card " +
    "transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-pop " +
    "max-[560px]:aspect-auto max-[560px]:h-full",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.08]",
  shade:
    "pointer-events-none absolute inset-0 " +
    "bg-[linear-gradient(180deg,rgba(7,9,42,0)_38%,rgba(7,9,42,.35)_62%,rgba(7,9,42,.85)_100%)]",
  body: "absolute inset-x-0 bottom-0 p-4 max-[560px]:p-3",
  city: "text-[18px] font-semibold leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,.5)] max-[560px]:text-[14px]",
  count: "mt-0.5 text-[12.5px] font-medium text-white/80 max-[560px]:text-[11px]",
} as const;

export default styles;

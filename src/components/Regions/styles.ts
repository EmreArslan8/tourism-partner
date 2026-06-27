/* Regions — görsel kapaklı popüler bölge kartları (SEO + hızlı arama). */
const styles = {
  // ≤1024 (tablet + mobil): paneli dikeyde doldur — kartlar eşit yükseklikte (auto-rows-fr) gerilir.
  section: "py-2 max-[1024px]:flex max-[1024px]:min-h-0 max-[1024px]:flex-1 max-[1024px]:flex-col",
  head: "mb-7 max-[1024px]:shrink-0 max-[560px]:mb-4",
  eyebrow: "eyebrow mb-2",
  title: "heading-section text-ink",
  sub: "section-desc max-w-[60ch]",
  grid:
    "grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[560px]:gap-2.5 " +
    "max-[1024px]:min-h-0 max-[1024px]:flex-1 max-[1024px]:auto-rows-fr",
  card:
    "group relative block aspect-[4/3] overflow-hidden rounded-card shadow-card " +
    "transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-pop " +
    "max-[1024px]:aspect-auto max-[1024px]:h-full",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.08]",
  shade:
    "pointer-events-none absolute inset-0 " +
    "bg-[linear-gradient(180deg,rgba(7,9,42,0)_38%,rgba(7,9,42,.35)_62%,rgba(7,9,42,.85)_100%)]",
  body: "absolute inset-x-0 bottom-0 p-4 max-[560px]:p-3",
  city: "text-[18px] font-semibold leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,.5)] max-[560px]:text-[14px]",
  count: "mt-0.5 text-[12.5px] font-medium text-white/80 max-[560px]:text-[11px]",
} as const;

export default styles;

/* Regions — asset görselli popüler bölge kartları (SEO + hızlı arama). */
const styles = {
  // Her boyutta paneli dikeyde doldur — kartlar eşit yükseklikte (auto-rows-fr) gerilir,
  // böylece 2 sıra 100dvh panele taşmadan sığar.
  section: "flex min-h-0 flex-1 flex-col py-2",
  head: "mb-7 shrink-0 max-[560px]:mb-4",
  eyebrow: "eyebrow mb-2",
  title: "heading-section text-ink",
  sub: "section-desc max-w-[60ch]",
  grid:
    "grid min-h-0 flex-1 auto-rows-fr grid-cols-3 gap-4 " +
    "max-[1024px]:grid-cols-2 max-[560px]:gap-2.5",
  card:
    "group relative block h-full overflow-hidden rounded-card bg-[linear-gradient(135deg,#172178,#3542ee)] shadow-card ring-1 ring-black/5 " +
    "transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-pop",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.08]",
  regionMark:
    "absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/12 text-[18px] font-bold text-white backdrop-blur-sm",
  shade:
    "pointer-events-none absolute inset-0 " +
    "bg-[linear-gradient(180deg,rgba(7,9,42,.02)_18%,rgba(7,9,42,.25)_54%,rgba(7,9,42,.86)_100%)]",
  body: "absolute inset-x-0 bottom-0 p-4 max-[560px]:p-3",
  city: "text-[18px] font-semibold leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,.5)] max-[560px]:text-[14px]",
  count: "mt-0.5 text-[12.5px] font-medium text-white/80 max-[560px]:text-[11px]",
} as const;

export default styles;

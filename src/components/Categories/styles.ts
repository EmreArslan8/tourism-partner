/* Categories — beyaz yüzeyli kategori kartları (renkli medya alanı + rozet + ikon + açıklama + İncele).
   ≥641 (tablet/desktop): kartlar panele grid olarak yerleşir, dikey kart + İncele butonu.
   ≤640 (mobil): 2+2+1 grid; görsel üstünde kompakt başlık + sayı. */
const styles = {
  // Dikey ortalama/alan paylaşımı panel sarmalayıcısında yapılır; section yalnız doğal yüksekliğinde.
  section:
    "relative flex min-h-0 w-full shrink-0 flex-col justify-start gap-7 py-0 " +
    "max-[1100px]:gap-5 max-[640px]:h-full max-[640px]:min-h-0 max-[640px]:flex-1 max-[640px]:gap-3",
  head: "flex items-end justify-between gap-4 max-[640px]:shrink-0",
  headCopy: "section-copy max-w-[680px]",
  // Karusel okları kaldırıldı (mobilde de yatay karusel yok).
  navBtns: "hidden",
  navBtn:
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink shadow-card " +
    "transition-all duration-200 ease-brand active:scale-95 hover:border-brand hover:text-brand",
  eyebrow: "eyebrow mb-1.5 text-brand/65",
  headTitle: "heading-section text-ink",
  lead: "section-desc mt-2 max-w-[560px] font-medium",

  // Kart rayı: desktop'ta 1 büyük + sağda 2x2 kategori kompozisyonu.
  track:
    "grid grid-cols-[1.45fr_1fr_1fr] grid-rows-2 gap-4 " +
    "max-[1280px]:gap-3.5 max-[1100px]:grid-cols-4 max-[1100px]:grid-rows-2 max-[760px]:grid-cols-2 max-[760px]:grid-rows-none " +
    "[@media_(min-width:761px)_and_(max-width:1100px)_and_(orientation:portrait)]:grid-cols-2 " +
    "[@media_(min-width:761px)_and_(max-width:1100px)_and_(orientation:portrait)]:grid-rows-none " +
    "max-[640px]:h-[clamp(500px,70dvh,650px)] max-[640px]:min-h-0 max-[640px]:shrink-0 max-[640px]:grid-cols-2 max-[640px]:grid-rows-[1fr_1fr_.86fr] max-[640px]:gap-2.5",

  // Desktop'ta tile; mobilde tam genişlik banner kart.
  card:
    "group relative flex h-[260px] min-w-0 flex-col overflow-hidden rounded-card-lg bg-paper shadow-[0_12px_34px_-26px_rgba(7,9,42,.5)] ring-1 ring-black/5 " +
    "transition-all duration-300 ease-brand hover:-translate-y-1 hover:shadow-pop hover:ring-brand/20 " +
    "max-[1280px]:h-[248px] max-[1100px]:h-[218px] max-[760px]:h-[230px] " +
    "[@media_(min-width:761px)_and_(max-width:1100px)_and_(orientation:portrait)]:h-[clamp(190px,18dvh,232px)] " +
    "max-[640px]:block max-[640px]:!h-full max-[640px]:min-h-0 max-[640px]:w-full max-[640px]:last:col-span-2 max-[640px]:last:!h-full max-[640px]:active:scale-[.99]",
  cardFeatured:
    "col-span-1 row-span-2 h-[536px] max-[1280px]:h-[510px] " +
    "[&_.category-name]:!text-[1.24rem] [&_.category-desc]:!text-[14px] [&_.category-desc]:!leading-[1.5] [&_.category-body]:gap-3.5 [&_.category-body]:p-6 " +
    "max-[1100px]:col-span-2 max-[1100px]:row-span-2 max-[1100px]:h-[450px] max-[1100px]:[&_.category-name]:!text-[1.12rem] max-[1100px]:[&_.category-desc]:!text-[13px] max-[1100px]:[&_.category-body]:gap-2.5 max-[1100px]:[&_.category-body]:p-4 " +
    "[@media_(min-width:761px)_and_(max-width:1100px)_and_(orientation:portrait)]:col-span-2 " +
    "[@media_(min-width:761px)_and_(max-width:1100px)_and_(orientation:portrait)]:row-span-1 " +
    "[@media_(min-width:761px)_and_(max-width:1100px)_and_(orientation:portrait)]:h-[clamp(270px,28dvh,340px)] " +
    "max-[760px]:col-span-1 max-[760px]:row-span-1 max-[760px]:h-[230px] max-[760px]:[&_.category-name]:!text-[1.02rem] max-[760px]:[&_.category-desc]:!text-[12.8px] " +
    "max-[640px]:!h-full max-[640px]:[&_.category-body]:p-3",

  // Medya alanı: kategori için statik marketing görseli.
  media:
    "relative h-[65%] w-full shrink-0 overflow-hidden bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] " +
    "max-[640px]:absolute max-[640px]:inset-0 max-[640px]:h-full",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.06]",
  mediaIcon:
    "grid h-[72px] w-[72px] place-items-center rounded-2xl border border-white/70 bg-white/70 text-brand shadow-[0_18px_40px_-28px_rgba(15,23,42,.5)] " +
    "transition-transform duration-300 group-hover:scale-105 max-[1500px]:h-16 max-[1500px]:w-16 max-[1280px]:h-[60px] max-[1280px]:w-[60px] max-[640px]:hidden [&_svg]:!block [&_svg]:!h-9 [&_svg]:!w-9 max-[1500px]:[&_svg]:!h-8 max-[1500px]:[&_svg]:!w-8 max-[1280px]:[&_svg]:!h-7 max-[1280px]:[&_svg]:!w-7",
  // Mobil banner için alttan koyu degrade (yalnız mobil).
  shade:
    "pointer-events-none absolute inset-0 hidden max-[640px]:block " +
    "bg-[linear-gradient(180deg,rgba(7,9,42,0)_28%,rgba(7,9,42,.5)_62%,rgba(7,9,42,.9)_100%)]",
  badge:
    "absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full " +
    "border border-white/30 bg-white/15 px-3 py-1 text-[12.5px] font-semibold text-white backdrop-blur-md " +
    "shadow-[0_8px_24px_-12px_rgba(7,9,42,.6)] max-[640px]:hidden",
  badgeDot: "h-1.5 w-1.5 rounded-full bg-white",

  // Grid: dikey gövde; mobil: görsel üzerine alttan hizalı overlay (başlık+sayı solda, İNCELE sağda).
  body:
    "category-body flex h-[35%] min-h-0 flex-col justify-between gap-2 overflow-hidden p-4 " +
    "max-[640px]:absolute max-[640px]:inset-0 max-[640px]:z-10 max-[640px]:!h-full max-[640px]:flex-row max-[640px]:items-end " +
    "max-[640px]:justify-between max-[640px]:gap-2 max-[640px]:p-3.5",
  // Mobilde başlık+açıklama/sayıyı tek sütunda toplar (cta sağda kalsın diye).
  bodyMain: "flex min-w-0 flex-1 flex-col gap-2 max-[640px]:gap-0.5",
  titleRow: "flex items-center gap-2",
  icon: "shrink-0 text-brand max-[640px]:hidden",
  // text-card token'ı (≤2rem) kart için fazla büyük; burada daha dengeli, çoğunlukla tek satıra sığan ölçek.
  name:
    "category-name heading-card text-ink !text-[1.02rem] !leading-[1.22] " +
    "max-[640px]:!text-[0.95rem] max-[640px]:!leading-[1.08] max-[640px]:!text-white max-[640px]:[text-shadow:0_1px_10px_rgba(0,0,0,.45)]",
  desc:
    "category-desc section-desc !mt-0 min-h-0 overflow-hidden !text-[12.8px] !leading-[1.42] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] " +
    "[-webkit-line-clamp:2] max-[640px]:hidden",
  // Mobil banner: sağ altta kategori istatistiği (rozet metni).
  countMobile:
    "hidden max-[640px]:block max-[640px]:shrink-0 max-[640px]:self-end " +
    "text-[11.5px] font-semibold text-white [text-shadow:0_1px_8px_rgba(0,0,0,.55)]",

  cta:
    "inline-flex items-center gap-1.5 pt-1 text-[13.8px] font-semibold text-brand " +
    "transition-colors group-hover:text-ink max-[640px]:hidden",
  ctaArrow:
    "text-brand transition-transform duration-200 group-hover:translate-x-1",
} as const;

export default styles;

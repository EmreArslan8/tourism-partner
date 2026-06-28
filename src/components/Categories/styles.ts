/* Categories — beyaz yüzeyli kategori kartları (görsel + rozet + ikon + açıklama + İncele).
   ≥641 (tablet/desktop): kartlar panele grid olarak yerleşir, dikeyde ortalı, dikey kart + İncele butonu.
   ≤640 (mobil): alt alta dizili tam-görselli bannerlar — koyu degrade üzerine beyaz başlık + sayı, sağ altta İNCELE. */
const styles = {
  // Dikey ortalama/alan paylaşımı panel sarmalayıcısında yapılır; section yalnız doğal yüksekliğinde.
  section:
    "relative flex w-full flex-col gap-7 py-0 " +
    "max-[640px]:min-h-0 max-[640px]:flex-1 max-[640px]:gap-4",
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

  // Kart rayı: ≥1025 → satır başına 4 kart, 641-1024 → 2×2, ≤640 → alt alta dikey liste.
  track:
    "flex flex-wrap justify-center gap-5 " +
    "max-[1024px]:gap-4 " +
    "max-[640px]:min-h-0 max-[640px]:flex-1 max-[640px]:flex-col max-[640px]:flex-nowrap max-[640px]:justify-stretch max-[640px]:gap-3",

  // ≥1025: tek sıra 4'lü (basis ¼), 641-1024: 2×2 (basis ½), ≤640: tam genişlik görselli banner kart.
  card:
    "group relative flex min-w-0 flex-col overflow-hidden rounded-card-lg bg-paper shadow-card ring-1 ring-black/5 " +
    "transition-all duration-300 ease-brand hover:-translate-y-1 hover:shadow-pop hover:ring-brand/20 " +
    "min-[641px]:shrink-0 min-[641px]:grow-0 " +
    "min-[641px]:max-[1024px]:[flex-basis:calc((100%-1.2rem)/2)] " +
    "min-[1025px]:[flex-basis:calc((100%-4rem)/4)] " +
    "max-[640px]:block max-[640px]:h-auto max-[640px]:min-h-[104px] max-[640px]:flex-1 max-[640px]:w-full max-[640px]:active:scale-[.99]",

  // Görsel: grid'de üstte sabit yükseklik; mobilde kartı tamamen kaplar (banner).
  media:
    "relative w-full h-44 overflow-hidden max-[1024px]:h-40 " +
    "max-[640px]:absolute max-[640px]:inset-0 max-[640px]:h-full",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.06]",
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
    "flex min-h-0 flex-1 flex-col gap-2.5 p-5 " +
    "max-[640px]:absolute max-[640px]:inset-0 max-[640px]:z-10 max-[640px]:flex-row max-[640px]:items-end " +
    "max-[640px]:justify-between max-[640px]:gap-3 max-[640px]:p-4",
  // Mobilde başlık+açıklama/sayıyı tek sütunda toplar (cta sağda kalsın diye).
  bodyMain: "flex min-w-0 flex-col gap-2.5 max-[640px]:gap-0.5",
  titleRow: "flex items-center gap-2",
  icon: "shrink-0 text-brand max-[640px]:hidden",
  // text-card token'ı (≤2rem) kart için fazla büyük; burada daha dengeli, çoğunlukla tek satıra sığan ölçek.
  name:
    "heading-card text-ink !text-[1.25rem] !leading-[1.15] max-[1280px]:!text-[1.15rem] " +
    "max-[640px]:!text-[1.05rem] max-[640px]:!text-white max-[640px]:[text-shadow:0_1px_10px_rgba(0,0,0,.45)]",
  desc:
    "section-desc !mt-0 min-h-0 overflow-hidden text-muted [display:-webkit-box] [-webkit-box-orient:vertical] " +
    "[-webkit-line-clamp:2] max-[640px]:hidden",
  // Mobil banner: sağ altta kategori istatistiği (rozet metni).
  countMobile:
    "hidden max-[640px]:block max-[640px]:shrink-0 max-[640px]:self-end " +
    "text-[13px] font-semibold text-white [text-shadow:0_1px_8px_rgba(0,0,0,.55)]",

  cta:
    "btn btn-sm btn-block mt-auto pt-2.5 bg-ink text-white hover:-translate-y-px hover:bg-brand " +
    "max-[640px]:hidden",
  ctaArrow:
    "transition-transform duration-200 group-hover:translate-x-0.5",
} as const;

export default styles;

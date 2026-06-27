/* Categories — beyaz yüzeyli kategori kartları (görsel + rozet + ikon + açıklama + İncele).
   ≥641 (tablet/desktop): kartlar panele tek satır grid olarak yerleşir, dikeyde ortalı.
   ≤640 (mobil): yatay kaydırmalı tek satır (snap), kenardan kenara peek'li. */
const styles = {
  // Dikey ortalama/alan paylaşımı panel sarmalayıcısında yapılır; section yalnız doğal yüksekliğinde.
  section:
    "relative flex w-full flex-col gap-7 py-0 " +
    "max-[640px]:gap-5",
  head: "flex items-end justify-between gap-4 max-[640px]:shrink-0",
  headCopy: "section-copy max-w-[680px]",
  // Karusel okları — yalnızca mobilde görünür.
  navBtns: "hidden shrink-0 items-center gap-2 max-[640px]:flex",
  navBtn:
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink shadow-card " +
    "transition-all duration-200 ease-brand active:scale-95 hover:border-brand hover:text-brand",
  eyebrow: "eyebrow mb-1.5 text-brand/65",
  headTitle: "heading-section text-ink",
  lead: "section-desc mt-2 max-w-[560px] font-medium",

  // Kart rayı: desktop ≥1025 → satır başına 4 kart (5. kart ortalı alta sarar),
  // tablet 641-1024 → 3 kart, mobil ≤640 → yatay snap karuseli. Ortalanmış flex-wrap.
  track:
    "flex flex-wrap justify-center gap-5 " +
    "max-[1024px]:gap-4 " +
    "max-[640px]:flex-nowrap max-[640px]:justify-start max-[640px]:snap-x max-[640px]:snap-mandatory max-[640px]:gap-3.5 " +
    "max-[640px]:-mx-4 max-[640px]:overflow-x-auto max-[640px]:px-4 max-[640px]:pb-1 " +
    "max-[640px]:[scrollbar-width:none] max-[640px]:[&::-webkit-scrollbar]:hidden",

  // 4 kart yerleşimi: ≥1025 → tek sıra 4'lü (basis ¼), 641-1024 → 2×2 (basis ½, dikey alana yayılır),
  // ≤640 → 4/5 oranlı yatay karusel. Aynı satırdaki kartlar eşit yüksekliğe streç olur.
  card:
    "group flex min-w-0 flex-col overflow-hidden rounded-card-lg bg-paper shadow-card ring-1 ring-black/5 " +
    "transition-all duration-300 ease-brand hover:-translate-y-1 hover:shadow-pop hover:ring-brand/20 " +
    "min-[641px]:shrink-0 min-[641px]:grow-0 " +
    "min-[641px]:max-[1024px]:[flex-basis:calc((100%-1.2rem)/2)] " +
    "min-[1025px]:[flex-basis:calc((100%-4rem)/4)] " +
    "max-[640px]:aspect-[4/5] max-[640px]:w-[78%] max-[640px]:shrink-0 max-[640px]:snap-start",

  // Görsel: grid'de sabit yükseklik, mobilde kartın 3/5'i (flex-[3]).
  media:
    "relative w-full h-44 overflow-hidden max-[1024px]:h-40 " +
    "max-[640px]:h-auto max-[640px]:flex-[3] max-[640px]:min-h-0",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.06]",
  badge:
    "absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full " +
    "border border-white/30 bg-white/15 px-3 py-1 text-[12.5px] font-semibold text-white backdrop-blur-md " +
    "shadow-[0_8px_24px_-12px_rgba(7,9,42,.6)] max-[640px]:text-[11.5px]",
  badgeDot: "h-1.5 w-1.5 rounded-full bg-white",

  // Grid'de doğal yükseklik, mobilde kartın 2/5'i (flex-[2]). Ferah iç boşluk.
  body: "flex min-h-0 flex-1 flex-col gap-2.5 p-5 max-[640px]:flex-[2] max-[640px]:gap-2 max-[640px]:p-4",
  titleRow: "flex items-center gap-2",
  icon: "shrink-0 text-brand",
  // text-card token'ı (≤2rem) kart için fazla büyük; burada daha dengeli, çoğunlukla tek satıra sığan ölçek.
  name: "heading-card text-ink !text-[1.25rem] !leading-[1.15] max-[1280px]:!text-[1.15rem] max-[640px]:!text-[1.05rem]",
  desc:
    "section-desc !mt-0 min-h-0 overflow-hidden text-muted [display:-webkit-box] [-webkit-box-orient:vertical] " +
    "[-webkit-line-clamp:2] max-[640px]:[-webkit-line-clamp:3]",

  cta:
    "btn btn-sm btn-block mt-auto pt-2.5 bg-ink text-white hover:-translate-y-px hover:bg-brand " +
    "max-[640px]:btn-compact-sm max-[640px]:pt-0",
  ctaArrow:
    "transition-transform duration-200 group-hover:translate-x-0.5",
} as const;

export default styles;

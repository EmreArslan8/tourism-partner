/* SearchIntents — kategori panelinin ikinci bileşeni: "Popüler arama niyetleri".
   Acentelerin en sık aradığı hazır filtre rotalarına tek tıkla geçiş (chip'ler).
   ≥641: başlık solda, chip'ler sağda akar. ≤640: başlık üstte, chip'ler altta sarar. */
const styles = {
  section:
    "flex shrink-0 items-center justify-between gap-4 rounded-card border border-line bg-white px-4 py-3 " +
    "max-[900px]:items-start max-[900px]:gap-3 max-[640px]:hidden",

  copy: "min-w-[190px] shrink-0",
  eyebrow: "hidden",
  title: "text-[14px] font-bold leading-tight text-ink",
  sub: "hidden",

  chips: "flex min-w-0 flex-1 flex-nowrap justify-end gap-2 overflow-hidden",
  chip:
    "group inline-flex min-w-0 shrink items-center gap-1.5 rounded-pill border border-line bg-white px-3 py-1.5 " +
    "text-[12.5px] font-semibold text-ink/80 shadow-[0_8px_22px_-18px_rgba(7,9,42,.45)] transition-all duration-200 ease-brand " +
    "hover:-translate-y-px hover:border-brand hover:text-brand hover:shadow-pop " +
    "[&>span]:truncate",
  chipArrow: "text-muted transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:text-brand",
} as const;

export default styles;

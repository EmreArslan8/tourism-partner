/* SearchIntents — kategori panelinin ikinci bileşeni: "Popüler arama niyetleri".
   Acentelerin en sık aradığı hazır filtre rotalarına tek tıkla geçiş (chip'ler).
   ≥641: başlık solda, chip'ler sağda akar. ≤640: başlık üstte, chip'ler altta sarar. */
const styles = {
  section:
    "flex shrink-0 flex-col gap-4 rounded-card-lg border border-line bg-cream/60 p-5 " +
    "max-[900px]:p-4 " +
    "min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between min-[901px]:gap-6",

  copy: "min-w-0 max-[900px]:shrink-0",
  eyebrow: "eyebrow text-brand/65",
  title: "heading-card text-ink !text-[1.1rem] !leading-tight mt-1",
  sub: "section-desc !mt-1 text-muted",

  chips: "flex flex-wrap gap-2.5 min-[901px]:justify-end",
  chip:
    "group inline-flex items-center gap-1.5 rounded-pill border border-line bg-paper px-3.5 py-2 " +
    "text-[13.5px] font-semibold text-ink/80 shadow-card transition-all duration-200 ease-brand " +
    "hover:-translate-y-px hover:border-brand hover:text-brand hover:shadow-pop " +
    "max-[640px]:text-[12.5px]",
  chipArrow: "text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand",
} as const;

export default styles;

/* Cta — kutusuz, tam genişlik çağrı alanı. */
const styles = {
  section: "w-full",
  panel:
    "flex w-full flex-col gap-5 border-y border-line/80 py-6 " +
    "md:flex-row md:items-center md:justify-between " +
    "max-[560px]:gap-[12.8px] max-[560px]:px-[12.8px] max-[560px]:py-4",
  content: "section-copy min-w-0 max-w-3xl",
  title: "heading-panel text-brand",
  sub: "section-desc max-w-[62ch] max-[560px]:mt-[6.4px]",
  actions:
    "flex shrink-0 items-center gap-3 max-[560px]:w-full max-[560px]:gap-[9.6px]",
} as const;

export default styles;

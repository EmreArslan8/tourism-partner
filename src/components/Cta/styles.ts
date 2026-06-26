/* Cta — kutusuz, tam genişlik çağrı alanı. */
const styles = {
  section: "w-full",
  panel:
    "flex w-full flex-col gap-5 border-y border-line/80 py-6 " +
    "md:flex-row md:items-center md:justify-between " +
    "max-[560px]:gap-4 max-[560px]:py-5",
  content: "min-w-0 max-w-3xl",
  title: "heading-panel text-brand max-[560px]:text-[21px]",
  sub: "body-muted mt-2 max-w-[62ch] max-[560px]:mt-2 max-[560px]:text-[13.5px]",
  actions: "flex shrink-0 items-center gap-3 max-[560px]:w-full max-[560px]:gap-3",
} as const;

export default styles;

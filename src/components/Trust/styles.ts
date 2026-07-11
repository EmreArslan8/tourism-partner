/* Trust - tek satirlik kompakt guven bandi. */
const styles = {
  section: "w-full border-t border-white/15 pt-6 max-[560px]:pt-4",
  list:
    "flex w-full items-stretch justify-center gap-x-4 gap-y-3 " +
    "px-5 py-6 " +
    "max-[560px]:grid max-[560px]:grid-cols-3 max-[560px]:items-start max-[560px]:gap-1.5 max-[560px]:px-0 max-[560px]:py-4",
  item:
    "flex min-w-0 flex-1 flex-col items-center gap-3 px-3 py-2 text-center " +
    "max-[560px]:gap-2.5 max-[560px]:px-1 max-[560px]:py-2",
  icon: "grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-white/10 text-white ring-1 ring-white/15 max-[560px]:h-10 max-[560px]:w-10 max-[560px]:rounded-[10px] max-[560px]:[&_svg]:h-[20px] max-[560px]:[&_svg]:w-[20px]",
  body: "flex min-w-0 flex-wrap items-baseline justify-center gap-x-1.5 max-[560px]:block",
  itemTitle: "text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/90 max-[900px]:text-[11px] max-[560px]:flex max-[560px]:min-h-[2.4em] max-[560px]:items-center max-[560px]:justify-center max-[560px]:text-[9px] max-[560px]:leading-[1.2] max-[560px]:tracking-[.08em]",
  itemDesc: "text-[13px] font-medium leading-snug text-white/65 max-[900px]:text-[12.5px] max-[560px]:mt-1.5 max-[560px]:block max-[560px]:text-[9px] max-[560px]:leading-[1.35]",
} as const;

export default styles;

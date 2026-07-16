/* Trust - tek satirlik kompakt guven bandi. */
const styles = {
  section: "w-full border-t border-white/15 pt-6 max-[560px]:pt-4",
  list:
    "flex w-full items-stretch justify-center gap-x-4 gap-y-3 " +
    "px-5 py-6 " +
    "min-[1440px]:gap-x-7 min-[1440px]:py-8 min-[1800px]:gap-x-9 min-[1800px]:py-10 " +
    // Mobil: 3 sütun 9px'e sıkışıyordu — alt alta ikon-solda satırlar, okunur ölçü.
    "max-[560px]:grid max-[560px]:grid-cols-1 max-[560px]:gap-2 max-[560px]:px-0 max-[560px]:py-4",
  item:
    "flex min-w-0 flex-1 flex-col items-center gap-3 px-3 py-2 text-center " +
    "max-[560px]:flex-row max-[560px]:items-center max-[560px]:gap-3 max-[560px]:px-1 max-[560px]:py-1.5 max-[560px]:text-start",
  icon: "grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-white/10 text-white ring-1 ring-white/15 min-[1440px]:h-[52px] min-[1440px]:w-[52px] min-[1440px]:rounded-[14px] min-[1440px]:[&_svg]:h-[24px] min-[1440px]:[&_svg]:w-[24px] min-[1800px]:h-14 min-[1800px]:w-14 max-[560px]:h-12 max-[560px]:w-12 max-[560px]:rounded-[12px] max-[560px]:[&_svg]:h-[24px] max-[560px]:[&_svg]:w-[24px]",
  body: "flex min-w-0 flex-wrap items-baseline justify-center gap-x-1.5 max-[560px]:block",
  itemTitle: "text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/90 min-[1440px]:text-[13.5px] min-[1800px]:text-[14.5px] max-[900px]:text-[11px] max-[560px]:block max-[560px]:text-[12.5px] max-[560px]:leading-[1.25] max-[560px]:tracking-[.1em]",
  itemDesc: "text-[13px] font-medium leading-snug text-white/65 min-[1440px]:text-[14px] min-[1800px]:text-[15px] max-[900px]:text-[12.5px] max-[560px]:mt-1 max-[560px]:block max-[560px]:text-[13.5px] max-[560px]:leading-[1.4]",
} as const;

export default styles;

/* Categories — yatay "Kategoriye göz atın" kartları (ana sayfa). */
export const s = {
  section: "py-12",
  head: "mb-7 flex items-end justify-between gap-4",
  headTitle: "text-[clamp(24px,3vw,36px)]",
  more: "text-[14px] font-semibold text-terra hover:text-terra-deep",
  grid: "grid grid-cols-5 gap-4 max-[1100px]:grid-cols-3 max-[640px]:grid-cols-2",
  card:
    "group flex flex-col gap-3 rounded-[16px] border border-line bg-paper p-5 shadow-card " +
    "transition-transform duration-300 ease-brand hover:-translate-y-1 hover:shadow-pop",
  icon: "grid h-12 w-12 place-items-center rounded-[12px] transition-transform group-hover:scale-105",
  name: "text-[18px]",
  count: "text-[13px] text-muted",
} as const;

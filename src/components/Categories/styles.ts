/* Categories — yatay "Kategoriye göz atın" kartları (ana sayfa). */
export const styles= {
  section: "py-12 max-[640px]:py-9",
  head: "mb-7 flex items-end justify-between gap-4",
  headTitle: "text-[clamp(24px,3vw,36px)]",
  more: "text-[14px] font-semibold text-terra hover:text-terra-deep",
  grid:
    "grid grid-cols-5 gap-4 max-[1100px]:grid-cols-3 " +
    "max-[640px]:-mx-8 max-[640px]:flex max-[640px]:snap-x max-[640px]:gap-3 " +
    "max-[640px]:overflow-x-auto max-[640px]:px-8 max-[640px]:pb-3 max-[640px]:[scrollbar-width:none] max-[640px]:[&::-webkit-scrollbar]:hidden " +
    "max-[560px]:-mx-5 max-[560px]:px-5",
  card:
    "group flex flex-col gap-3 rounded-[16px] border border-line bg-paper p-5 shadow-card " +
    "transition-transform duration-300 ease-brand hover:-translate-y-1 hover:shadow-pop " +
    "max-[640px]:min-w-[168px] max-[640px]:snap-start max-[640px]:p-4",
  icon: "grid h-12 w-12 place-items-center rounded-[12px] transition-transform group-hover:scale-105 max-[640px]:h-10 max-[640px]:w-10",
  name: "text-[18px] max-[640px]:text-[16px]",
  count: "text-[13px] text-muted",
} as const;

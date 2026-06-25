/* Categories — görsel kapaklı modern kartlar ("Kategoriye göz atın"). */
 const styles= {
  section: "py-12 max-[640px]:py-9",
  head: "mb-8 flex items-end justify-between gap-4",
  eyebrow: "mb-2 block text-[12px] font-bold uppercase tracking-[.16em] text-muted",
  headTitle: "text-[clamp(24px,3vw,36px)] font-semibold text-ink",
  more: "inline-flex items-center gap-1.5 text-[14px] font-semibold text-terra transition-colors hover:text-terra-deep",
  grid:
    "grid grid-cols-5 gap-4 max-[1100px]:grid-cols-3 " +
    "max-[640px]:-mx-8 max-[640px]:flex max-[640px]:snap-x max-[640px]:gap-3 " +
    "max-[640px]:overflow-x-auto max-[640px]:px-8 max-[640px]:pb-3 max-[640px]:[scrollbar-width:none] max-[640px]:[&::-webkit-scrollbar]:hidden " +
    "max-[560px]:-mx-5 max-[560px]:px-5",
  card:
    "group relative block aspect-[3/4] overflow-hidden rounded-[20px] shadow-card " +
    "transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-pop " +
    "max-[640px]:min-w-[180px] max-[640px]:snap-start max-[640px]:aspect-[4/5]",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.07]",
  shade:
    "pointer-events-none absolute inset-0 " +
    "bg-[linear-gradient(180deg,rgba(7,9,42,0)_28%,rgba(7,9,42,.3)_56%,rgba(7,9,42,.88)_100%)]",
  arrow:
    "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/15 " +
    "text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
  body: "absolute inset-x-0 bottom-0 p-4",
  name: "text-[19px] font-semibold leading-tight text-white max-[640px]:text-[16px]",
  count: "mt-1 text-[13px] font-medium text-white/75",
} as const;

export default styles;

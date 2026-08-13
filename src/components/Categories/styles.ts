/* Categories - popular-categories style image cards. */
const styles = {
  section:
    "relative mx-auto w-full max-w-[1500px] py-0 min-[1440px]:max-w-[1680px] min-[1800px]:max-w-[1780px]",
  head: "mb-5 flex items-end justify-between gap-4 max-[640px]:mb-3",
  headCopy: "section-copy max-w-[700px]",
  eyebrow: "eyebrow mb-1.5 !text-brand/75 max-[640px]:hidden",
  headTitle: "heading-section text-ink",
  lead: "section-desc mt-2 max-w-[560px] font-medium !text-muted max-[640px]:hidden",

  grid:
    "grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[1100px]:gap-4 max-[640px]:grid-cols-2 max-[640px]:gap-2.5",
  card:
    "group relative block min-w-0 overflow-hidden rounded-[12px] border border-line/70 bg-paper text-center shadow-card outline-none " +
    "transition-[background-color,border-color,box-shadow,transform] duration-300 ease-brand hover:-translate-y-1 hover:border-brand/25 hover:shadow-pop " +
    "focus-visible:ring-2 focus-visible:ring-sapphire/35 dark:border-white/10 dark:bg-[#211b45] dark:shadow-[0_12px_30px_-26px_rgba(0,0,0,.92)] " +
    "dark:hover:border-white/20 dark:hover:bg-[#292252] dark:hover:shadow-[0_22px_52px_-28px_rgba(109,40,217,.48)]",
  media:
    "relative block aspect-[16/9] w-full overflow-hidden bg-cream max-[640px]:aspect-[4/3] " +
    "before:absolute before:inset-0 before:z-[1] before:bg-transparent before:content-[''] dark:before:bg-black/[.08] " +
    "after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgba(10,8,33,0)_48%,rgba(10,8,33,.38)_100%)] after:content-['']",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.045]",
  count:
    "absolute end-3 top-3 z-[2] rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold text-brand shadow-card backdrop-blur-md " +
    "dark:bg-[#0d0a2f]/85 dark:text-white/75 dark:ring-1 dark:ring-white/10 max-[640px]:end-2 max-[640px]:top-2 max-[640px]:px-2 max-[640px]:text-[10px]",
  iconBadge:
    "relative z-[2] mx-auto -mt-6 grid h-12 w-12 place-items-center rounded-full border-[4px] border-paper " +
    "bg-sapphire text-paper shadow-[0_14px_26px_-15px_rgba(76,29,149,.8)] dark:border-[#211b45] dark:bg-[#6d28d9] dark:group-hover:border-[#292252] " +
    "transition-[transform,box-shadow] duration-300 ease-brand group-hover:scale-105 group-hover:shadow-[0_16px_30px_-13px_rgba(109,40,217,.75)] " +
    "max-[640px]:-mt-[18px] max-[640px]:h-9 max-[640px]:w-9 max-[640px]:border-[3px]",
  icon: "h-6 w-6 object-contain max-[640px]:h-[18px] max-[640px]:w-[18px]",
  transferIcon: "h-6 w-8 object-contain max-[640px]:h-[18px] max-[640px]:w-[22px]",
  gastronomyIcon: "h-7 w-7 object-contain max-[640px]:h-[19px] max-[640px]:w-[19px]",
  cardBody: "block px-[18px] pb-[18px] pt-2 max-[640px]:px-2.5 max-[640px]:pb-3 max-[640px]:pt-1.5",
  name:
    "block truncate font-body text-[17px] font-semibold leading-tight tracking-normal text-ink dark:text-white " +
    "min-[1440px]:text-[18px] max-[640px]:text-[13.5px]",
  desc:
    "mx-auto mt-2 block max-w-[34ch] overflow-hidden text-[13.5px] font-medium leading-[1.45] text-muted dark:text-white/[.92] " +
    "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] max-[640px]:mt-1 max-[640px]:text-[11px] max-[640px]:leading-4",
} as const;

export default styles;

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
    "group relative block min-w-0 overflow-hidden rounded-[8px] border border-line bg-paper text-center shadow-card outline-none " +
    "transition-[border-color,box-shadow,transform] duration-200 ease-brand hover:-translate-y-0.5 hover:border-sapphire/35 hover:shadow-pop " +
    "focus-visible:ring-2 focus-visible:ring-sapphire/35",
  media:
    "relative block aspect-[16/9] w-full overflow-hidden bg-cream max-[640px]:aspect-[4/3] " +
    "after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(36,17,63,0)_50%,rgba(36,17,63,.18)_100%)] after:content-['']",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.045]",
  count:
    "absolute end-3 top-3 z-[2] rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold text-brand shadow-card backdrop-blur max-[640px]:end-2 max-[640px]:top-2 max-[640px]:px-2 max-[640px]:text-[10px]",
  iconBadge:
    "relative z-[2] mx-auto -mt-7 grid h-14 w-14 place-items-center rounded-full border-[5px] border-paper " +
    "bg-sapphire text-paper shadow-[0_16px_28px_-16px_rgba(76,29,149,.8)] " +
    "transition-transform duration-200 ease-brand group-hover:scale-105 max-[640px]:-mt-5 max-[640px]:h-10 max-[640px]:w-10 max-[640px]:border-[4px]",
  icon: "h-7 w-7 object-contain max-[640px]:h-5 max-[640px]:w-5",
  transferIcon: "h-7 w-9 object-contain max-[640px]:h-5 max-[640px]:w-6",
  gastronomyIcon: "h-8 w-8 object-contain max-[640px]:h-5 max-[640px]:w-5",
  cardBody: "block px-4 pb-5 pt-2 max-[640px]:px-2.5 max-[640px]:pb-3 max-[640px]:pt-1.5",
  name:
    "block truncate font-body text-[17px] font-semibold leading-tight tracking-normal text-ink " +
    "min-[1440px]:text-[18px] max-[640px]:text-[13.5px]",
  desc:
    "mx-auto mt-2 block max-w-[32ch] overflow-hidden text-[13px] font-medium leading-5 text-muted " +
    "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] max-[640px]:mt-1 max-[640px]:text-[11px] max-[640px]:leading-4",
} as const;

export default styles;

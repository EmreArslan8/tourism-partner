/* Categories — görsel kapaklı modern kartlar ("Kategoriye göz atın"). */
const styles = {
  section:
    "relative flex h-full min-h-0 w-full flex-col justify-center gap-8 py-0 max-[900px]:h-auto max-[900px]:justify-start max-[640px]:gap-8 max-[640px]:py-0",
  topGroup: "flex min-h-0 flex-col gap-5 max-[640px]:gap-4",
  head: "flex items-end justify-between gap-5",
  headCopy: "max-w-[680px]",
  eyebrow: "eyebrow mb-1.5 text-brand/65",
  headTitle: "heading-section text-ink",
  lead: "mt-2 max-w-[560px] text-[14px] font-medium leading-relaxed text-muted max-[640px]:text-[13.5px]",
  grid:
    "grid min-h-0 grid-cols-12 grid-rows-2 gap-5 max-[1180px]:grid-cols-6 max-[1180px]:grid-rows-none " +
    "max-[640px]:grid-cols-2 max-[640px]:grid-rows-none max-[640px]:gap-3",
  card:
    "group relative col-span-3 block min-h-[170px] overflow-hidden rounded-card-lg shadow-card ring-1 ring-black/5 " +
    "transition-all duration-300 ease-brand first:col-span-6 first:row-span-2 first:min-h-[356px] first:rounded-card-lg " +
    "hover:-translate-y-1 hover:shadow-pop hover:ring-brand/20 " +
    "max-[1180px]:col-span-3 max-[1180px]:min-h-[220px] max-[1180px]:first:col-span-6 max-[1180px]:first:row-span-1 max-[1180px]:first:min-h-[260px] " +
    "max-[820px]:col-span-6 max-[820px]:min-h-[210px] max-[820px]:first:col-span-6 " +
    "max-[640px]:col-span-1 max-[640px]:min-h-0 max-[640px]:aspect-[4/3] max-[640px]:rounded-card " +
    "max-[640px]:first:col-span-2 max-[640px]:first:row-span-1 max-[640px]:first:aspect-[2/1] max-[640px]:first:min-h-0",
  img: "object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.07]",
  shade:
    "pointer-events-none absolute inset-0 " +
    "bg-[linear-gradient(180deg,rgba(7,9,42,.04)_0%,rgba(7,9,42,.18)_42%,rgba(7,9,42,.86)_100%)] after:absolute after:inset-x-0 after:bottom-0 after:h-1/2 after:bg-[radial-gradient(circle_at_18%_100%,rgba(63,102,234,.38),transparent_54%)]",
  arrow:
    "absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/16 " +
    "text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 max-[640px]:opacity-100",
  body: "absolute inset-x-0 bottom-0 p-4 max-[640px]:p-4",
  name:
    "mt-2 max-w-[11ch] text-[22px] font-semibold leading-[1.03] text-white max-[640px]:text-[18px]",
  sidePanel:
    "relative flex shrink-0 flex-col gap-4 overflow-visible bg-transparent px-0 py-0 " +
    "max-[640px]:gap-2.5",
  panelTitle: "text-[24px] font-semibold leading-tight tracking-heading-soft text-ink max-[640px]:text-[22px]",
  panelIntentList:
    "grid min-w-0 grid-cols-4 gap-4 max-[1180px]:grid-cols-4 max-[760px]:grid-cols-2 max-[640px]:gap-2.5",
  panelIntentItem:
    "group relative grid min-h-[66px] min-w-0 grid-cols-[minmax(0,1fr)_18px] items-center gap-3 overflow-hidden rounded-card border border-white/70 bg-white/42 px-4 " +
    "text-[14px] font-bold leading-[1.1] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_18px_38px_-30px_rgba(7,9,42,.75)] backdrop-blur-xl transition-all duration-200 " +
    "max-[640px]:min-h-[52px] max-[640px]:px-3.5 max-[640px]:text-[13px] " +
    "before:pointer-events-none before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-white/95 after:pointer-events-none after:absolute after:-right-10 after:-top-12 after:h-20 after:w-20 after:rounded-full after:bg-white/45 after:blur-2xl " +
    "hover:-translate-y-px hover:border-white hover:bg-white/58 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_22px_42px_-30px_rgba(7,9,42,.8)] [&>span:first-child]:relative [&>span:first-child]:min-w-0 [&>span:last-child]:relative [&>span:last-child]:text-brand [&>span:last-child]:transition-transform group-hover:[&>span:last-child]:translate-x-0.5",
} as const;

export default styles;

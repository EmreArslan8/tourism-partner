/* Regions - sol intro + sagda buyuk bolge kartlari.
   Desktop: 3 kart gorunur ve panel yuksekligini doldurur.
   Mobile/tablet: intro ustte, kartlar yatay kaydirilir. */
const styles = {
  section: "flex min-h-0 flex-1 flex-col gap-5 py-2",
  top:
    "flex items-end justify-between gap-5 max-[760px]:items-start max-[760px]:flex-col",
  topActions:
    "flex shrink-0 items-center gap-3 max-[760px]:w-full max-[760px]:justify-between max-[560px]:flex-row max-[560px]:items-center max-[560px]:justify-start max-[560px]:gap-3",
  summaryPill:
    "inline-flex items-center gap-2.5 rounded-[14px] bg-white/78 px-4 py-2.5 text-[12px] font-bold text-ink/62 shadow-[0_14px_34px_-30px_rgba(10,18,48,.45)] ring-1 ring-white/80 " +
    "max-[560px]:h-auto max-[560px]:flex-none max-[560px]:justify-start max-[560px]:gap-2 max-[560px]:rounded-none max-[560px]:bg-transparent max-[560px]:px-0 max-[560px]:py-0 max-[560px]:text-[12px] max-[560px]:font-semibold max-[560px]:text-ink/58 max-[560px]:shadow-none max-[560px]:ring-0 " +
    "max-[560px]:[&_strong]:font-bold max-[560px]:[&_strong]:text-ink/72",
  summaryDivider: "h-4 w-px bg-line max-[560px]:h-3 max-[560px]:bg-ink/20",
  layout:
    "min-h-[clamp(500px,43vw,590px)] flex-1 max-[900px]:min-h-0",
  head: "shrink-0",
  eyebrow: "eyebrow mb-2 text-brand/75",
  title:
    "heading-section text-ink",
  sub:
    "section-desc max-w-[60ch] text-[15px] font-medium leading-[1.55] text-ink/72 " +
    "max-[900px]:max-w-[60ch] max-[900px]:text-[14.5px]",
  primaryLink:
    "inline-flex w-fit items-center justify-center rounded-[12px] bg-terra px-5 py-3 text-[14px] font-extrabold text-white shadow-card transition hover:bg-terra-deep " +
    "max-[560px]:ml-auto max-[560px]:h-9 max-[560px]:w-auto max-[560px]:shrink-0 max-[560px]:rounded-[10px] max-[560px]:px-3.5 max-[560px]:py-0 max-[560px]:text-[12px]",

  railWrap:
    "relative min-w-0",
  rail:
    "grid auto-cols-[minmax(340px,calc((100%_-_20px)/2.35))] grid-flow-col gap-5 overflow-x-auto pr-1 " +
    "snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden " +
    "max-[1180px]:auto-cols-[minmax(310px,calc((100%_-_16px)/2.25))] max-[1180px]:gap-4 " +
    "max-[900px]:h-auto max-[900px]:min-h-0 max-[900px]:auto-cols-[minmax(300px,58vw)] max-[900px]:gap-3 max-[900px]:pb-2 " +
    "max-[640px]:auto-cols-[minmax(260px,84vw)]",
  card:
    "group relative flex min-h-0 flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_58px_-36px_rgba(10,18,48,.75)] ring-1 ring-black/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_70px_-38px_rgba(10,18,48,.86)] snap-start " +
    "max-[640px]:rounded-[18px]",
  media:
    "relative h-[clamp(330px,29vw,400px)] shrink-0 overflow-hidden bg-[#10162E] " +
    "max-[900px]:h-[270px] max-[900px]:shrink-0 max-[640px]:h-[220px]",
  img: "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]",
  regionMark:
    "absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-[18px] font-extrabold text-white backdrop-blur-sm",
  shade:
    "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,33,.02)_18%,rgba(10,15,33,.18)_52%,rgba(10,15,33,.88)_100%)]",
  body: "absolute inset-x-0 bottom-0 p-6 max-[640px]:p-4",
  city:
    "text-[31px] font-extrabold leading-none text-white drop-shadow-[0_1px_14px_rgba(0,0,0,.45)] " +
    "max-[1180px]:text-[27px] max-[640px]:text-[25px]",
  cardInfo:
    "flex shrink-0 flex-col gap-1.5 bg-white p-4 max-[640px]:p-3.5",
  cardInfoTitle: "text-[12px] font-extrabold leading-none text-brand/72",
  cardInfoText:
    "text-[13px] font-semibold leading-snug text-ink/70 max-[640px]:text-[12.5px]",
  chips: "mt-1 flex flex-wrap gap-1.5",
  chip:
    "inline-flex max-w-full items-center gap-1 rounded-full border border-line/80 bg-[#f7f9ff] px-2.5 py-1 text-[11px] font-bold text-ink/70 " +
    "max-[640px]:text-[10.5px] [&_b]:font-black [&_b]:text-brand",

  navButton:
    "absolute top-[40%] z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-[10px] border border-line/80 bg-white/95 text-ink shadow-[0_12px_26px_-16px_rgba(10,18,48,.55)] backdrop-blur transition hover:border-brand/35 hover:text-brand " +
    "[&_svg]:h-5 [&_svg]:w-5 [&_path]:stroke-current [&_path]:stroke-[2.2] [&_path]:stroke-linecap-round [&_path]:stroke-linejoin-round " +
    "max-[640px]:hidden",
  navPrev: "left-0 -translate-x-1/2",
  navNext: "right-0 translate-x-1/2",
} as const;

export default styles;

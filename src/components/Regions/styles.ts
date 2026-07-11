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
    "inline-flex items-center gap-2.5 rounded-[14px] bg-white/95 px-4 py-2.5 text-[12px] font-bold text-sapphire-deep shadow-[0_16px_34px_-22px_rgba(0,0,0,.72)] ring-1 ring-white/80 " +
    "max-[560px]:h-auto max-[560px]:flex-none max-[560px]:justify-start max-[560px]:gap-2 max-[560px]:rounded-none max-[560px]:bg-transparent max-[560px]:px-0 max-[560px]:py-0 max-[560px]:text-[12px] max-[560px]:font-semibold max-[560px]:text-white max-[560px]:shadow-none max-[560px]:ring-0 " +
    "max-[560px]:[&_strong]:font-bold max-[560px]:[&_strong]:text-white",
  summaryDivider: "h-4 w-px bg-sapphire/20 max-[560px]:h-3 max-[560px]:bg-white/25",
  layout:
    "flex flex-1 flex-col justify-center min-h-[clamp(500px,43vw,590px)] max-[900px]:min-h-0 max-[900px]:block",
  head: "shrink-0",
  eyebrow: "eyebrow mb-2 !text-[#9db4ff]",
  title:
    "heading-section text-white",
  sub:
    "section-desc max-w-[60ch] text-[15px] font-medium leading-[1.55] !text-[#c7d3f0] " +
    "max-[900px]:max-w-[60ch] max-[900px]:text-[14.5px]",
  primaryLink:
    "inline-flex w-fit items-center justify-center rounded-[12px] border border-white/20 bg-white px-5 py-3 text-[14px] font-extrabold text-sapphire-deep shadow-[0_16px_34px_-22px_rgba(0,0,0,.75)] transition hover:-translate-y-0.5 hover:bg-[#edf3ff] " +
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
    "group relative flex h-[clamp(520px,66vh,640px)] min-h-0 flex-col justify-end overflow-hidden rounded-[24px] bg-[#10162E] shadow-[0_26px_70px_-38px_rgba(0,0,0,.82)] ring-1 ring-white/15 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_78px_-38px_rgba(0,0,0,.9)] snap-start " +
    "max-[900px]:h-[420px] max-[640px]:h-[360px] max-[640px]:rounded-[18px]",
  img: "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]",
  regionMark:
    "absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-[18px] font-extrabold text-white backdrop-blur-sm",
  // Tek parca kart: ustten seffaf, alta dogru koyulasip icerigi tasiyan gradient.
  shade:
    "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,33,0)_40%,rgba(10,15,33,.4)_62%,rgba(10,15,33,.86)_85%,rgba(10,15,33,.96)_100%)]",
  body: "relative z-10 flex flex-col gap-2 p-6 max-[640px]:gap-1.5 max-[640px]:p-4",
  city:
    "text-[31px] font-extrabold leading-none text-white drop-shadow-[0_1px_14px_rgba(0,0,0,.45)] " +
    "max-[1180px]:text-[27px] max-[640px]:text-[25px]",
  cardInfoText:
    "text-[13px] font-semibold leading-snug text-white/80 max-[640px]:text-[12.5px]",
  chips: "mt-0.5 flex flex-wrap gap-1.5",
  chip:
    "inline-flex max-w-full items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90 backdrop-blur-md " +
    "max-[640px]:text-[10.5px] [&_b]:font-black [&_b]:text-white",

  navButton:
    "absolute top-[40%] z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-[10px] border border-line/80 bg-white/95 text-ink shadow-[0_12px_26px_-16px_rgba(10,18,48,.55)] backdrop-blur transition hover:border-brand/35 hover:text-brand " +
    "[&_svg]:h-5 [&_svg]:w-5 [&_path]:stroke-current [&_path]:stroke-[2.2] [&_path]:stroke-linecap-round [&_path]:stroke-linejoin-round " +
    "max-[640px]:hidden",
  navPrev: "left-0 -translate-x-1/2",
  navNext: "right-0 translate-x-1/2",
} as const;

export default styles;

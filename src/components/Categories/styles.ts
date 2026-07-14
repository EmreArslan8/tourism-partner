/* Categories - sekmeli liste + buyuk gorsel panel.
   Desktop/tablet: sol kategori listesi ve sag gorsel ayni yukseklikte.
   Mobile: liste ve gorsel alt alta, metinler tasma yapmadan kisaltilir. */
const styles = {
  section:
    "relative mx-auto flex min-h-0 w-full max-w-[1500px] shrink-0 flex-col justify-start gap-5 py-0 " +
    "min-[1440px]:max-w-[1680px] min-[1440px]:gap-7 min-[1800px]:max-w-[1780px] min-[1800px]:gap-8 " +
    "max-[1100px]:gap-5 max-[640px]:gap-4",
  head: "flex items-end justify-between gap-4 max-[640px]:shrink-0",
  headCopy: "section-copy max-w-[700px]",
  eyebrow: "eyebrow mb-1.5 !text-[#9db4ff]",
  headTitle: "heading-section text-white",
  lead: "section-desc mt-2 max-w-[560px] font-medium !text-[#c7d3f0]",

  panel:
    "grid min-h-[460px] grid-cols-[minmax(450px,1.05fr)_minmax(400px,.95fr)] items-stretch gap-7 " +
    "min-[1440px]:min-h-[560px] min-[1440px]:grid-cols-[minmax(540px,1.06fr)_minmax(480px,.94fr)] min-[1440px]:gap-9 " +
    "min-[1800px]:min-h-[620px] min-[1800px]:grid-cols-[minmax(600px,1.06fr)_minmax(540px,.94fr)] min-[1800px]:gap-10 " +
    "max-[1280px]:min-h-[444px] max-[1280px]:grid-cols-[minmax(410px,1.04fr)_minmax(370px,.96fr)] max-[1280px]:gap-6 " +
    "max-[980px]:grid-cols-1 max-[980px]:gap-5 max-[980px]:min-h-0",
  list:
    "flex h-full min-h-0 flex-col justify-between gap-1 rounded-[24px] border border-white/10 bg-white/[.045] p-2 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.035),0_24px_60px_-42px_rgba(0,0,0,.9)] backdrop-blur-sm " +
    "max-[980px]:gap-2 max-[640px]:grid max-[640px]:grid-cols-2 max-[640px]:gap-2.5 " +
    "max-[640px]:rounded-none max-[640px]:border-0 max-[640px]:bg-transparent max-[640px]:p-0 max-[640px]:shadow-none max-[640px]:backdrop-blur-none",
  item:
    "group/category grid min-h-[58px] grid-cols-[26px_minmax(0,1fr)] gap-2.5 rounded-[15px] border border-transparent bg-transparent px-4 py-2.5 text-left outline-none " +
    "transition-all duration-200 ease-brand hover:bg-white/[.065] " +
    "focus-visible:border-white/25 focus-visible:bg-white/[.07] focus-visible:ring-2 focus-visible:ring-white/20 " +
    "min-[1440px]:min-h-[70px] min-[1440px]:grid-cols-[32px_minmax(0,1fr)] min-[1440px]:gap-3 min-[1440px]:px-5 min-[1440px]:py-3 " +
    "min-[1800px]:min-h-[78px] min-[1800px]:px-6 " +
    "max-[1280px]:min-h-[56px] max-[1280px]:px-3.5 max-[1280px]:py-2.5 " +
    "max-[640px]:relative max-[640px]:block max-[640px]:min-h-0 max-[640px]:overflow-hidden max-[640px]:bg-white max-[640px]:p-0 max-[640px]:shadow-[0_14px_32px_-26px_rgba(7,9,42,.55)] max-[640px]:aspect-[1.18/1]",
  itemActive:
    "!border-white/70 !bg-white shadow-[0_18px_42px_-26px_rgba(0,0,0,.72)] " +
    "[&_.category-index]:!text-sapphire [&_.category-name]:!text-ink [&_.category-desc]:!text-[#4b5875] " +
    "[&_.category-badge]:!bg-[#e8eefc] [&_.category-badge]:!text-sapphire-deep [&_.category-badge]:!ring-sapphire/10",
  index:
    "category-index pt-1 text-[12px] font-bold leading-none text-[#9db4ff] transition-colors " +
    "max-[640px]:hidden",
  mobileMedia:
    "relative hidden overflow-hidden bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] " +
    "max-[640px]:absolute max-[640px]:inset-0 max-[640px]:block max-[640px]:h-full max-[640px]:w-full",
  itemCopy:
    "flex min-w-0 flex-col gap-1.5 " +
    "max-[640px]:absolute max-[640px]:inset-x-0 max-[640px]:bottom-0 max-[640px]:z-10 max-[640px]:gap-0 max-[640px]:bg-white/92 max-[640px]:p-2 max-[640px]:backdrop-blur-md",
  titleRow:
    "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 " +
    "max-[640px]:w-full max-[640px]:flex-nowrap max-[640px]:items-start max-[640px]:justify-between max-[640px]:gap-1.5",
  name:
    "category-name min-w-0 text-[16.5px] font-extrabold leading-[1.08] tracking-normal text-white transition-colors " +
    "min-[1440px]:text-[18px] min-[1800px]:text-[19.5px] " +
    "max-[1280px]:text-[15.5px] max-[640px]:max-w-[calc(100%-58px)] max-[640px]:text-[14px] max-[640px]:leading-[1.05] max-[640px]:text-ink",
  badge:
    "category-badge inline-flex max-w-full shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold leading-none text-[#c7d3f0] ring-1 ring-white/10 transition-colors " +
    "max-[640px]:max-w-[58px] max-[640px]:items-center max-[640px]:justify-center max-[640px]:whitespace-normal max-[640px]:break-words max-[640px]:px-1.5 max-[640px]:py-0.5 max-[640px]:text-center max-[640px]:text-[8.5px] max-[640px]:leading-[1.05] max-[640px]:text-brand",
  desc:
    "category-desc section-desc !mt-0 overflow-hidden !text-[11.5px] !leading-[1.45] !text-[#c7d3f0] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] " +
    "min-[1440px]:!text-[13px] min-[1800px]:!text-[14px] " +
    "max-[1280px]:!text-[11px] max-[640px]:hidden",

  // Sağ panel: küçültülmüş görsel şeridi (üst) + beyaz bilgi alanı (alt). Aynı yüksekliği tutar.
  visual:
    "group relative flex h-full min-h-[460px] flex-col overflow-hidden rounded-[22px] border border-white/20 bg-paper shadow-[0_28px_74px_-38px_rgba(0,0,0,.86)] " +
    "transition-transform duration-300 ease-brand hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 " +
    "min-[1440px]:min-h-[560px] min-[1800px]:min-h-[620px] " +
    "max-[1280px]:min-h-[444px] max-[980px]:h-[380px] max-[980px]:min-h-0 max-[640px]:hidden",
  // Görsel artık alanın tamamını değil, üst kısmı kaplar (flex-1 ama bilgi alanına yer bırakır).
  visualMedia: "relative min-h-[180px] flex-1 overflow-hidden bg-[linear-gradient(135deg,#E7EDF7,#F7F9FF)]",
  img:
    "object-cover transition-[transform,opacity] duration-500 ease-brand group-hover:scale-[1.035]",
  visualShade:
    "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,42,0)_55%,rgba(7,9,42,.28)_100%)]",
  // Bilgi alanı (beyaz, sade)
  visualInfo: "flex shrink-0 flex-col gap-2.5 p-4",
  visualStatRow: "flex flex-wrap items-baseline justify-between gap-2",
  visualName: "text-[16.5px] font-extrabold text-ink",
  visualCount: "text-[11.5px] font-semibold text-[#48566e]",
  visualChips: "flex flex-wrap gap-1.5",
  chip: "rounded-full bg-cream-deep px-2.5 py-1 text-[11.5px] font-semibold text-[#4b5875]",
  visualCta:
    "mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand transition-colors group-hover:text-brand-deep",
  ctaArrow: "transition-transform duration-200 group-hover:translate-x-1",
  visualBadge: "hidden",
  badgeDot: "hidden",

  mobileIcons: "hidden",
  mobileIcon: "hidden",
  mobileIconActive: "",
  icon: "h-5 w-5 text-brand",
} as const;

export default styles;

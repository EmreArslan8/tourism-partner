/* HowItWorks - iki net path karti: tedarikci ve acente. */
const styles = {
  section: "py-9 max-[640px]:py-[19.2px]",
  headline: "section-copy mb-5 max-w-[760px] max-[640px]:mb-4",
  eyebrow: "eyebrow mb-2 text-brand/75 max-[640px]:hidden",
  title: "heading-section text-ink",
  lead: "section-desc max-w-[62ch] text-ink/70 max-[640px]:hidden",
  leadMobile: "section-desc mt-1 hidden max-[640px]:block",

  mobileTabs:
    "mb-3 hidden grid-cols-2 gap-2 rounded-[14px] bg-white p-1.5 shadow-[0_14px_34px_-30px_rgba(7,9,42,.55)] max-[640px]:grid",
  mobileTab:
    "h-10 rounded-[10px] px-2 text-[12.5px] font-extrabold text-ink/58 transition-colors",
  mobileTabActive:
    "h-10 rounded-[10px] bg-brand px-2 text-[12.5px] font-extrabold text-white shadow-[0_12px_24px_-16px_rgba(10,36,114,.85)]",

  grid: "grid grid-cols-2 gap-4 max-[860px]:grid-cols-1 max-[640px]:block",
  mobilePanel: "contents max-[640px]:hidden",
  mobilePanelActive: "contents max-[640px]:block",
  card:
    "group relative min-h-[420px] overflow-hidden rounded-[24px] bg-white p-6 " +
    "shadow-[0_24px_64px_-52px_rgba(7,9,42,.55)] transition-all duration-300 hover:-translate-y-0.5 " +
    "max-[640px]:min-h-0 max-[640px]:rounded-[20px] max-[640px]:p-4",
  cardFeatured:
    "group relative min-h-[420px] overflow-hidden rounded-[24px] bg-white p-6 " +
    "shadow-[0_26px_70px_-52px_rgba(15,59,176,.58)] transition-all duration-300 hover:-translate-y-0.5 " +
    "max-[640px]:min-h-0 max-[640px]:rounded-[20px] max-[640px]:p-4",
  cardGlow:
    "pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(53,66,238,.14),transparent_70%)]",
  cardHead:
    "relative z-10 mb-6 flex items-start justify-between gap-4 max-[640px]:mb-4 max-[460px]:flex-col",
  kicker:
    "inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[.08em] text-ink/60 [&>svg]:text-ink/45",
  kickerFeatured:
    "inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[.08em] text-brand [&>svg]:text-brand",

  steps: "relative z-10 grid gap-3.5",
  step:
    "grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[14px] bg-[#f6f8ff] p-3.5 " +
    "max-[640px]:grid-cols-[40px_minmax(0,1fr)] max-[640px]:p-3",
  stepIcon:
    "grid h-10 w-10 place-items-center rounded-[13px] bg-white text-brand",
  stepIconFeatured:
    "grid h-10 w-10 place-items-center rounded-[13px] bg-brand text-white",
  stepCopy: "min-w-0",
  stepNo: "mb-1 block text-[10.5px] font-black leading-none text-brand/45",
  stepTitle: "block text-[15.5px] font-extrabold leading-tight text-ink",
  stepDesc:
    "mt-1 block text-[12.5px] font-medium leading-[1.5] text-ink/62 max-[640px]:text-[12px]",

  ctaFeatured:
    "inline-flex h-10 shrink-0 items-center justify-center rounded-[11px] bg-brand px-4 text-[13px] font-extrabold text-white shadow-[0_16px_34px_-20px_rgba(10,36,114,.9)] transition hover:bg-brand-deep active:scale-[.98]",
  cta:
    "inline-flex h-10 shrink-0 items-center justify-center rounded-[11px] bg-[#eef3ff] px-4 text-[13px] font-extrabold text-brand transition active:scale-[.98]",

  trustRow: "mt-5 flex flex-wrap items-center justify-center gap-2.5 max-[640px]:hidden",
  trustChip:
    "inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-bold text-ink/70 [&>svg]:text-brand",
} as const;

export default styles;

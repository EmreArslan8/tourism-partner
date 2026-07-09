 const styles = {
  main: "container-px pb-8 pt-6",
  nav: "mb-4 flex flex-wrap items-center gap-2 text-[13px] font-medium text-[#4b5875]",
  navLink: "hover:text-ink",
  navStrong: "text-ink",
  heroHead: "mb-4 flex flex-wrap items-end justify-between gap-4",
  eyebrow: "mb-1 text-[12px] font-extrabold uppercase tracking-[.08em] text-terra-deep",
  grid: "mt-6 grid grid-cols-[minmax(0,1fr)_360px] items-start gap-7 max-[900px]:grid-cols-1",
  titleWrap: "flex flex-wrap items-center gap-3",
  title: "heading-page text-ink",
  founderBadge:
    "inline-grid h-9 w-9 shrink-0 place-items-center text-terra-deep max-[640px]:h-8 max-[640px]:w-8",
  verified: "text-[12px] font-bold text-group-acente",
  meta: "mt-2 text-[14.5px] font-medium text-[#4b5875]",
  rating: "text-gold",
  h2: "heading-subsection mt-7 text-ink",
  desc: "mt-2 text-[15px] font-medium leading-7 text-[#3f4b67]",
  svcWrap: "mt-3 flex flex-wrap gap-2.5",
  svcTag:
    "inline-flex items-center rounded-pill border border-[#D4DCEA] bg-white px-3 py-1.5 text-[12.5px] font-semibold " +
    "text-[#0B102F] shadow-[0_8px_20px_-18px_rgba(7,9,42,.45)]",
  gated: "mt-7 rounded-[14px] border border-dashed border-line bg-cream px-5 py-4 text-[13.5px] font-medium text-[#4b5875]",
  gatedLink: "font-semibold text-terra",
  partners: "mt-7 rounded-[12px] border border-line bg-paper p-5 shadow-card",
  partnersHead: "max-w-[620px]",
  partnersEyebrow: "text-[11px] font-extrabold uppercase tracking-[.08em] text-terra-deep",
  partnersTitle: "mt-1 heading-subsection text-[19px] text-ink",
  partnersSub: "mt-1 text-[13.5px] font-medium leading-6 text-[#4b5875]",
  partnersGrid: "mt-4 grid gap-2.5 min-[640px]:grid-cols-2",
  partnerItem:
    "flex min-w-0 items-center gap-3 rounded-[10px] border border-line bg-cream/40 px-3 py-3 transition-colors hover:border-terra/45 hover:bg-cream",
  partnerMark:
    "grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-ink text-[12px] font-extrabold text-paper",
  partnerBody: "min-w-0 [&>strong]:block [&>strong]:truncate [&>strong]:text-[14px] [&>strong]:text-ink [&>small]:mt-0.5 [&>small]:block [&>small]:truncate [&>small]:text-[12.5px] [&>small]:font-medium [&>small]:text-[#4b5875]",
  aside: "sticky top-[104px] flex flex-col gap-4 max-[900px]:static",
  card: "rounded-card-lg border border-line bg-paper p-5 shadow-card",
  cardTitle: "heading-subsection text-[18px] text-ink",
  cardSub: "mt-1 text-[13.5px] font-medium text-[#4b5875]",
  row: "flex justify-between gap-3 border-t border-line py-2 text-[13.5px] first:border-t-0",
  rowKey: "font-medium text-[#4b5875]",
  rowVal: "font-medium text-ink",
} as const;

export default styles;

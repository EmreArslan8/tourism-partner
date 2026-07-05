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
  aside: "sticky top-[104px] flex flex-col gap-4 max-[900px]:static",
  card: "rounded-card-lg border border-line bg-paper p-5 shadow-card",
  cardTitle: "heading-subsection text-[18px] text-ink",
  cardSub: "mt-1 text-[13.5px] font-medium text-[#4b5875]",
  row: "flex justify-between gap-3 border-t border-line py-2 text-[13.5px] first:border-t-0",
  rowKey: "font-medium text-[#4b5875]",
  rowVal: "font-medium text-ink",
} as const;

export default styles;

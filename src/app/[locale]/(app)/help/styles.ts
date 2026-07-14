/* Yardım Al — public destek sayfası. */
const styles = {
  main: "container-px pb-12 pt-8 min-[1440px]:pb-16 min-[1440px]:pt-10 min-[1800px]:pb-20 min-[1800px]:pt-12",
  head: "max-w-[640px] min-[1440px]:max-w-[760px]",
  eyebrow: "text-[12px] font-extrabold uppercase tracking-[.14em] text-[#aebfff]",
  title: "mt-2 text-[32px] font-extrabold leading-tight tracking-tight text-white sm:text-[38px] min-[1440px]:text-[46px] min-[1800px]:text-[52px]",
  sub: "mt-3 text-[15.5px] font-medium leading-relaxed text-cream/80 min-[1440px]:text-[17px] min-[1800px]:text-[18px]",
  grid: "mt-8 grid grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)] gap-5 min-[1440px]:mt-10 min-[1440px]:grid-cols-[minmax(0,1.55fr)_minmax(360px,.9fr)] min-[1440px]:gap-7 min-[1800px]:gap-9 max-[860px]:grid-cols-1",
  formCard: "rounded-card-lg border border-line bg-paper p-6 shadow-card min-[1440px]:p-8 min-[1800px]:p-9 max-[560px]:p-4",
  asideCard: "h-fit rounded-card-lg border border-line bg-paper p-6 shadow-card min-[1440px]:p-8 min-[1800px]:p-9 max-[560px]:p-4",
  cardTitle: "heading-subsection text-[19px] text-ink",
  channel: "mt-4 text-[13.5px] [&>strong]:block [&>strong]:font-bold [&>strong]:text-ink",
  channelLink: "mt-0.5 block font-semibold text-terra hover:underline",
  channelDesc: "mt-0.5 font-medium text-[#4b5875]",
} as const;

export default styles;

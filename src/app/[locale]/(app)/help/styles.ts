/* Yardım Al — public destek sayfası. */
const styles = {
  main: "container-px pb-12 pt-8",
  head: "max-w-[640px]",
  eyebrow: "text-[12px] font-extrabold uppercase tracking-[.14em] text-[#aebfff]",
  title: "mt-2 text-[32px] font-extrabold leading-tight tracking-tight text-white sm:text-[38px]",
  sub: "mt-3 text-[15.5px] font-medium leading-relaxed text-cream/80",
  grid: "mt-8 grid grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)] gap-5 max-[860px]:grid-cols-1",
  formCard: "rounded-card-lg border border-line bg-paper p-6 shadow-card max-[560px]:p-4",
  asideCard: "h-fit rounded-card-lg border border-line bg-paper p-6 shadow-card max-[560px]:p-4",
  cardTitle: "heading-subsection text-[19px] text-ink",
  channel: "mt-4 text-[13.5px] [&>strong]:block [&>strong]:font-bold [&>strong]:text-ink",
  channelLink: "mt-0.5 block font-semibold text-terra hover:underline",
  channelDesc: "mt-0.5 font-medium text-[#4b5875]",
} as const;

export default styles;

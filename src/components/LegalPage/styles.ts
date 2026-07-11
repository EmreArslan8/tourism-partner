/* LegalPage — hukuki doküman tipografisi. */
const styles = {
  main: "container-px pb-16 pt-10",
  article: "mx-auto max-w-[860px] rounded-card-lg border border-line bg-paper px-10 py-12 shadow-card max-[720px]:px-6 max-[560px]:px-5 max-[560px]:py-7",
  title: "text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[34px]",
  updated: "mt-2.5 text-[12.5px] font-semibold uppercase tracking-[.06em] text-muted",
  intro: "mt-6 text-[15.5px] font-medium leading-8 text-ink/80",
  heading: "mt-10 text-[19px] font-extrabold text-ink",
  paragraph: "mt-3.5 text-[15px] leading-8 text-ink/80",
} as const;

export default styles;

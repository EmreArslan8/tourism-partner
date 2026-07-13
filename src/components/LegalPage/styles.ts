/* LegalPage — hukuki doküman tipografisi. */
const styles = {
  main: "container-px pb-16 pt-10",
  article: "mx-auto max-w-[860px] rounded-card-lg border border-line bg-paper px-10 py-12 shadow-card min-[1440px]:max-w-[980px] min-[1440px]:px-14 min-[1440px]:py-14 min-[1800px]:max-w-[1080px] min-[1800px]:px-16 min-[1800px]:py-16 max-[720px]:px-6 max-[560px]:px-5 max-[560px]:py-7",
  title: "text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[34px] min-[1440px]:text-[40px] min-[1800px]:text-[44px]",
  updated: "mt-2.5 text-[12.5px] font-semibold uppercase tracking-[.06em] text-muted",
  intro: "mt-6 text-[15.5px] font-medium leading-8 text-ink/80 min-[1440px]:text-[17px] min-[1440px]:leading-9",
  heading: "mt-10 text-[19px] font-extrabold text-ink min-[1440px]:text-[22px]",
  paragraph: "mt-3.5 text-[15px] leading-8 text-ink/80 min-[1440px]:text-[16.5px] min-[1440px]:leading-9",
} as const;

export default styles;

/* RegisterForm — tekrar eden seçim durumları ve tema rolleri. */
const styles = {
  authLink: "font-extrabold text-interactive underline decoration-interactive/30 underline-offset-4 transition-colors hover:text-interactive/80",
  step: "min-w-0 rounded-[8px] px-2 py-1 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-80",
  stepReached: "text-interactive",
  stepUpcoming: "text-ink/60 hover:text-ink/80",
  stepDescriptionReached: "text-ink/75",
  stepDescriptionUpcoming: "text-ink/55",
  intentCard:
    "flex items-center gap-4 rounded-[14px] border-[1.5px] bg-paper px-4 py-4 text-start transition-all " +
    "lg:gap-5 lg:rounded-[16px] lg:px-6 lg:py-7",
  intentCardActive: "border-interactive bg-cream-deep/30 shadow-[0_10px_26px_-18px_rgba(0,0,0,.55)]",
  intentCardIdle: "border-line hover:border-interactive/50 hover:bg-cream/45",
  intentIcon: "grid h-12 w-12 shrink-0 place-items-center rounded-[12px] transition-colors lg:h-[58px] lg:w-[58px] lg:rounded-[15px]",
  intentIconActive: "bg-terra text-white",
  intentIconIdle: "bg-cream-deep/35 text-interactive",
  intentDescription: "mt-0.5 block text-[12.5px] font-medium leading-snug text-muted lg:mt-1 lg:text-[13.5px]",
  choiceCard: "grid place-items-center rounded-[10px] border-2 bg-paper px-3 text-center transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-px",
  choiceCardActive: "border-interactive bg-cream-deep/30 shadow-[0_16px_28px_-24px_rgba(0,0,0,.9)]",
  choiceCardIdle: "border-line hover:border-interactive/55 hover:bg-cream/35",
  choiceIndicator: "mb-2 grid h-7 w-7 place-items-center rounded-full border text-[12px] font-bold",
  choiceIndicatorActive: "border-terra bg-terra text-white",
  choiceIndicatorIdle: "border-interactive/70 text-interactive",
  choiceLabel: "block font-semibold leading-tight text-ink/80",
  categoryIcon: "mb-3 block h-[34px] w-[34px] bg-current text-interactive",
  subBack: "inline-flex items-center gap-1 text-[13px] font-semibold text-muted transition-colors hover:text-interactive",
  subHint: "text-[12.5px] font-semibold text-muted",
} as const;

export default styles;

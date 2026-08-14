/* LoginForm — renkler yalnız semantik tema rollerinden gelir. */
const styles = {
  viewport: "flex h-full items-center justify-center px-5 py-8 sm:px-8 lg:px-12",
  panel: "w-full max-w-[560px]",
  mfaPanel: "w-full max-w-[460px]",
  eyebrow: "mb-3 block text-[12px] font-extrabold uppercase tracking-[.14em] text-interactive",
  title: "text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px] lg:text-[40px]",
  mfaTitle: "text-[30px] font-extrabold leading-tight tracking-tight text-ink",
  intro: "mb-8 mt-3 text-[16px] font-medium leading-relaxed text-ink/75",
  mfaIntro: "mb-8 mt-3 text-[15px] font-medium leading-relaxed text-ink/75",
  textLink: "font-extrabold text-interactive underline decoration-interactive/30 underline-offset-4 transition-colors hover:text-interactive/80",
  form: "flex flex-col gap-[18px]",
  input: "h-[56px] text-[16px] font-semibold",
  mfaInput: "field h-[56px] w-full text-center text-[22px] font-bold tracking-[.4em] placeholder:text-ink/30",
  passwordField: "flex flex-col gap-2",
  label: "text-[14.5px] font-bold text-ink",
  passwordWrap: "relative",
  passwordInput: "field h-[56px] w-full pe-12 text-[16px] font-semibold placeholder:text-ink/45",
  visibilityButton: "absolute end-4 top-1/2 grid -translate-y-1/2 place-items-center text-ink/50 transition-colors hover:text-interactive",
  forgotRow: "-mt-1 text-end text-[13.5px] font-semibold",
  error: "text-[13px] font-medium text-red-600 dark:text-red-300",
  submit: "mt-3 h-[58px] text-[16px]",
  mfaSubmit: "mt-1 h-[58px] text-[16px]",
} as const;

export default styles;

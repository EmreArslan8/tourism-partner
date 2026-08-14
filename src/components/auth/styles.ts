/* AuthShell — moddan bağımsız, semantik tema sınıfları. */
const styles = {
  shell: "flex h-screen overflow-hidden bg-panel-bg text-ink transition-colors duration-200",
  brandPanel:
    "relative hidden w-[400px] shrink-0 flex-col justify-between overflow-hidden rounded-e-[36px] " +
    "bg-[linear-gradient(158deg,theme(colors.sapphire-deep)_0%,theme(colors.sapphire-top)_100%)] " +
    "p-10 text-white shadow-[0_24px_70px_-34px_rgba(0,0,0,.55)] lg:flex",
  glowTop: "pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl",
  glowBottom: "pointer-events-none absolute -bottom-28 -start-16 h-64 w-64 rounded-full bg-white/5 blur-2xl",
  brandIntro: "relative",
  slogan: "mt-3 text-[15px] font-medium",
  benefits: "relative flex flex-col gap-8",
  benefit: "flex items-start gap-4",
  benefitIcon: "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-terra shadow-[0_8px_18px_-8px_rgba(0,0,0,.45)]",
  benefitCopy: "min-w-0",
  benefitTitle: "block text-[14.5px] font-bold leading-snug",
  benefitDescription: "mt-1.5 block text-[12.5px] leading-relaxed text-white/65",
  footer: "relative flex flex-col gap-3",
  helpLink: "inline-flex w-fit items-center rounded-pill bg-white/12 px-4 py-2 text-[13px] font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20",
  legal: "flex items-center gap-3 text-[11.5px] text-white/45",
  legalLink: "transition-colors hover:text-white/80",
  content: "flex min-h-0 min-w-0 flex-1 flex-col bg-panel-bg transition-colors duration-200",
  mobileHeader: "flex shrink-0 items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3 lg:hidden",
  mobileTrust: "text-[11.5px] font-medium text-muted",
  contentBody: "flex min-h-0 flex-1 flex-col",
} as const;

export default styles;

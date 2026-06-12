export const styles = {
  section: "relative overflow-hidden py-12 px-4 sm:py-20 sm:px-6 lg:px-8",
  container: "container-px relative",
  wrapper: "relative rounded-3xl sm:rounded-[40px] bg-pine px-6 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20 lg:flex lg:items-center lg:justify-between shadow-2xl",
  content: "relative z-10 lg:max-w-2xl",
  eyebrow: "inline-flex items-center rounded-full bg-terra/20 px-3.5 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-gold border border-gold/20 mb-5 sm:mb-6",
  title: "text-[clamp(26px,5vw,48px)] font-bold leading-[1.12] text-paper tracking-tight",
  sub: "mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-cream/70 max-w-xl",
  actions: "relative z-10 mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 sm:gap-6 lg:mt-0 lg:flex-shrink-0",
  button: "btn btn-cream !rounded-2xl !px-8 sm:!px-10 !py-3.5 sm:!py-4 !text-base sm:!text-lg !font-bold w-full sm:w-auto justify-center hover:scale-105 transition-transform",
  offerBadge: "flex items-center gap-3 rounded-2xl bg-white/5 p-3.5 sm:p-4 backdrop-blur-sm border border-white/10",
  offerIcon: "flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold",
  offerText: "text-sm text-cream/90 font-medium",
  offerEm: "block text-gold font-bold text-base",
  
  /* Arka plan efektleri */
  bgEffect1: "pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-terra opacity-20 blur-[100px]",
  bgEffect2: "pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-pine-soft opacity-40 blur-[100px]",
  grain: "absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay",
} as const;

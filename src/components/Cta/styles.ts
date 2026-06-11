export const styles = {
  section: "relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8",
  container: "container-px relative",
  wrapper: "relative rounded-[40px] bg-pine px-8 py-12 md:px-16 md:py-20 lg:flex lg:items-center lg:justify-between shadow-2xl",
  content: "relative z-10 lg:max-w-2xl",
  eyebrow: "inline-flex items-center rounded-full bg-terra/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-gold border border-gold/20 mb-6",
  title: "text-[clamp(32px,5vw,48px)] font-bold leading-[1.1] text-paper tracking-tight",
  sub: "mt-6 text-lg leading-relaxed text-cream/70 max-w-xl",
  actions: "mt-10 flex flex-wrap items-center gap-6 lg:mt-0 lg:flex-shrink-0",
  button: "btn btn-cream !rounded-2xl !px-10 !py-4 !text-lg !font-bold hover:scale-105 transition-transform",
  offerBadge: "flex items-center gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10",
  offerIcon: "flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold",
  offerText: "text-sm text-cream/90 font-medium",
  offerEm: "block text-gold font-bold text-base",
  
  /* Arka plan efektleri */
  bgEffect1: "absolute -right-20 -top-20 h-96 w-96 rounded-full bg-terra opacity-20 blur-[100px]",
  bgEffect2: "absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-pine-soft opacity-40 blur-[100px]",
  grain: "absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay",
} as const;

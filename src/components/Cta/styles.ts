/* Cta — Showcase sonrası kampanya bandı. */
const styles = {
  section: "w-full",
  panel:
    "relative isolate grid w-full grid-cols-[minmax(0,1fr)_minmax(230px,auto)] items-center gap-7 overflow-hidden rounded-[18px] " +
    "border border-white/[.22] bg-[linear-gradient(110deg,rgba(42,78,163,.88),rgba(20,61,157,.82))] px-7 py-6 shadow-[0_26px_76px_-38px_rgba(0,0,0,.78)] backdrop-blur-xl " +
    "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_13%_18%,rgba(255,255,255,.2),transparent_26%),radial-gradient(circle_at_86%_30%,rgba(75,132,255,.34),transparent_32%),linear-gradient(118deg,rgba(255,255,255,.06),transparent_38%,rgba(255,255,255,.08))] " +
    "after:absolute after:right-[-12%] after:top-1/2 after:-z-10 after:h-[170%] after:w-[34%] after:-translate-y-1/2 after:rotate-[-12deg] after:bg-white/[.07] after:blur-[1px] " +
    "max-[860px]:grid-cols-1 max-[860px]:gap-5 max-[860px]:px-5 max-[860px]:py-5 " +
    "max-[560px]:gap-2 max-[560px]:rounded-[12px] max-[560px]:border-white/10 max-[560px]:bg-none max-[560px]:bg-white/[.05] max-[560px]:px-4 max-[560px]:py-3 max-[560px]:shadow-none max-[560px]:backdrop-blur-0 max-[560px]:before:hidden max-[560px]:after:hidden",
  content: "section-copy min-w-0 text-white",
  /* Premium Partner rozeti — doping teklifinin görsel karşılığı. */
  badge: "mb-3 max-[560px]:hidden",
  title:
    "max-w-none whitespace-nowrap font-display text-[28px] font-semibold leading-[1.05] text-white " +
    "max-[980px]:text-[24px] max-[720px]:whitespace-normal max-[560px]:hidden",
  sub:
    "mt-3 max-w-[54ch] text-[15px] font-medium leading-[1.5] !text-[#e2eaff] " +
    "max-[980px]:max-w-[62ch] max-[980px]:text-[13.5px] max-[980px]:leading-[1.45] " +
    "max-[560px]:mt-1.5 max-[560px]:text-[13px] max-[560px]:leading-[1.4]",
  actions:
    "relative flex shrink-0 items-center justify-end " +
    "before:absolute before:inset-[-14px] before:-z-10 before:rounded-full before:bg-sapphire-top/24 before:blur-2xl " +
    "max-[860px]:justify-start max-[560px]:mt-0.5 max-[560px]:before:hidden",
  primary:
    "group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[8px] bg-white px-7 text-[14.5px] font-extrabold text-sapphire-deep " +
    "shadow-[0_16px_30px_-22px_rgba(0,0,0,.62)] transition-transform duration-200 ease-brand hover:-translate-y-0.5 " +
    "[&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-brand hover:[&>svg]:translate-x-0.5 " +
    "max-[980px]:min-h-[50px] max-[980px]:px-6 " +
    "max-[560px]:min-h-0 max-[560px]:gap-1.5 max-[560px]:rounded-none max-[560px]:bg-transparent max-[560px]:px-0 max-[560px]:text-[14px] max-[560px]:font-bold max-[560px]:text-white max-[560px]:underline max-[560px]:underline-offset-4 max-[560px]:shadow-none",
} as const;

export default styles;

/* HeroSearch — canlı statik formdaki kompakt, segmentli arama çubuğu. */
 const styles= {
  form:
    "mx-auto flex w-full max-w-[1040px] items-stretch rounded-[12px] border border-[rgba(216,223,252,.94)] " +
    "bg-white/90 p-1.5 text-left shadow-[0_18px_46px_-28px_rgba(23,33,120,.38)] backdrop-blur-2xl " +
    "max-[760px]:max-w-full max-[760px]:flex-col max-[760px]:gap-2 max-[760px]:rounded-[12px] max-[760px]:p-[6px]",
  field:
    "flex min-w-[116px] flex-col justify-center px-3.5 py-1 max-[760px]:min-w-0 max-[760px]:rounded-[10px] max-[760px]:border max-[760px]:border-line max-[520px]:px-[9px] max-[520px]:py-1.5",
  grow: "min-w-0 flex-1",
  divider: "my-2 w-px shrink-0 bg-line max-[760px]:hidden",
  hiddenStep: "hidden",
  label: "mb-0.5 text-[10px] font-bold uppercase tracking-[.14em] text-muted",
  input:
    "w-full border-0 bg-transparent text-[14px] font-medium leading-5 text-ink placeholder:text-[#727b97] focus:outline-none",
  selectShell: "relative block",
  selectIcon: "pointer-events-none absolute left-0 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#8a93ad]",
  selectPad: "pl-[21px]",
  select:
    "w-full cursor-pointer appearance-none border-0 bg-transparent pr-[20px] text-[14px] font-medium leading-5 text-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-45",
  chevron: "pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#66708f]",
  submit:
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[9px] border-0 bg-terra px-7 py-2.5 text-[14px] font-bold tracking-[.01em] text-white " +
    "shadow-[0_10px_22px_-14px_rgba(27,69,196,.8)] transition-all duration-200 ease-brand hover:-translate-y-px hover:bg-terra-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-terra focus-visible:ring-offset-2 " +
    "max-[760px]:w-full max-[760px]:py-3",
  searchIcon: "h-[15px] w-[15px] shrink-0",
} as const;

export default styles;

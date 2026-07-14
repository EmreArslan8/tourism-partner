/* HeroSearch — canlı statik formdaki kompakt, segmentli arama çubuğu. */
 const styles= {
  form:
    "mx-auto flex w-full max-w-[1040px] items-stretch rounded-[12px] border border-[rgba(216,223,252,.94)] " +
    "bg-white/90 p-1.5 text-left shadow-[0_18px_46px_-28px_rgba(23,33,120,.38)] backdrop-blur-2xl " +
    "min-[1440px]:max-w-[1160px] min-[1440px]:rounded-[14px] min-[1440px]:p-2 min-[1800px]:max-w-[1240px] " +
    "max-[1024px]:w-fit max-[1024px]:max-w-full max-[1024px]:flex-col max-[1024px]:items-stretch max-[1024px]:gap-2.5 max-[1024px]:rounded-[14px] max-[1024px]:!bg-white max-[1024px]:p-3 max-[760px]:rounded-[12px] max-[760px]:p-[6px]",
  field:
    "flex min-w-[116px] flex-col justify-center px-3.5 py-1 " +
    "min-[1440px]:min-w-[136px] min-[1440px]:px-5 min-[1440px]:py-2 min-[1800px]:min-w-[148px] min-[1800px]:py-2.5 " +
    "max-[1024px]:flex-none max-[1024px]:rounded-[11px] max-[1024px]:border max-[1024px]:border-line max-[1024px]:px-4 max-[1024px]:py-3.5 " +
    "max-[520px]:px-[9px] max-[520px]:py-1.5",
  grow: "min-w-0 flex-1 max-[1024px]:w-[380px] max-[1024px]:max-w-full max-[1024px]:flex-none",
  /* Select alanları sabit genişlikte: native select en uzun option'a göre şişer
     (250 ülkelik listede "Amerika Birleşik Devletleri…" ülke alanını balonlaştırıyordu). */
  fieldSelect: "w-[152px] shrink-0 min-[1440px]:w-[174px] min-[1800px]:w-[190px] max-[1024px]:w-full",
  divider: "my-2 w-px shrink-0 bg-line max-[1024px]:hidden",
  hiddenStep: "hidden",
  label: "mb-0.5 text-[10px] font-bold uppercase tracking-[.14em] text-muted min-[1440px]:mb-1 min-[1440px]:text-[11px] min-[1800px]:text-[11.5px] max-[1024px]:mb-1 max-[1024px]:text-[11px]",
  input:
    "w-full border-0 bg-transparent text-[14px] font-medium leading-5 text-ink placeholder:text-[#727b97] focus:outline-none min-[1440px]:text-[15.5px] min-[1440px]:leading-6 min-[1800px]:text-[16.5px] max-[1024px]:text-[16px]",
  selectShell: "relative block",
  selectIcon: "pointer-events-none absolute left-0 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#8a93ad]",
  selectPad: "pl-[21px]",
  select:
    "w-full cursor-pointer appearance-none overflow-hidden text-ellipsis whitespace-nowrap border-0 bg-transparent pr-[20px] text-[14px] font-medium leading-5 text-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-45 min-[1440px]:text-[15.5px] min-[1440px]:leading-6 min-[1800px]:text-[16.5px] max-[1024px]:text-[16px]",
  chevron: "pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#66708f]",
  submit:
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[9px] border-0 bg-sapphire-top px-7 py-2.5 text-[14px] font-bold tracking-[.01em] text-white " +
    "shadow-[0_10px_22px_-14px_rgba(27,69,196,.8)] transition-all duration-200 ease-brand hover:-translate-y-px hover:bg-sapphire focus:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-top focus-visible:ring-offset-2 " +
    "min-[1440px]:rounded-[11px] min-[1440px]:px-9 min-[1440px]:py-3.5 min-[1440px]:text-[15.5px] min-[1800px]:px-10 min-[1800px]:py-4 min-[1800px]:text-[16.5px] " +
    "max-[1024px]:w-full max-[1024px]:flex-none max-[1024px]:py-3.5 max-[760px]:py-3",
  searchIcon: "h-[15px] w-[15px] shrink-0 min-[1440px]:h-[17px] min-[1440px]:w-[17px] min-[1800px]:h-[18px] min-[1800px]:w-[18px]",
} as const;

export default styles;

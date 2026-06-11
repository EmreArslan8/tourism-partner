/* HeroSearch — frosted arama çubuğu (hero görseli üstünde durur). */
export const s = {
  form:
    "mx-auto flex w-full max-w-[860px] flex-wrap gap-2.5 rounded-[14px] border border-white/60 " +
    "bg-white/85 p-2.5 text-left shadow-[0_22px_58px_-30px_rgba(16,24,40,.42)] backdrop-blur-md",
  field:
    "h-[52px] rounded-[10px] border-[1.5px] border-line/70 bg-white/80 px-3.5 text-[15px] font-medium max-[560px]:w-full " +
    "focus:border-terra focus:outline-none",
  input:
    "h-[52px] min-w-[200px] flex-1 rounded-[10px] border-[1.5px] border-line/70 bg-white/80 px-3.5 text-[15px] max-[560px]:w-full max-[560px]:min-w-0 max-[560px]:flex-none " +
    "focus:border-terra focus:outline-none",
  submit: "btn btn-solid h-[52px] px-8 text-[15px] max-[560px]:w-full",
} as const;

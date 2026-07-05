/* Trust - kart yerine kompakt guven seridi. */
const styles = {
  section: "w-full",
  list:
    "grid grid-cols-3 items-start gap-8 rounded-[18px] bg-[#eef3ff] px-8 py-5 " +
    "max-[820px]:gap-4 max-[700px]:grid-cols-1 max-[700px]:px-5 max-[700px]:py-4",
  item:
    "flex min-w-0 flex-col items-center text-center max-[700px]:grid max-[700px]:grid-cols-[38px_minmax(0,1fr)] max-[700px]:items-center max-[700px]:gap-3 max-[700px]:text-left",
  icon:
    "mb-5 grid h-9 w-9 place-items-center text-brand max-[700px]:mb-0 max-[700px]:h-8 max-[700px]:w-8",
  body: "min-w-0",
  itemTitle:
    "block text-[13px] font-semibold uppercase tracking-[.2em] text-ink/82 " +
    "max-[900px]:text-[11.5px] max-[700px]:tracking-[.12em]",
  itemDesc:
    "mt-4 block text-[14px] font-medium leading-snug text-ink/66 " +
    "max-[900px]:text-[13px] max-[700px]:mt-1.5",
} as const;

export default styles;

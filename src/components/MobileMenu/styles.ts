/* MobileMenu — Tailwind sınıf token'ları (hamburger + açılır panel). */
export const styles = {
  button: "ml-auto grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-paper min-[900px]:hidden",
  bar: "block h-[2px] w-5 bg-ink transition-all",
  panel:
    "absolute left-0 right-0 top-full border-b border-line bg-cream/95 backdrop-blur-md " +
    "min-[900px]:hidden",
  list: "container-px flex flex-col gap-1 py-4",
  link: "rounded-[10px] px-3 py-3 text-[15px] font-medium text-ink hover:bg-paper",
  actions: "container-px flex flex-col gap-2 border-t border-line py-4",
} as const;

/* FAQ — sık sorulan sorular akordeonu (native <details>). */
const styles = {
  section: "w-full",
  // Masaüstü: solda başlık/açıklama, sağda akordeon. Mobil: alt alta.
  wrap:
    "grid w-full grid-cols-[minmax(0,380px)_1fr] items-start gap-x-16 " +
    "max-[860px]:grid-cols-1 max-[860px]:gap-y-7",
  aside: "max-w-[720px]",
  eyebrow:
    "mb-2.5 inline-flex rounded-[8px] border border-line bg-paper px-2.5 py-1 " +
    "text-[11px] font-black text-pine shadow-[0_10px_30px_-24px_rgba(7,9,42,.6)]",
  title: "heading-section text-ink",
  lead: "mt-4 max-w-[58ch] text-[15px] font-medium leading-7 text-ink/70 max-[640px]:hidden",
  list: "flex w-full flex-col gap-3 max-[860px]:max-h-[50dvh] max-[860px]:overflow-y-auto max-[640px]:max-h-[38dvh]",
  item:
    "group rounded-[14px] bg-white/70 px-4 shadow-[0_12px_30px_-28px_rgba(7,9,42,.45)] transition-colors " +
    "open:[&_summary]:text-terra",
  summary:
    "flex cursor-pointer list-none items-center justify-between gap-5 py-4 text-[15.5px] font-bold leading-snug text-ink " +
    "transition-colors group-hover:text-terra " +
    "after:grid after:h-8 after:w-8 after:shrink-0 after:place-items-center after:rounded-full " +
    "after:border after:border-line after:text-[18px] after:font-normal after:leading-none after:text-terra " +
    "after:transition-transform after:duration-300 after:content-['+'] [details[open]>&]:after:rotate-45 " +
    "[details[open]>&]:after:border-terra [details[open]>&]:after:bg-terra [details[open]>&]:after:text-white",
  text: "pb-4 pr-12 text-[14px] font-medium leading-7 text-ink/68 max-[560px]:pr-2 max-[560px]:leading-6",
} as const;

export default styles;

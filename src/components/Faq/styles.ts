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
  lead: "body-muted mt-4 max-w-[58ch]",
  list: "flex w-full flex-col gap-2 max-[860px]:max-h-[46dvh] max-[860px]:overflow-y-auto max-[640px]:max-h-[34dvh]",
  item:
    "group border-b border-line transition-colors first:border-t last:border-b " +
    "open:[&_summary]:text-terra",
  summary:
    "flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[16px] font-semibold text-ink " +
    "transition-colors group-hover:text-terra " +
    "after:grid after:h-8 after:w-8 after:shrink-0 after:place-items-center after:rounded-full " +
    "after:border after:border-line after:text-[20px] after:font-normal after:leading-none after:text-terra " +
    "after:transition-transform after:duration-300 after:content-['+'] [details[open]>&]:after:rotate-45 " +
    "[details[open]>&]:after:border-terra [details[open]>&]:after:bg-terra [details[open]>&]:after:text-white",
  text: "pb-4 pr-10 text-[15px] leading-relaxed text-muted max-[560px]:pr-2",
} as const;

export default styles;

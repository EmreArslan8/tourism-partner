/* FAQ — sık sorulan sorular akordeonu (native <details>). */
const styles = {
  section: "w-full",
  // Masaüstü: solda başlık/açıklama, sağda akordeon. Mobil: alt alta.
  wrap:
    "grid w-full grid-cols-[minmax(0,380px)_1fr] items-start gap-x-16 " +
    "min-[1440px]:grid-cols-[minmax(0,460px)_1fr] min-[1440px]:gap-x-20 min-[1800px]:grid-cols-[minmax(0,520px)_1fr] min-[1800px]:gap-x-24 " +
    "max-[860px]:grid-cols-1 max-[860px]:gap-y-7 max-[640px]:gap-y-2.5",
  aside: "max-w-[720px]",
  eyebrow:
    "mb-2.5 inline-flex rounded-[8px] border border-line bg-paper px-2.5 py-1 " +
    "text-[11px] font-black text-pine shadow-[0_10px_30px_-24px_rgba(7,9,42,.6)]",
  title: "heading-section text-white",
  lead: "mt-4 max-w-[58ch] text-[15px] font-medium leading-7 !text-[#c7d3f0] min-[1440px]:text-[16.5px] min-[1440px]:leading-8 min-[1800px]:text-[17.5px] max-[640px]:hidden",
  list: "flex w-full flex-col gap-1.5 max-[860px]:max-h-[50dvh] max-[860px]:overflow-y-auto max-[640px]:!max-h-none max-[640px]:gap-0 max-[640px]:!overflow-visible",
  item: "group border-b border-line transition-all last:border-b-0",
  summary:
    "flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[15.5px] font-bold leading-snug text-white " +
    "after:grid after:h-9 after:w-9 after:shrink-0 after:place-items-center after:text-[26px] after:font-normal after:leading-none after:text-white " +
    "after:transition-transform after:duration-300 after:content-['+'] [details[open]>&]:after:rotate-45 " +
    "min-[1440px]:py-6 min-[1440px]:text-[17px] min-[1800px]:py-7 min-[1800px]:text-[18px] " +
    "max-[640px]:py-3.5 max-[640px]:text-[13px] max-[640px]:after:h-6 max-[640px]:after:w-6 max-[640px]:after:text-[18px]",
  text: "pb-3 pe-12 text-[14px] font-medium leading-7 text-white/90 min-[1440px]:pb-5 min-[1440px]:text-[15.5px] min-[1440px]:leading-8 min-[1800px]:text-[16.5px] max-[560px]:pb-2 max-[560px]:pe-2 max-[560px]:text-[12px] max-[560px]:leading-[1.45]",
} as const;

export default styles;

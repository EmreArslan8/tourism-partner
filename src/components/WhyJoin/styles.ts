/* WhyJoin — "Neden Tourism Partner?" faydaları + inline kayıt bandı.
   HowItWorks ile SSS arasındaki ana dönüşüm anı. Koyu mor zemin (marka),
   sağda beyaz kayıt kartı. Görsel referans: marka kılavuzu "Join" bandı. */
const styles = {
  // Tam genişlik (edge-to-edge) koyu bant — kenar boşluğu yok, zemin ekranı doldurur.
  section:
    "relative isolate w-full overflow-hidden " +
    "bg-[linear-gradient(120deg,#24113f_0%,#331660_46%,#4c1d95_100%)] " +
    // Dünya haritası ayrı şeffaf asset; mor gradyan kodda kalır.
    "before:absolute before:inset-0 before:-z-10 before:opacity-[.82] " +
    "before:bg-[url('/assets/why-tourism-map-overlay.png')] before:bg-center before:bg-no-repeat before:[background-size:min(900px,54vw)_auto] " +
    "after:absolute after:end-[6%] after:top-1/2 after:-z-10 after:h-[130%] after:w-[34%] after:-translate-y-1/2 after:rounded-full after:bg-[radial-gradient(circle,rgba(109,40,217,.5),transparent_68%)] after:blur-3xl",
  // İçerik container-px ile ortalanır (diğer bölümlerle aynı sol/sağ hiza).
  inner:
    "container-px grid grid-cols-[minmax(0,1fr)_minmax(340px,400px)] items-center gap-14 py-10 " +
    "min-[1440px]:py-12 min-[1800px]:py-14 " +
    "max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[900px]:py-10 max-[640px]:py-8",

  // ——— Sol: başlık + fayda listesi ———
  left: "min-w-0 text-white",
  title:
    "font-display text-[34px] font-bold leading-[1.1] text-white " +
    "max-[1200px]:text-[30px] max-[900px]:text-[27px] max-[560px]:text-[23px]",
  list: "mt-6 flex flex-col gap-4 max-[560px]:mt-5 max-[560px]:gap-3",
  item: "flex items-center gap-3.5 max-[560px]:gap-3",
  check:
    "grid size-8 shrink-0 place-items-center rounded-full bg-sapphire-top text-white shadow-[0_8px_18px_-8px_rgba(109,40,217,.9)] max-[560px]:size-7",
  itemText: "text-[17px] font-medium text-[#efeaff] max-[900px]:text-[16px] max-[560px]:text-[15px]",

  // ——— Sağ: beyaz kayıt kartı ———
  card:
    "rounded-[20px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(36,17,63,.6)] " +
    "max-[640px]:rounded-none max-[640px]:bg-transparent max-[640px]:p-0 max-[640px]:shadow-none",
  formTitle: "font-display text-[22px] font-bold leading-tight text-sapphire max-[640px]:hidden",
  formSub: "mt-2 text-[14px] leading-[1.55] text-muted max-[640px]:hidden",
  form: "mt-5 flex flex-col gap-3 max-[640px]:hidden",
  field: "relative",
  fieldIcon:
    "pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-gray",
  input:
    "h-[52px] w-full rounded-[12px] border border-soft-lavender bg-white ps-11 pe-4 text-[15px] text-ink outline-none " +
    "transition-colors placeholder:text-slate-gray/70 focus:border-sapphire-top focus:ring-4 focus:ring-sapphire-top/15",
  select:
    "h-[52px] w-full cursor-pointer appearance-none rounded-[12px] border border-soft-lavender bg-white ps-11 pe-10 text-[15px] text-ink outline-none " +
    "transition-colors focus:border-sapphire-top focus:ring-4 focus:ring-sapphire-top/15",
  selectPlaceholder: "text-slate-gray/70",
  chevron:
    "pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-slate-gray",
  submit:
    "group mt-1.5 inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[12px] bg-sapphire-top text-[15px] font-bold text-white " +
    "shadow-[0_18px_34px_-18px_rgba(109,40,217,.9)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-royal-purple " +
    "[&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-0.5 rtl:hover:[&>svg]:-translate-x-0.5",
  mobileSubmit:
    "group hidden h-[52px] w-full items-center justify-center gap-2.5 rounded-[12px] bg-white text-[15px] font-bold text-sapphire " +
    "shadow-[0_18px_34px_-18px_rgba(0,0,0,.75)] transition-all duration-200 ease-brand active:translate-y-px max-[640px]:inline-flex " +
    "[&>svg]:transition-transform [&>svg]:duration-200",
  foot: "mt-4 text-center text-[13.5px] text-muted max-[640px]:text-[#efeaff]/80",
  footLink: "font-semibold text-sapphire-top underline-offset-2 hover:underline max-[640px]:text-white",
} as const;

export default styles;

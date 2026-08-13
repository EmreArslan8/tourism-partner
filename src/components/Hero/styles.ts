/* Hero — statik marketing görseli + sola hizalı içerik. */
 const styles= {
  // İlk ekranı doldurur ama ona kilitlenmez (min-h → içerik uzarsa hero büyür, kırpılmaz).
  // Ölçü svh: Safari'de scroll'la adres/araç çubuğu daralsa da SABİT kalır — dvh olsaydı
  // hero uzayıp görseli esnetirdi. Marquee de mobilde akışta (flex sonu) olduğundan
  // içerikle arasındaki boşluk viewport değişiminden etkilenmez.
  // Mobilde 100svh yerine 100svh-40px: marquee tam katlanma çizgisine oturmaz, altındaki
  // bölümün bir şeridi baştan görünür. Safari çubuğu geri çekilip ~90px alan açıldığında
  // "yeni bir kenar belirmiş" hissi olmaz, zaten görünen alan biraz büyür.
  section:
    "relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-pine " +
    "max-[640px]:min-h-[calc(100svh-40px)]",
  picture:
    "absolute inset-0 -z-10 block bg-[#03062b] " +
    "min-[1025px]:bg-[radial-gradient(circle_at_78%_48%,#12105c_0%,#070838_42%,#03062b_76%)]",
  // Görsel tüm hero alanını doldurur (object-cover) — üst/alt boşluk ya da
  // dikiş olmaz. Sahne 2:1: küre sağda, sol taraf metin için koyu boş alan.
  // Mobil ve tablet kendi tam-kaplayan görsellerinde kalır.
  image: "h-full w-full object-cover object-center max-[640px]:object-[72%_center]",
  overlay:
    "pointer-events-none absolute inset-0 -z-10 " +
    "bg-[linear-gradient(90deg,rgba(1,8,47,.82)_0%,rgba(1,8,47,.42)_42%,rgba(1,8,47,.05)_72%,rgba(1,8,47,0)_100%)]",
  // Etkileşimli küre (yalnız masaüstü ≥1025px; mobil/tablet statik fotoğrafla kalır).
  // Sağ tarafa demirli; içerik (sol) DOM'da sonra geldiği için üstte kalır.
  globeWrap:
    "pointer-events-none absolute end-[-20vw] top-[88%] z-0 hidden aspect-square " +
    "w-[min(72vw,720px)] -translate-y-1/2 min-[1025px]:block " +
    "min-[1440px]:end-[-20vw] min-[1600px]:end-[-16vw]",
  // Fotoğraftaki statik küreyi yumuşakça maskeler + kürenin arkasına gece-mavi halo verir.
  globeHalo:
    "absolute inset-[-10%] rounded-full " +
    "bg-[radial-gradient(closest-side,#01082f_46%,rgba(1,8,47,.78)_64%,rgba(1,8,47,0)_100%)]",
  globeCanvas: "pointer-events-auto relative h-full w-full",
  inner:
    "container-px flex min-h-[520px] flex-1 flex-col items-start justify-center  text-start " +
    // Header absolute olduğundan güvenli alan: ortalanan içerik kısa ekranda header altına giremesin.
    "min-[1025px]:pt-[96px] min-[1025px]:pb-[72px] " +
    // Yukarı kaydırma yalnız yeterince YÜKSEK ekranlarda; kısa laptop ekranında taşmaya yol açıyordu.
    "[@media(min-width:1440px)_and_(min-height:940px)]:-translate-y-6 " +
    "[@media(min-width:1800px)_and_(min-height:940px)]:-translate-y-10 " +
    "min-[641px]:max-[1024px]:justify-start min-[641px]:max-[1024px]:pt-[15vh] " +
    "max-[640px]:justify-start max-[640px]:pt-[112px] max-[640px]:pb-8",
  title:
    "heading-hero max-w-[20ch] [text-wrap:balance] text-white max-[640px]:max-w-[12ch] max-[640px]:text-[38px] max-[640px]:leading-[1.12] max-[640px]:tracking-[-.025em] max-[640px]:[&_em]:block max-[640px]:[&_em]:whitespace-nowrap " +
    "min-[641px]:max-[1024px]:!text-[4.25rem] min-[641px]:max-[1024px]:!leading-[1.14] min-[641px]:max-[1024px]:!tracking-[-.02em] " +
    // Masaüstü tabanı biraz küçültüldü (nefes alanı) — heading-hero clamp'ini ezer.
    "min-[1025px]:!text-[64px] min-[1025px]:!leading-[1.13] " +
    // Dev başlık yalnız geniş VE yüksek ekranlarda; 1600×900 laptop'ta taban ölçü kalır.
    "[@media(min-width:1440px)_and_(min-height:940px)]:!text-[74px] " +
    "[@media(min-width:1440px)_and_(min-height:940px)]:!leading-[1.08] " +
    "[@media(min-width:1800px)_and_(min-height:940px)]:!text-[80px] " +
    "[text-shadow:0_2px_28px_rgba(1,8,47,.55)] [&_em]:not-italic [&_em]:text-[#8b5cf6]",
  eyebrow:
    "mb-2.5 text-[13px] font-extrabold uppercase tracking-[.16em] text-[#b7a6f0] [text-shadow:0_2px_18px_rgba(36,17,63,.5)] min-[1440px]:mb-3 min-[1440px]:text-[14px] max-[640px]:mb-2 max-[640px]:text-[11px]",
  // Mobilde açıklama başlığın altında değil, teklif butonunun hemen üstünde durur.
  mobileIntro:
    "hidden max-w-[34ch] text-[13.5px] font-medium leading-5 text-white/75 max-[640px]:block",
  categories:
    "mt-6 flex items-start gap-6 text-white max-[1100px]:gap-4 max-[640px]:hidden min-[1440px]:mt-8 min-[1440px]:gap-8 min-[1800px]:gap-9",
  categoryLink:
    "group flex min-w-[62px] flex-col items-center gap-1.5 !text-white text-[12.5px] font-semibold transition-opacity hover:opacity-80 min-[1440px]:min-w-[70px] min-[1440px]:text-[13px] min-[1800px]:text-[14px]",
  categoryIcon:
    "h-7 w-7 text-white stroke-white stroke-[1.55] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 min-[1440px]:h-8 min-[1440px]:w-8 min-[1800px]:h-9 min-[1800px]:w-9",
  gastronomyIcon:
    "-my-1 h-9 w-9 text-white stroke-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 min-[1440px]:h-10 min-[1440px]:w-10 min-[1800px]:h-11 min-[1800px]:w-11",
  transferIcon:
    "h-7 w-10 object-contain text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 min-[1440px]:h-8 min-[1440px]:w-[46px] min-[1800px]:h-9 min-[1800px]:w-[50px]",
  searchWrap: "mt-5 w-full max-w-[760px] max-[640px]:hidden min-[641px]:max-[1024px]:mt-8 min-[641px]:max-[1024px]:w-fit min-[641px]:max-[1024px]:max-w-full min-[1440px]:mt-6 min-[1440px]:max-w-[860px] min-[1800px]:max-w-[940px]",
  ctaBlock:
    "relative mt-6 flex w-full max-w-[760px] flex-col items-start gap-3.5 pt-4 max-[640px]:hidden " +
    "min-[1440px]:mt-7 min-[1440px]:max-w-[860px] min-[1440px]:gap-4 min-[1440px]:pt-5 min-[1800px]:max-w-[940px] " +
    "before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] " +
    "before:bg-[linear-gradient(90deg,rgba(157,180,255,.58),rgba(157,180,255,.16)_58%,transparent)]",
  ctaCopy: "min-w-0 max-w-[560px]",
  ctaPrompt:
    "font-display text-[22px] font-medium leading-[1.15] tracking-[-.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.35)] min-[1440px]:text-[25px] min-[1800px]:text-[27px]",
  ctaPrimary:
    "group/quote relative inline-flex min-h-[46px] min-w-[240px] shrink-0 items-center justify-center gap-3 overflow-hidden rounded-[12px] " +
    "border border-white/15 bg-sapphire-top px-7 text-[15px] font-bold text-white " +
    "shadow-[0_14px_34px_-16px_rgba(0,79,230,.85)] ring-1 ring-[#8eb0ff]/15 transition-all duration-200 " +
    "before:absolute before:inset-y-0 before:start-[-45%] before:w-[38%] before:skew-x-[-18deg] before:bg-white/12 before:content-[''] before:transition-[left] before:duration-500 " +
    "hover:-translate-y-0.5 hover:border-white/25 hover:bg-sapphire hover:shadow-[0_18px_38px_-15px_rgba(0,79,230,.95)] hover:before:start-[120%] " +
    "min-[1440px]:min-h-[52px] min-[1440px]:min-w-[270px] min-[1440px]:px-9 min-[1440px]:text-[16px] min-[1800px]:min-h-[56px] min-[1800px]:min-w-[290px] min-[1800px]:text-[17px] " +
    "[&>span]:relative [&>svg]:relative [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform group-hover/quote:[&_svg]:translate-x-1 rtl:group-hover/quote:[&_svg]:-translate-x-1",
  mobileCtas: "mt-6 hidden w-full flex-col gap-3 max-[640px]:flex",
  mobileCtaRow: "flex w-full",
  mobileCtaPrimary:
    "flex h-[52px] w-full items-center justify-center rounded-xl bg-white px-4 text-[14.5px] font-bold text-brand " +
    "shadow-[0_18px_38px_-18px_rgba(0,0,0,.55)] transition-transform active:scale-[.97]",
  mobileCtaGhost:
    "flex h-[48px] w-full items-center justify-center rounded-xl border border-white/25 bg-white/[.12] px-4 " +
    "text-[14px] font-bold text-white backdrop-blur-md transition-colors active:bg-white/20",
  // Mobil: 3 satırlık grid yerine tek satır yatay şerit — ilk ekranda ~125px yer açar.
  // Kenardaki solma + yarım görünen chip, kaydırılabildiğini gösterir (RTL'de aynası).
  mobileCategories:
    "mt-5 hidden w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-1 max-[640px]:flex " +
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
    "[mask-image:linear-gradient(90deg,#000_86%,transparent)] [-webkit-mask-image:linear-gradient(90deg,#000_86%,transparent)] " +
    "rtl:[mask-image:linear-gradient(270deg,#000_86%,transparent)] rtl:[-webkit-mask-image:linear-gradient(270deg,#000_86%,transparent)]",
  mobileCategoryLink:
    "flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#071a52]/75 px-3.5 py-2 text-[12px] font-bold leading-tight text-white backdrop-blur-md " +
    "[&_img]:h-4 [&_img]:w-4 [&_img]:shrink-0",
  // Mobilde akışa girer (static): alta demirlenirse tarayıcı çubuğu kayarken içerikle
  // arasındaki boşluk oynuyordu; akışta içeriğin hemen ardından sabit durur.
  marquee:
    "pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-white/20 max-[640px]:static " +
    "bg-white/[.06] backdrop-blur-xl backdrop-saturate-150 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_-12px_32px_-18px_rgba(1,8,47,.6)] " +
    "[&_*]:pointer-events-auto",
  stats:
    "mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 max-[640px]:hidden " +
    "min-[641px]:max-[1024px]:mt-14 min-[641px]:max-[1024px]:flex-nowrap min-[641px]:max-[1024px]:items-baseline min-[641px]:max-[1024px]:gap-x-9 min-[641px]:max-[1024px]:ps-[28px]",
  stat:
    "flex items-baseline gap-1.5 " +
    "before:me-5 before:hidden before:h-1 before:w-1 before:rounded-full before:bg-white/30 before:content-[''] " +
    "[&:not(:first-child)]:before:inline-block " +
    "min-[641px]:max-[1024px]:flex-col min-[641px]:max-[1024px]:items-start min-[641px]:max-[1024px]:gap-0.5 " +
    "min-[641px]:max-[1024px]:[&:not(:first-child)]:before:!hidden",
  statNum: "font-display text-[23px] font-semibold tracking-tight text-white min-[641px]:max-[1024px]:text-[32px] min-[641px]:max-[1024px]:leading-none",
  statLabel: "text-[13px] font-medium text-white/60 min-[641px]:max-[1024px]:text-[14px]",
} as const;

export default styles;

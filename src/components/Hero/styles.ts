/* Hero — statik marketing görseli + sola hizalı içerik. */
 const styles= {
  // İlk ekranı doldurur ama ona kilitlenmez (min-h → içerik uzarsa hero büyür, kırpılmaz).
  // Ölçü svh: Safari'de scroll'la adres/araç çubuğu daralsa da SABİT kalır — dvh olsaydı
  // hero uzayıp görseli esnetirdi. Marquee de mobilde akışta (flex sonu) olduğundan
  // içerikle arasındaki boşluk viewport değişiminden etkilenmez.
  // Mobilde hero viewport yüksekliğine BAĞLANMAZ (min-h-0): Safari'de alt/üst çubuk
  // gizlenince viewport değişir, viewport'a kilitli bir hero + flex-1 içerik marquee'yi
  // aşağı-yukarı oynatır (zıplama). İçerik-yüksekliği hero'da oynayacak bir şey kalmaz;
  // marquee içeriğin hemen ardından sabit durur, altından VİTRİN bölümü akışta gelir.
  section:
    "relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden " +
    "bg-white dark:bg-panel-bg " +
    "max-[640px]:min-h-0",
  picture:
    "absolute inset-0 -z-10 overflow-hidden",
  pictureLight: "block bg-white dark:hidden",
  pictureDark: "hidden bg-panel-bg dark:block",
  image: "h-full w-full object-cover transition-opacity duration-300",
  imageLight:
    "object-[66%_center] brightness-[.96] saturate-[.94] " +
    "max-[1024px]:object-[62%_65%] max-[1024px]:opacity-48 max-[640px]:object-center max-[640px]:opacity-30",
  imageDark:
    "object-[66%_center] brightness-[1.16] saturate-[.94] " +
    "max-[1024px]:object-[62%_65%] max-[640px]:object-center",
  // Görsel tüm hero alanını doldurur (object-cover) — üst/alt boşluk ya da
  // dikiş olmaz. Sahne 2:1: küre sağda, sol taraf metin için koyu boş alan.
  // Yalnız telefon kendi dikey görselini kullanır; tablet masaüstü sahnesini paylaşır.
  // Masaüstünde görsel çok doygun/parlak mor → hafif desatüre + koyulaştır ki
  // mor "aksan" olsun, tüm alanı kaplayan boğucu bir zemin olmasın.
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
    // Mobilde flex-1 stretch KAPALI + min-h yok: içerik doğal yükseklikte kalır ki
    // viewport değişince (Safari çubuğu) marquee konumu oynamasın.
    "max-[640px]:flex-none max-[640px]:min-h-0 max-[640px]:justify-start max-[640px]:pt-[112px] max-[640px]:pb-8",
  title:
    "heading-hero max-w-[20ch] [text-wrap:balance] [color:rgb(var(--tp-hero-title))] max-[640px]:max-w-[12ch] max-[640px]:text-[38px] max-[640px]:leading-[1.12] max-[640px]:tracking-[-.025em] max-[640px]:[&_em]:block max-[640px]:[&_em]:whitespace-nowrap " +
    "min-[641px]:max-[1024px]:!text-[4.25rem] min-[641px]:max-[1024px]:!leading-[1.14] min-[641px]:max-[1024px]:!tracking-[-.02em] " +
    // Masaüstü tabanı biraz küçültüldü (nefes alanı) — heading-hero clamp'ini ezer.
    "min-[1025px]:!text-[64px] min-[1025px]:!leading-[1.13] " +
    // Dev başlık yalnız geniş VE yüksek ekranlarda; 1600×900 laptop'ta taban ölçü kalır.
    "[@media(min-width:1440px)_and_(min-height:940px)]:!text-[74px] " +
    "[@media(min-width:1440px)_and_(min-height:940px)]:!leading-[1.08] " +
    "[@media(min-width:1800px)_and_(min-height:940px)]:!text-[80px] " +
    "[&_em]:not-italic [&_em]:[color:rgb(var(--tp-hero-highlight))]",
  eyebrow:
    "mb-2.5 text-[13px] font-extrabold uppercase tracking-[.16em] [color:rgb(var(--tp-hero-eyebrow))] min-[1440px]:mb-3 min-[1440px]:text-[14px] max-[640px]:mb-2 max-[640px]:text-[11px]",
  // Mobilde açıklama başlığın altında değil, teklif butonunun hemen üstünde durur.
  mobileIntro:
    "hidden max-w-[34ch] text-[13.5px] font-medium leading-5 text-muted dark:text-white/70 max-[640px]:block",
  categories:
    "mt-6 flex items-start gap-3 text-brand max-[1100px]:gap-3 max-[640px]:hidden min-[1440px]:mt-8 min-[1440px]:gap-8 min-[1800px]:gap-9",
  categoryLink:
    "group flex min-w-[62px] flex-col items-center gap-1.5 !text-brand/55 text-[12.5px] font-semibold transition-colors hover:!text-royal-purple dark:!text-white/85 dark:hover:!text-white min-[1440px]:min-w-[70px] min-[1440px]:text-[13px] min-[1800px]:text-[14px]",
  categoryIcon:
    "h-7 w-7 opacity-[.55] [filter:brightness(0)_saturate(100%)_invert(13%)_sepia(92%)_saturate(3447%)_hue-rotate(255deg)_brightness(76%)_contrast(108%)] transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:brightness(0)_saturate(100%)_invert(21%)_sepia(94%)_saturate(3692%)_hue-rotate(258deg)_brightness(88%)_contrast(94%)] dark:opacity-95 dark:[filter:brightness(0)_invert(1)] dark:group-hover:opacity-100 min-[1440px]:h-8 min-[1440px]:w-8 min-[1800px]:h-9 min-[1800px]:w-9",
  gastronomyIcon:
    "-my-1 h-9 w-9 opacity-[.55] [filter:brightness(0)_saturate(100%)_invert(13%)_sepia(92%)_saturate(3447%)_hue-rotate(255deg)_brightness(76%)_contrast(108%)] transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:brightness(0)_saturate(100%)_invert(21%)_sepia(94%)_saturate(3692%)_hue-rotate(258deg)_brightness(88%)_contrast(94%)] dark:opacity-95 dark:[filter:brightness(0)_invert(1)] dark:group-hover:opacity-100 min-[1440px]:h-10 min-[1440px]:w-10 min-[1800px]:h-11 min-[1800px]:w-11",
  transferIcon:
    "h-7 w-10 object-contain opacity-[.55] [filter:brightness(0)_saturate(100%)_invert(13%)_sepia(92%)_saturate(3447%)_hue-rotate(255deg)_brightness(76%)_contrast(108%)] transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:brightness(0)_saturate(100%)_invert(21%)_sepia(94%)_saturate(3692%)_hue-rotate(258deg)_brightness(88%)_contrast(94%)] dark:opacity-95 dark:[filter:brightness(0)_invert(1)] dark:group-hover:opacity-100 min-[1440px]:h-8 min-[1440px]:w-[46px] min-[1800px]:h-9 min-[1800px]:w-[50px]",
  searchWrap: "mt-5 w-full max-w-[760px] max-[640px]:hidden min-[641px]:max-[1024px]:mt-8 min-[641px]:max-[1024px]:w-fit min-[641px]:max-[1024px]:max-w-full min-[1440px]:mt-6 min-[1440px]:max-w-[860px] min-[1800px]:max-w-[940px]",
  ctaBlock:
    "relative mt-6 flex w-full max-w-[760px] flex-col items-start gap-3.5 pt-4 max-[640px]:hidden " +
    "min-[1440px]:mt-7 min-[1440px]:max-w-[860px] min-[1440px]:gap-4 min-[1440px]:pt-5 min-[1800px]:max-w-[940px] " +
    "before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] " +
    "before:bg-[linear-gradient(90deg,rgba(97,45,181,.28),rgba(97,45,181,.08)_58%,transparent)] dark:before:bg-[linear-gradient(90deg,rgba(255,255,255,.15),rgba(255,255,255,.04)_58%,transparent)]",
  ctaCopy: "min-w-0 max-w-[560px]",
  ctaPrompt:
    "font-display text-[22px] font-medium leading-[1.15] tracking-[-.01em] text-ink dark:text-white/90 min-[1440px]:text-[25px] min-[1800px]:text-[27px]",
  // İkincil aksiyon (Search birincil dolu mor buton). Sadeleştirme: dolu mor
  // yerine cam/outline — tek dolu mor buton kalsın, hiyerarşi netleşsin.
  ctaPrimary:
    "group/quote relative inline-flex min-h-[46px] min-w-[240px] shrink-0 items-center justify-center gap-3 rounded-[12px] " +
    "border border-brand/30 bg-paper/70 px-7 text-[15px] font-bold text-brand backdrop-blur-sm dark:border-white/35 dark:bg-white/[.07] dark:text-white dark:backdrop-blur-xl " +
    "shadow-[0_12px_30px_-22px_rgba(74,26,151,.55)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/55 hover:bg-paper dark:shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_18px_40px_-26px_rgba(0,0,0,.8)] dark:hover:border-white/55 dark:hover:bg-white/[.12] " +
    "min-[1440px]:min-h-[52px] min-[1440px]:min-w-[270px] min-[1440px]:px-9 min-[1440px]:text-[16px] min-[1800px]:min-h-[56px] min-[1800px]:min-w-[290px] min-[1800px]:text-[17px] " +
    "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform group-hover/quote:[&_svg]:translate-x-1 rtl:group-hover/quote:[&_svg]:-translate-x-1",
  mobileCtas: "mt-6 hidden w-full flex-col gap-3 max-[640px]:flex",
  mobileCtaRow: "flex w-full",
  mobileCtaPrimary:
    "flex h-[52px] w-full items-center justify-center rounded-xl bg-brand px-4 text-[14.5px] font-bold text-white " +
    "shadow-[0_18px_38px_-18px_rgba(74,26,151,.65)] transition-all active:scale-[.97] active:bg-brand-deep",
  mobileCtaGhost:
    "flex h-[48px] w-full items-center justify-center rounded-xl border border-brand/20 bg-paper/75 px-4 " +
    "text-[14px] font-bold text-brand backdrop-blur-md transition-colors active:bg-brand/5 dark:border-white/20 dark:text-white dark:active:bg-white/10",
  // Mobil: yatay kaydırma yerine 4 sütunlu ikon grid (2 satır: 4+3). Tüm kategoriler
  // tek ekranda görünür — gizli içerik / kaydırma ipucu gerektiren şerit kalktı.
  mobileCategories:
    "mt-5 hidden w-full grid-cols-4 gap-x-2 gap-y-4 max-[640px]:grid",
  mobileCategoryLink:
    "flex flex-col items-center gap-1.5 text-center text-[11px] font-semibold leading-tight text-brand/60 dark:text-white/85 " +
    "[&_img]:h-6 [&_img]:w-6 [&_img]:shrink-0 [&_img]:opacity-[.55] [&_img]:[filter:brightness(0)_saturate(100%)_invert(13%)_sepia(92%)_saturate(3447%)_hue-rotate(255deg)_brightness(76%)_contrast(108%)] dark:[&_img]:opacity-95 dark:[&_img]:[filter:brightness(0)_invert(1)]",
  // Mobilde akışa girer (static): alta demirlenirse tarayıcı çubuğu kayarken içerikle
  // arasındaki boşluk oynuyordu; akışta içeriğin hemen ardından sabit durur.
  marquee:
    "pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-line/55 max-[640px]:static " +
    "bg-paper/70 backdrop-blur-xl backdrop-saturate-150 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,.38),0_-12px_32px_-24px_rgba(74,26,151,.28)] " +
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

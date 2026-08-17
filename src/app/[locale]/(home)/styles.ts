// Anasayfa bölümleri — normal dikey akış (standart scroll). Eski ReelDeck
// (Reels tarzı tam-sayfa panel destesi) kaldırıldı; bölümler art arda akar.

// Tüm bölümlerde ortak taban: container-px hizası + simetrik dikey ritim.
// Tek kaynak: dikey boşluğu değiştirmek için yalnızca burayı düzenle.
const sectionBase =
  "container-px flex w-full flex-col items-center gap-10 bg-transparent py-16 " +
  "min-[1440px]:py-20 min-[1800px]:py-24 max-[900px]:py-12 max-[640px]:py-10";

const styles = {
  // Hero yüksekliğini kendi içinde taşır (bkz. components/Hero/styles.ts → section).
  section: sectionBase,
  // Masaüstünde DOM akışını değiştirmez; mobilde Kategoriler, Vitrin'in önüne geçer.
  discoverySections: "contents max-[640px]:flex max-[640px]:w-full max-[640px]:flex-col",
  showcaseSection: "max-[640px]:order-2",
  categoriesSection: "max-[640px]:order-1",
  // İçerik container-px kutusunu doldurur — Hero/Footer ile aynı sol/sağ hizada kalır.
  inner: "w-full",
  // SSS bölümü: üstte FAQ, altta güven rozetleri (rozetler kendi aralarında yan yana).
  faqStack: "flex w-full flex-col gap-8 min-[1440px]:gap-10 min-[1800px]:gap-12 max-[1024px]:gap-7 max-[860px]:gap-6 max-[640px]:gap-5",
} as const;

export default styles;

// Anasayfa bölümleri — normal dikey akış (standart scroll). Eski ReelDeck
// (Reels tarzı tam-sayfa panel destesi) kaldırıldı; bölümler art arda akar.

// Tüm bölümlerde ortak taban: container-px hizası + simetrik dikey ritim.
// Tek kaynak: dikey boşluğu değiştirmek için yalnızca burayı düzenle.
const sectionBase =
  "container-px flex w-full flex-col items-center gap-10 bg-transparent py-16 " +
  "min-[1440px]:py-20 min-[1800px]:py-24 max-[900px]:py-12 max-[640px]:py-10";

const styles = {
  // Hero ilk ekranı doldurur (kendi glass header'ını hero görselinin üzerine bindirir).
  // Kesin yükseklik: Hero kökü h-full olduğundan (marquee absolute bottom-0) zincirin
  // çözülmesi için yüzdesel değil sabit 100dvh gerekir — aksi halde altta boşluk kalır.
  hero: "relative h-[100dvh] w-full bg-transparent",
  heroFill: "relative h-full w-full",
  section: sectionBase,
  // İçerik container-px kutusunu doldurur — Hero/Footer ile aynı sol/sağ hizada kalır.
  inner: "w-full",
  // SSS bölümü: üstte FAQ, altta güven rozetleri (rozetler kendi aralarında yan yana).
  faqStack: "flex w-full flex-col gap-8 min-[1440px]:gap-10 min-[1800px]:gap-12 max-[1024px]:gap-7 max-[860px]:gap-6 max-[640px]:gap-5",
} as const;

export default styles;

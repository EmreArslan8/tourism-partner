// ReelDeck panelleri — her panel 100dvh, yüksekliği ReelDeck sarmalayıcısı verir.

// Tüm panellerde ortak taban: container-px hizası + 100dvh + sabit/simetrik dikey ritim.
// Tek kaynak: dikey boşluğu değiştirmek için yalnızca burayı düzenle.
const panelBase =
  "container-px flex h-full w-full flex-col items-center justify-center overflow-hidden bg-cream py-8 " +
  "max-[1120px]:justify-start max-[900px]:py-6 max-[640px]:py-5";

const styles = {
  panelDark: "relative flex h-full w-full flex-col bg-pine",
  heroFill: "relative min-h-0 flex-1",
  // Marka şeridi hero fotoğrafının ÜZERİNE biner (ayrı zemin yok → renk dikişi imkânsız).
  // Okunabilirlik için alttan yukarı şeffaflaşan yumuşak karartma; kenar çizgisi yok.
  // Üstte içerikten ayıran ince çizgi (hairline) — ortada belirgin, kenarlara doğru erir.
  brandStrip:
    "absolute inset-x-0 bottom-0 z-10 " +
    "bg-[linear-gradient(180deg,rgba(5,8,30,0)_0%,rgba(5,8,30,.55)_45%,rgba(5,8,30,.88)_100%)] " +
    "before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] " +
    "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.22)_18%,rgba(255,255,255,.22)_82%,transparent)]",
  panelLight: `${panelBase} max-[640px]:justify-start`,
  // Bölgeler: mobilde üste yaslı (uzun içerik), ≥641'de ortalı.
  panelRegions: `${panelBase} max-[640px]:justify-start`,
  panelCategories:
    `${panelBase} justify-start pt-[clamp(24px,5vh,64px)] pb-6 ` +
    "[@media_(min-width:641px)_and_(max-width:1100px)_and_(orientation:portrait)]:justify-center " +
    "[@media_(min-width:641px)_and_(max-width:1100px)_and_(orientation:portrait)]:py-6",
  panelTour: `${panelBase} bg-[#F6F8FC]`,
  panelFaq: `${panelBase} max-[640px]:justify-start`,
  panelStack: `${panelBase} gap-5 max-[640px]:gap-1.5`,
  // İçerik container-px kutusunu doldurur — Hero/Header/Footer ile aynı sol/sağ hizada kalır.
  inner: "w-full",
  innerWide: "h-full min-h-0 w-full",
  // SSS paneli: üstte FAQ, altta güven rozetleri (rozetler kendi aralarında yan yana).
  faqStack: "flex w-full flex-col gap-16 max-[1024px]:gap-14 max-[860px]:gap-8 max-[640px]:gap-5",
} as const;

export default styles;

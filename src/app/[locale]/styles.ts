// ReelDeck panelleri — her panel 100dvh, yüksekliği ReelDeck sarmalayıcısı verir.

// Tüm panellerde ortak taban: container-px hizası + 100dvh + sabit/simetrik dikey ritim.
// Tek kaynak: dikey boşluğu değiştirmek için yalnızca burayı düzenle.
const panelBase =
  "container-px flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper py-[72px] max-[640px]:py-6";

const styles = {
  panelDark: "flex h-full w-full flex-col bg-pine",
  heroFill: "relative min-h-0 flex-1",
  brandStrip: "shrink-0 border-t border-white/10 bg-paper",
  panelLight: `${panelBase} max-[640px]:justify-start`,
  // Bölgeler: mobilde üste yaslı (uzun içerik), ≥641'de ortalı.
  panelRegions: `${panelBase} max-[640px]:justify-start`,
  panelCategories: panelBase,
  panelFaq: `${panelBase} max-[640px]:justify-start`,
  panelStack: `${panelBase} gap-5 max-[640px]:gap-[12.8px]`,
  // İçerik container-px kutusunu doldurur — Hero/Header/Footer ile aynı sol/sağ hizada kalır.
  inner: "w-full",
  innerWide: "h-full min-h-0 w-full",
  // SSS paneli: üstte FAQ, altta güven rozetleri (rozetler kendi aralarında yan yana).
  faqStack: "flex w-full flex-col gap-8 max-[860px]:gap-6",
} as const;

export default styles;

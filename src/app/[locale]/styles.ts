// ReelDeck panelleri — her panel 100dvh, yüksekliği ReelDeck sarmalayıcısı verir.
const styles = {
  panelDark: "flex h-full w-full flex-col bg-pine",
  heroFill: "relative min-h-0 flex-1",
  brandStrip: "shrink-0 border-t border-white/10 bg-paper",
  panelLight: "container-px flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper pt-[84px] pb-10 max-[640px]:pt-[76px] max-[640px]:pb-6",
  // Bölgeler: mobilde üste yaslı + dar üst boşluk (ana sayfada sabit header yok, pt-76 boşa gidiyordu), ≥641'de ortalı.
  panelRegions: "container-px flex h-full w-full flex-col items-center justify-start min-[641px]:justify-center overflow-hidden bg-paper pt-[84px] pb-10 max-[640px]:pt-7 max-[640px]:pb-6",
  panelCategories: "container-px flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper py-[60px] max-[640px]:py-5",
  panelFaq: "container-px flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper pt-10 pb-8 max-[640px]:pt-6 max-[640px]:pb-5",
  panelStack: "container-px flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-paper pt-8 pb-7 max-[640px]:gap-5 max-[640px]:pt-6 max-[640px]:pb-5",
  inner: "w-full max-w-[1240px]",
  innerWide: "h-full min-h-0 w-full max-w-[1500px]",
} as const;

export default styles;

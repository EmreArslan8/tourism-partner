/* Koyu zeminler hero-2.webp'den örneklendi: kenarlar #01094a–#020c49, baskın orta mavi
   #0a3297, derin ton #00136b. Zemin token'ları bu görselle aynı ailede kalmalı. */
export const palette = {
  pine: "#01082f",
  pineSoft: "#12237f",
  /* İç sayfa zemini — marka rengi sapphire'in (#0f3bb0) açık "wash"ı. Landing hero + butonlarla
     aynı mavi aileden; kartlar `paper` (beyaz) kaldığı için zeminin üstünde net öne çıkar. */
  cream: "#dbe3f5",
  creamDeep: "#c9d5ef",
  /* Panel/workspace zemini — sakin operasyon ekranları için eski özel zemin rengi. */
  panelBg: "#f6f9fd",
  paper: "#ffffff",
  /* Sapphire — hero görseliyle aynı aile, koyu zemin. Ana: #01145D · Parlak: #004FE6 · Gece: #010B3A. */
  sapphire: "#01145d",
  sapphireTop: "#004fe6",
  sapphireDeep: "#010b3a",
  terra: "#01145d",
  terraDeep: "#010b3a",
  gold: "#8ea2ff",
  /* Değerlendirme yıldızları — sarı. */
  star: "#f5b301",
  brandBlue: "#0f3bb0",
  /* Logodan örneklenen marka mavileri (TOURISM PARTNER wordmark). */
  brand: "#0a2472",
  brandDeep: "#071a52",
  ink: "#0b102f",
  muted: "#5c6684",
  line: "#c6d2ec",
} as const;

/* Kategori (ana grup) renkleri — katalog noktaları ve kart kapakları için. */
export const groupPalette = {
  konaklama: "#3542ee",
  acente: "#172178",
  ulasim: "#0a56c2",
  rehber: "#5b6cff",
  aktivite: "#0e75cf",
  saglik: "#0891b2",
  gastronomi: "#2f6fd6",
} as const;

export type PaletteKey = keyof typeof palette;
export type GroupColorKey = keyof typeof groupPalette;

/* Tailwind `theme.colors` için düz harita (kebab-case anahtarlar). */
export const tailwindColors = {
  pine: palette.pine,
  "pine-soft": palette.pineSoft,
  cream: palette.cream,
  "cream-deep": palette.creamDeep,
  "panel-bg": palette.panelBg,
  paper: palette.paper,
  sapphire: palette.sapphire,
  "sapphire-top": palette.sapphireTop,
  "sapphire-deep": palette.sapphireDeep,
  terra: palette.terra,
  "terra-deep": palette.terraDeep,
  gold: palette.gold,
  star: palette.star,
  "brand-blue": palette.brandBlue,
  brand: palette.brand,
  "brand-deep": palette.brandDeep,
  ink: palette.ink,
  muted: palette.muted,
  line: palette.line,
  group: {
    konaklama: groupPalette.konaklama,
    acente: groupPalette.acente,
    ulasim: groupPalette.ulasim,
    rehber: groupPalette.rehber,
    aktivite: groupPalette.aktivite,
    saglik: groupPalette.saglik,
    gastronomi: groupPalette.gastronomi,
  },
} as const;

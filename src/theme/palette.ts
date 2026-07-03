export const palette = {
  pine: "#07092a",
  pineSoft: "#172178",
  /* İç sayfa zemini — marka rengi sapphire'in (#0f3bb0) açık "wash"ı. Landing hero + butonlarla
     aynı mavi aileden; kartlar `paper` (beyaz) kaldığı için zeminin üstünde net öne çıkar. */
  cream: "#dbe3f5",
  creamDeep: "#c9d5ef",
  paper: "#ffffff",
  /* Sapphire — resmî palet. Ana: #0F3BB0 · Parlak: #004FE6 · Gece: #0A2472. */
  sapphire: "#0f3bb0",
  sapphireTop: "#004fe6",
  sapphireDeep: "#0a2472",
  terra: "#0f3bb0",
  terraDeep: "#0a2472",
  gold: "#8ea2ff",
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
} as const;

export type PaletteKey = keyof typeof palette;
export type GroupColorKey = keyof typeof groupPalette;

/* Tailwind `theme.colors` için düz harita (kebab-case anahtarlar). */
export const tailwindColors = {
  pine: palette.pine,
  "pine-soft": palette.pineSoft,
  cream: palette.cream,
  "cream-deep": palette.creamDeep,
  paper: palette.paper,
  sapphire: palette.sapphire,
  "sapphire-top": palette.sapphireTop,
  "sapphire-deep": palette.sapphireDeep,
  terra: palette.terra,
  "terra-deep": palette.terraDeep,
  gold: palette.gold,
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
  },
} as const;

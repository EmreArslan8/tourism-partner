/* ============================================================
   palette.ts — projedeki tek renk kaynağı.
   Tailwind config buradan beslenir; component'ler `bg-terra`,
   `text-ink`, `border-line` gibi token sınıflarını kullanır.
   ============================================================ */

export const palette = {
  pine: "#07092a",
  pineSoft: "#172178",
  cream: "#f6f8ff",
  creamDeep: "#e7ecff",
  paper: "#ffffff",
  terra: "#3542ee",
  terraDeep: "#1724a6",
  gold: "#8ea2ff",
  brandBlue: "#3542ee",
  /* Logodan örneklenen marka mavileri (TOURISM PARTNER wordmark). */
  brand: "#1a1778",
  brandDeep: "#11104f",
  ink: "#0b102f",
  muted: "#66708f",
  line: "#d8dffc",
} as const;

/* Kategori (ana grup) renkleri — katalog noktaları ve kart kapakları için. */
export const groupPalette = {
  konaklama: "#3542ee",
  acente: "#172178",
  rehber: "#5b6cff",
  eglence: "#0e75cf",
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
    rehber: groupPalette.rehber,
    eglence: groupPalette.eglence,
    saglik: groupPalette.saglik,
  },
} as const;

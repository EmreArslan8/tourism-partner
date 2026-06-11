/* ============================================================
   palette.ts — projedeki tek renk kaynağı.
   Tailwind config buradan beslenir; component'ler `bg-terra`,
   `text-ink`, `border-line` gibi token sınıflarını kullanır.
   ============================================================ */

export const palette = {
  pine: "#101828",
  pineSoft: "#1f3558",
  cream: "#f5f6f8",
  creamDeep: "#e7ebf1",
  paper: "#ffffff",
  terra: "#537f9b",
  terraDeep: "#3d637c",
  gold: "#c8a45d",
  brandBlue: "#2744d6",
  ink: "#111827",
  muted: "#667085",
  line: "#d9dee8",
} as const;

/* Kategori (ana grup) renkleri — katalog noktaları ve kart kapakları için. */
export const groupPalette = {
  konaklama: "#b9934b",
  acente: "#356da8",
  rehber: "#7d6f9e",
  eglence: "#c2683f",
  saglik: "#3f8c79",
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

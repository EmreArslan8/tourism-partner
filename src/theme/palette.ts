/**
 * Tourism Partner marka renkleri.
 *
 * Bu nesne renkler için tek kaynak noktasıdır. Tailwind renkleri, shadcn CSS
 * değişkenleri ve kategori renkleri aşağıdaki değerlerden türetilir.
 */
export const brandPalette = {
  royalPurple: "#6d28d9",
  deepPurple: "#4c1d95",
  midnightPurple: "#24113f",
  softLavender: "#ede9fe",
  ultraLightPurple: "#f7f5ff",
  white: "#ffffff",
  charcoal: "#17151c",
  slateGray: "#6b6675",
  borderPurple: "#ddd6fe",
} as const;

/**
 * Uygulamanın mevcut semantik renk adları yeni marka paletine bağlı kalır.
 * Böylece tüm ekranlar tek merkezden güncellenirken mevcut utility sınıfları
 * (`bg-sapphire`, `text-ink`, `border-line` vb.) geriye uyumlu çalışır.
 */
export const palette = {
  pine: brandPalette.midnightPurple,
  pineSoft: brandPalette.deepPurple,
  cream: brandPalette.softLavender,
  creamDeep: brandPalette.borderPurple,
  panelBg: brandPalette.ultraLightPurple,
  paper: brandPalette.white,
  sapphire: brandPalette.deepPurple,
  sapphireTop: brandPalette.royalPurple,
  sapphireDeep: brandPalette.midnightPurple,
  terra: brandPalette.royalPurple,
  terraDeep: brandPalette.deepPurple,
  gold: brandPalette.borderPurple,
  // Durum bildiren yıldız rengi marka paletinden bağımsız semantik renktir.
  star: "#f5b301",
  brandBlue: brandPalette.royalPurple,
  brand: brandPalette.deepPurple,
  brandDeep: brandPalette.midnightPurple,
  ink: brandPalette.charcoal,
  muted: brandPalette.slateGray,
  line: brandPalette.borderPurple,
} as const;

/** Kategori renkleri aynı marka ailesinin tonlarından türetilir. */
export const groupPalette = {
  konaklama: brandPalette.royalPurple,
  acente: brandPalette.deepPurple,
  ulasim: brandPalette.royalPurple,
  rehber: brandPalette.deepPurple,
  aktivite: brandPalette.royalPurple,
  saglik: brandPalette.deepPurple,
  gastronomi: brandPalette.midnightPurple,
} as const;

export type BrandPaletteKey = keyof typeof brandPalette;
export type PaletteKey = keyof typeof palette;
export type GroupColorKey = keyof typeof groupPalette;

const hexToHslChannels = (hex: string) => {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }

  if (hue < 0) hue += 360;
  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
};

/** shadcn bileşenlerinin kullandığı CSS değişkenleri de aynı kaynaktan üretilir. */
export const themeCssVariables = {
  "--background": hexToHslChannels(brandPalette.ultraLightPurple),
  "--foreground": hexToHslChannels(brandPalette.charcoal),
  "--card": hexToHslChannels(brandPalette.white),
  "--card-foreground": hexToHslChannels(brandPalette.charcoal),
  "--popover": hexToHslChannels(brandPalette.white),
  "--popover-foreground": hexToHslChannels(brandPalette.charcoal),
  "--primary": hexToHslChannels(brandPalette.royalPurple),
  "--primary-foreground": hexToHslChannels(brandPalette.white),
  "--secondary": hexToHslChannels(brandPalette.softLavender),
  "--secondary-foreground": hexToHslChannels(brandPalette.midnightPurple),
  "--muted": hexToHslChannels(brandPalette.softLavender),
  "--muted-foreground": hexToHslChannels(brandPalette.slateGray),
  "--accent": hexToHslChannels(brandPalette.softLavender),
  "--accent-foreground": hexToHslChannels(brandPalette.deepPurple),
  "--destructive": "0 72% 51%",
  "--destructive-foreground": hexToHslChannels(brandPalette.white),
  "--border": hexToHslChannels(brandPalette.borderPurple),
  "--input": hexToHslChannels(brandPalette.borderPurple),
  "--ring": hexToHslChannels(brandPalette.royalPurple),
} as const;

/** Tailwind `theme.colors` için düz harita (kebab-case anahtarlar). */
export const tailwindColors = {
  "royal-purple": brandPalette.royalPurple,
  "deep-purple": brandPalette.deepPurple,
  "midnight-purple": brandPalette.midnightPurple,
  "soft-lavender": brandPalette.softLavender,
  "ultra-light-purple": brandPalette.ultraLightPurple,
  charcoal: brandPalette.charcoal,
  "slate-gray": brandPalette.slateGray,
  "border-purple": brandPalette.borderPurple,
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

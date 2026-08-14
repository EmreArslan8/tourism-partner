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

/** Açık/koyu modun semantik rolleri. Koyu zemin hero görselinin sol alanından örneklendi. */
export const themePalettes = {
  light: {
    background: brandPalette.white,
    surface: brandPalette.white,
    surfaceSoft: brandPalette.softLavender,
    surfaceStrong: brandPalette.borderPurple,
    text: brandPalette.charcoal,
    textMuted: brandPalette.slateGray,
    border: brandPalette.borderPurple,
    primary: brandPalette.deepPurple,
    accent: brandPalette.royalPurple,
    interactiveText: brandPalette.deepPurple,
    heroTitle: brandPalette.charcoal,
    heroHighlight: brandPalette.deepPurple,
    heroEyebrow: brandPalette.deepPurple,
  },
  dark: {
    background: "#0d0a2f",
    surface: brandPalette.midnightPurple,
    surfaceSoft: brandPalette.midnightPurple,
    surfaceStrong: brandPalette.deepPurple,
    text: brandPalette.softLavender,
    textMuted: brandPalette.borderPurple,
    border: brandPalette.deepPurple,
    primary: brandPalette.deepPurple,
    accent: brandPalette.royalPurple,
    interactiveText: "#c4b5fd",
    heroTitle: brandPalette.white,
    heroHighlight: "#c4b5fd",
    heroEyebrow: "#a78bfa",
  },
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

const hexToRgbChannels = (hex: string) => {
  const value = hex.replace("#", "");
  return `${Number.parseInt(value.slice(0, 2), 16)} ${Number.parseInt(value.slice(2, 4), 16)} ${Number.parseInt(value.slice(4, 6), 16)}`;
};

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

const modeCssVariables = (mode: keyof typeof themePalettes) => {
  const colors = themePalettes[mode];
  const prefix = `--tp-${mode}`;
  return {
    [`${prefix}-pine`]: hexToRgbChannels(brandPalette.midnightPurple),
    [`${prefix}-pine-soft`]: hexToRgbChannels(brandPalette.deepPurple),
    [`${prefix}-cream`]: hexToRgbChannels(colors.surfaceSoft),
    [`${prefix}-cream-deep`]: hexToRgbChannels(colors.surfaceStrong),
    [`${prefix}-panel-bg`]: hexToRgbChannels(colors.background),
    [`${prefix}-paper`]: hexToRgbChannels(colors.surface),
    [`${prefix}-ink`]: hexToRgbChannels(colors.text),
    [`${prefix}-muted`]: hexToRgbChannels(colors.textMuted),
    [`${prefix}-line`]: hexToRgbChannels(colors.border),
    [`${prefix}-interactive`]: hexToRgbChannels(colors.interactiveText),
    [`${prefix}-hero-title`]: hexToRgbChannels(colors.heroTitle),
    [`${prefix}-hero-highlight`]: hexToRgbChannels(colors.heroHighlight),
    [`${prefix}-hero-eyebrow`]: hexToRgbChannels(colors.heroEyebrow),
    [`${prefix}-background`]: hexToHslChannels(colors.background),
    [`${prefix}-foreground`]: hexToHslChannels(colors.text),
    [`${prefix}-card`]: hexToHslChannels(colors.surface),
    [`${prefix}-card-foreground`]: hexToHslChannels(colors.text),
    [`${prefix}-popover`]: hexToHslChannels(colors.surface),
    [`${prefix}-popover-foreground`]: hexToHslChannels(colors.text),
    [`${prefix}-primary`]: hexToHslChannels(colors.primary),
    [`${prefix}-primary-foreground`]: hexToHslChannels(brandPalette.white),
    [`${prefix}-secondary`]: hexToHslChannels(colors.surfaceSoft),
    [`${prefix}-secondary-foreground`]: hexToHslChannels(colors.text),
    [`${prefix}-muted-surface`]: hexToHslChannels(colors.surfaceSoft),
    [`${prefix}-muted-foreground`]: hexToHslChannels(colors.textMuted),
    [`${prefix}-accent`]: hexToHslChannels(colors.accent),
    [`${prefix}-accent-foreground`]: hexToHslChannels(brandPalette.white),
    [`${prefix}-border`]: hexToHslChannels(colors.border),
    [`${prefix}-input`]: hexToHslChannels(colors.border),
    [`${prefix}-ring`]: hexToHslChannels(colors.accent),
  };
};

/** Her iki modun CSS değişkenleri de tema kaynağından üretilip root layout'a yazılır. */
export const themeCssVariables = {
  ...modeCssVariables("light"),
  ...modeCssVariables("dark"),
  "--destructive": "0 72% 51%",
  "--destructive-foreground": hexToHslChannels(brandPalette.white),
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
  pine: "rgb(var(--tp-pine) / <alpha-value>)",
  "pine-soft": "rgb(var(--tp-pine-soft) / <alpha-value>)",
  cream: "rgb(var(--tp-cream) / <alpha-value>)",
  "cream-deep": "rgb(var(--tp-cream-deep) / <alpha-value>)",
  "panel-bg": "rgb(var(--tp-panel-bg) / <alpha-value>)",
  paper: "rgb(var(--tp-paper) / <alpha-value>)",
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
  ink: "rgb(var(--tp-ink) / <alpha-value>)",
  muted: "rgb(var(--tp-muted) / <alpha-value>)",
  line: "rgb(var(--tp-line) / <alpha-value>)",
  interactive: "rgb(var(--tp-interactive) / <alpha-value>)",
  "hero-title": "rgb(var(--tp-hero-title) / <alpha-value>)",
  "hero-highlight": "rgb(var(--tp-hero-highlight) / <alpha-value>)",
  "hero-eyebrow": "rgb(var(--tp-hero-eyebrow) / <alpha-value>)",
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

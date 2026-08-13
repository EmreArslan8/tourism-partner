import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import {
  tailwindColors,
  palette,
  fontFamily,
  fontSize,
  borderRadius,
  boxShadow,
  easing,
  keyframes,
  animation,
  letterSpacing,
  spacing,
} from "./src/theme";

/* shadcn/ui token'ları — CSS değişkenlerine bağlı (globals.css :root).
   Mevcut tema renklerini (terra/cream/ink…) ezmez; yalnızca yeni adlar ekler.
   Public site bu sınıfları kullanmaz, davranışlı admin bileşenleri kullanır. */
const shadcnColors = {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
  secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
  destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
  // Not: `muted` bilerek burada tanımlı DEĞİL — palette.ts'teki muted (#5c6684) kazansın diye.
  // shadcn'in açık gri --muted'ı `text-muted`'ı görünmez yapıyordu (sidebar linkleri vb.).
  accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
  popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
  card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
};

/* Tremor tema token'ları — Tremor bileşenleri (tooltip/legend/BarList) bu adları bekler.
   Mevcut tema renklerini ezmez; yalnızca `tremor`/`dark-tremor` altında yeni adlar ekler.
   Değerler mevcut paletten türetildi (sapphire/paper/ink/muted/line/cream). */
const tremorColors = {
  tremor: {
    brand: {
      faint: palette.cream,
      muted: palette.creamDeep,
      subtle: palette.sapphireTop,
      DEFAULT: palette.sapphire,
      emphasis: palette.sapphireDeep,
      inverted: palette.paper,
    },
    background: {
      muted: palette.panelBg,
      subtle: palette.cream,
      DEFAULT: palette.paper,
      emphasis: palette.muted,
    },
    border: { DEFAULT: palette.line },
    ring: { DEFAULT: palette.line },
    content: {
      subtle: palette.muted,
      DEFAULT: palette.muted,
      emphasis: palette.ink,
      strong: palette.ink,
      inverted: palette.paper,
    },
  },
  "dark-tremor": {
    brand: {
      faint: palette.sapphireDeep,
      muted: palette.sapphire,
      subtle: palette.gold,
      DEFAULT: palette.gold,
      emphasis: palette.cream,
      inverted: palette.ink,
    },
    background: {
      muted: palette.pine,
      subtle: palette.pineSoft,
      DEFAULT: palette.ink,
      emphasis: palette.line,
    },
    border: { DEFAULT: palette.pineSoft },
    ring: { DEFAULT: palette.pineSoft },
    content: {
      subtle: palette.muted,
      DEFAULT: palette.creamDeep,
      emphasis: palette.cream,
      strong: palette.paper,
      inverted: palette.ink,
    },
  },
};

/* Tailwind teması projedeki theme/ klasöründen beslenir (tek kaynak). */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  /* Tremor grafiklerine `color="sapphire"` gibi palet adları geçiliyor; Tremor bu adlardan
     runtime'da sınıf ürettiği için kaynak taramasında görünmezler — burada sabitlenir. */
  safelist: [
    ...["sapphire", "gold", "cream", "line", "muted"].flatMap((color) => [
      `bg-${color}`,
      `fill-${color}`,
      `stroke-${color}`,
      `text-${color}`,
      `border-${color}`,
    ]),
  ],
  theme: {
    extend: {
      colors: { ...tailwindColors, ...shadcnColors, ...tremorColors },
      fontFamily: {
        display: [...fontFamily.display],
        body: [...fontFamily.body],
      },
      fontSize: {
        ...fontSize,
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      spacing,
      borderRadius: {
        ...borderRadius,
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      boxShadow: {
        ...boxShadow,
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      letterSpacing,
      transitionTimingFunction: { brand: easing.brand },
      keyframes,
      animation,
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

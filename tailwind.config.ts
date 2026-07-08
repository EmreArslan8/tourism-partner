import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import {
  tailwindColors,
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

/* Tailwind teması projedeki theme/ klasöründen beslenir (tek kaynak). */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ...tailwindColors, ...shadcnColors },
      fontFamily: {
        display: [...fontFamily.display],
        body: [...fontFamily.body],
      },
      fontSize,
      spacing,
      borderRadius,
      boxShadow,
      letterSpacing,
      transitionTimingFunction: { brand: easing.brand },
      keyframes,
      animation,
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

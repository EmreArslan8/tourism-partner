import type { Config } from "tailwindcss";
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

/* Tailwind teması projedeki theme/ klasöründen beslenir (tek kaynak). */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: tailwindColors,
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
  plugins: [],
};

export default config;

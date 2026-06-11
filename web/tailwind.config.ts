import type { Config } from "tailwindcss";
import {
  tailwindColors,
  fontFamily,
  borderRadius,
  boxShadow,
  easing,
  keyframes,
  animation,
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
      borderRadius,
      boxShadow,
      transitionTimingFunction: { brand: easing.brand },
      keyframes,
      animation,
    },
  },
  plugins: [],
};

export default config;

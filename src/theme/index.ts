/* theme/index.ts — tema token'larının tek giriş noktası. */
export { brandPalette, palette, themePalettes, groupPalette, tailwindColors, themeCssVariables } from "./palette";
export type { BrandPaletteKey, PaletteKey, GroupColorKey } from "./palette";
export { fontFamily, fontSize } from "./typography";
export { borderRadius, boxShadow, easing, keyframes, animation, letterSpacing, spacing } from "./tokens";
export {
  THEME_CHANGE_EVENT,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  themeBootstrapScript,
} from "./preference";
export type { ThemePreference } from "./preference";

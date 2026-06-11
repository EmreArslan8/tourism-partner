/* typography.ts — ortak font ailesi token'ları.
   Gerçek fontlar layout.tsx'te next/font ile yüklenip CSS değişkenine bağlanır. */

export const fontFamily = {
  display: ["var(--font-display)", "Georgia", "serif"],
  body: ["var(--font-body)", "Helvetica Neue", "sans-serif"],
} as const;

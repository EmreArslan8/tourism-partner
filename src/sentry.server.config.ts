import * as Sentry from "@sentry/nextjs";

/*
 * Sunucu (Node.js runtime) Sentry init. instrumentation.ts > register() içinden
 * yalnız NEXT_RUNTIME === "nodejs" iken import edilir.
 *
 * DSN yoksa Sentry sessizce no-op olur (hiç istek atmaz) — bu yüzden env
 * tanımlanana kadar üretimde bir yan etkisi yoktur. Sunucu tarafı olduğu için
 * LCP/istemci bundle'ına SIFIR katkısı vardır.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Trace örnekleme: sunucuda görece ucuz; prod'da %10, dışında kapalı.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  // Prod'da gürültüyü azaltmak için debug kapalı.
  enabled: Boolean(process.env.SENTRY_DSN),
});

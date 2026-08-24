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
  // Next 16 Cache Components kendi response/render span'larını kuruyor. Sentry'nin
  // OTel + HTTP span/session katmanı aynı ServerResponse'a ek listener bağlayınca
  // MaxListenersExceededWarning ve uzun yaşayan render'larda bellek baskısı oluşuyor.
  // Hata yakalama + request scope korunur; yalnız performans span/session'ları kapanır.
  skipOpenTelemetrySetup: true,
  integrations(defaults) {
    return [
      ...defaults.filter((integration) => integration.name !== "Http"),
      Sentry.httpIntegration({
        spans: false,
        trackIncomingRequestsAsSessions: false,
      }),
    ];
  },
  // Prod'da gürültüyü azaltmak için debug kapalı.
  enabled: Boolean(process.env.SENTRY_DSN),
});

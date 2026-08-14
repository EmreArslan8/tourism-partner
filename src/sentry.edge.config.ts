import * as Sentry from "@sentry/nextjs";

/*
 * Edge runtime (middleware / edge route) Sentry init. instrumentation.ts >
 * register() içinden yalnız NEXT_RUNTIME === "edge" iken import edilir.
 * DSN yoksa no-op. İstemci bundle'ına dahil değildir.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  enabled: Boolean(process.env.SENTRY_DSN),
});

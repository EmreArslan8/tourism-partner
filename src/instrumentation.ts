import { type Instrumentation } from "next";
import * as Sentry from "@sentry/nextjs";

/*
 * Sentry init'i runtime'a göre yükler. Client init BURADA değil — o
 * instrumentation-client.ts'te idle'a ertelenir (LCP/TBT'ye dokunmamak için).
 * DSN yoksa her iki config de no-op'tur.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/*
 * Sunucu hatalarını gözlemlemek için Next'in onRequestError hook'u.
 * Prod standalone build'de stack minify/gizli olduğu için bir hatanın HANGİ
 * route'tan ve HANGİ bağlamdan (render / route handler / server action) geldiği
 * loglardan okunamıyor. Bu hook tam da o bağlamı ekler.
 *
 * "Unexpected end of JSON input" (digest 1215693369) KAYNAĞI NETLEŞTİ: bot/crawler
 * POST'ları — GET olması gereken sayfa linklerine (ör. /explore?page=2) POST
 * geliyor, Next server action sanıp boş gövdeyi çözerken çöküyor. Gerçek bir hata
 * değil; aşağıda isBotActionNoise ile telemetriden elenir (Sentry'ye gitmez).
 *
 * Not: Bu hook hatayı YALNIZCA raporlar; 500'ü engellemez, Next'in kendi `⨯`
 * logunu bastırmaz. Amaç teşhis + bilinen gürültüyü susturma.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const e = err as { digest?: string; message?: string };

  // BİLİNEN GÜRÜLTÜ — bot/crawler POST'ları. Bot'lar GET olması gereken sayfa
  // linklerine (ör. /explore?page=2) POST atıyor; Next bunu server action sanıp
  // boş gövdeyi çözerken "Unexpected end of JSON input" fırlatıyor (digest
  // 1215693369). Kendi action'larımızdaki JSON.parse'ların HEPSİ try/catch ile
  // korumalı (bkz. panel.ts), yani bu mesaj yalnız Next'in iç deserialize'ından
  // gelir — gerçek bir hata değil. Sentry'yi ve logu kirletmesin: tek satır uyarı,
  // Sentry'ye gönderme.
  const isBotActionNoise =
    context.routeType === "action" &&
    request.method === "POST" &&
    typeof e.message === "string" &&
    (e.message.includes("Unexpected end of JSON input") ||
      e.message.includes("Unexpected token"));
  if (isBotActionNoise) {
    console.warn("[req-error:bot-noise]", { path: request.path, message: e.message });
    return;
  }

  console.error("[req-error]", {
    digest: e.digest,
    message: e.message,
    method: request.method,
    path: request.path,
    routeType: context.routeType, // 'render' | 'route' | 'action' | 'proxy'
    routePath: context.routePath,
  });
  // Sunucu hatasını Sentry'ye de ilet (DSN yoksa no-op).
  Sentry.captureRequestError(err, request, context);
};

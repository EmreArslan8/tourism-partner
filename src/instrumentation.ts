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
 * Özellikle takip edilen: "Unexpected end of JSON input" (digest 1215693369) —
 * kaynağı henüz kesinleşmedi. Bu satır bir daha tetiklendiğinde routeType + path
 * ile birlikte düşecek; böylece gerçek bir route mu yoksa server-action katmanına
 * gelen bozuk/bot POST'u mu olduğu netleşecek.
 *
 * Not: Bu hook hatayı YALNIZCA raporlar; 500'ü engellemez, Next'in kendi `⨯`
 * logunu bastırmaz. Amaç teşhis. Kaynak netleşince ya ilgili route yamalanır ya
 * da (bozuk istek ise) bu dosya sadeleştirilir/kaldırılır.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const e = err as { digest?: string; message?: string };
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

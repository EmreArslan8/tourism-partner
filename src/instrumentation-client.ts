/*
 * İstemci Sentry init — LCP/kritik yola SIFIR etki hedefiyle.
 *
 * Bu dosya Next tarafından HTML yüklendikten SONRA, React hydration'dan ÖNCE
 * çalışır. Buraya senkron `Sentry.init()` koymak, ağır SDK bundle'ının
 * hydration'dan önce parse/execute edilmesine (TBT artışı) yol açardı.
 *
 * Bunun yerine:
 *   1) Ucuz native listener'larla erken hataları tamponla (SDK henüz yokken
 *      kaybolmasınlar).
 *   2) Tarayıcı boşa düştüğünde (requestIdleCallback) SDK'yı DİNAMİK import et,
 *      minimal config'le başlat (Session Replay yok, tracing kapalı).
 *   3) Tamponlanan hataları Sentry'ye aktar ve geçici listener'ları kaldır.
 *
 * DSN yoksa init no-op olur; yine de kod yolu güvenli çalışır.
 */

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

type BufferedError =
  | { kind: "error"; value: unknown }
  | { kind: "rejection"; value: unknown };

const buffer: BufferedError[] = [];

const onError = (event: ErrorEvent) => {
  buffer.push({ kind: "error", value: event.error ?? event.message });
};
const onRejection = (event: PromiseRejectionEvent) => {
  buffer.push({ kind: "rejection", value: event.reason });
};

function scheduleInit() {
  if (!DSN) return; // DSN yoksa SDK'yı hiç yükleme.

  // Erken hataları yakalamak için hafif listener'lar (SDK gelene kadar).
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);

  const boot = () => {
    import("@sentry/nextjs")
      .then((Sentry) => {
        Sentry.init({
          dsn: DSN,
          // Session Replay bilinçli olarak YOK (en ağır bundle parçası).
          // Tracing kapalı: performans overhead'i olmadan sadece hata takibi.
          tracesSampleRate: 0,
          integrations: (defaults) =>
            // Ağır/gereksiz entegrasyonları ele: tracing + replay çıkar.
            defaults.filter(
              (i) =>
                i.name !== "BrowserTracing" &&
                i.name !== "Replay" &&
                i.name !== "ReplayCanvas",
            ),
        });

        // Tamponlanan erken hataları aktar, sonra geçici listener'ları kaldır.
        window.removeEventListener("error", onError);
        window.removeEventListener("unhandledrejection", onRejection);
        for (const item of buffer) Sentry.captureException(item.value);
        buffer.length = 0;
      })
      .catch(() => {
        // SDK yüklenemezse sessizce vazgeç; sayfayı asla etkileme.
      });
  };

  if ("requestIdleCallback" in window) {
    (window as Window & typeof globalThis).requestIdleCallback(boot, { timeout: 4000 });
  } else {
    setTimeout(boot, 2000);
  }
}

try {
  // İlk paint/hydration'ı beklemek için load sonrası + idle.
  if (document.readyState === "complete") {
    scheduleInit();
  } else {
    window.addEventListener("load", scheduleInit, { once: true });
  }
} catch {
  // Instrumentation asla uygulamayı düşürmemeli.
}

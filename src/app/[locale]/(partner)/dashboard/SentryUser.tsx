"use client";

import { useEffect } from "react";

/*
 * İstemci tarafı Sentry kullanıcı bağlamı. Dashboard layout'undan (sunucuda zaten
 * çözülmüş) id + e-posta ile beslenir; ekstra Supabase çağrısı yapmaz.
 *
 * Amaç: panelde oluşan bir İSTEMCİ hatası (error.tsx sınırı) Sentry'ye düştüğünde
 * "hangi tedarikçi?" bilgisi olayla birlikte gelsin.
 *
 * getGlobalScope().setUser, Sentry.init()'ten SONRA da geçerli kalır — istemci init
 * instrumentation-client.ts'te idle'a ertelendiği için burada erken çağrılsa bile
 * SDK başlayınca kullanıcı bağlamı korunur. DSN yoksa SDK'yı hiç yükleme.
 */
export default function SentryUser({ id, email }: { id: string; email?: string }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
    let cancelled = false;
    void import("@sentry/nextjs").then((Sentry) => {
      if (cancelled) return;
      Sentry.getGlobalScope().setUser({ id, email });
    });
    return () => {
      cancelled = true;
    };
  }, [id, email]);

  return null;
}

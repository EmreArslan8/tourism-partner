"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { isProtectedPath } from "@/lib/auth-paths";
import { INTENTIONAL_SIGNOUT_KEY } from "@/components/auth/SignOutForm";

/*
 * İstemci tarafı oturum gözcüsü. Tarayıcı sekmesi açıkken oturum ölürse
 * (autoRefresh başarısız → Supabase SDK 'SIGNED_OUT' fırlatır) kullanıcıyı
 * "Try again" ekranına düşürmeden temiz şekilde login'e yönlendirir.
 *
 * Sunucu tarafı (proxy.ts) her istekte zaten ölü oturumu yakalayıp login'e atıyor;
 * bu bileşen "kullanıcı sayfada hareketsiz otururken oturum ölmesi" boşluğunu kapatır.
 *
 * Manuel çıkış (SignOutForm) çıkıştan önce bir bayrak bırakır; o durumda burada
 * yanlışlıkla "oturumunuz doldu" göstermeyip signOut'un kendi yönlendirmesine
 * ("/") izin veririz. Ayrıca yalnız hâlâ KORUMALI bir yoldayken tetikleniriz.
 */
export default function AuthWatcher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_OUT") return;

      // Manuel çıkış mı? Öyleyse dokunma (bayrağı da tüket).
      let intentional = false;
      try {
        intentional = sessionStorage.getItem(INTENTIONAL_SIGNOUT_KEY) === "1";
        sessionStorage.removeItem(INTENTIONAL_SIGNOUT_KEY);
      } catch {
        // sessionStorage erişilemezse manuel çıkış varsayma.
      }
      if (intentional) return;

      if (typeof window !== "undefined" && isProtectedPath(window.location.pathname)) {
        router.replace({ pathname: "/login", query: { expired: "1" } });
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}

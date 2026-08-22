import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { isProtectedPath, localeOf, loginPathFor } from "@/lib/auth-paths";

/* Proxy (eski adıyla middleware) içinde Supabase oturum çerezini tazeler.
   Verilen response üzerine güncel auth çerezlerini yazar ve geri döner. */

/* "Oturum öldü" (geçersiz/kullanılmış/bulunamayan refresh token) mi ayrımını yapar.
   BİLİNÇLİ OLARAK DAR: sadece refresh-token'a özgü auth hatalarında true döner.
   Geçici bir ağ/servis hatası (fetch failed) ya da alakasız bir 401 kullanıcıyı
   çıkışa zorlamamalı — o durumda oturuma dokunmayıp bir sonraki istekte tekrar denenir. */
function isDeadSession(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { __isAuthError?: boolean; code?: string; message?: string };
  // Supabase-js auth hatası değilse (ör. ağ hatası) — dokunma.
  if (!e.__isAuthError) return false;
  if (typeof e.code === "string" && e.code.includes("refresh_token")) return true;
  if (typeof e.message === "string" && /refresh token/i.test(e.message)) return true;
  return false;
}

export async function updateSession(request: NextRequest, response: NextResponse) {
  // Env yoksa (henüz bağlanmadıysa) sessizce geç — site çalışmaya devam etsin.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  // Misafir (sb-* auth çerezi yok) → yenilenecek token da yok; Supabase'e
  // network çağrısı yapmadan geç. Public sayfalarda TTFB'yi kısaltır.
  // Giriş yapmış kullanıcıda davranış birebir aynı kalır.
  const staleCookies = request.cookies.getAll().filter((c) => c.name.startsWith("sb-"));
  if (staleCookies.length === 0) {
    return response;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() çağrısı token'ı doğrular ve gerekirse yeniler (çerezleri response'a yazar).
  let sessionDead = false;
  try {
    const { error } = await supabase.auth.getUser();
    if (error && isDeadSession(error)) sessionDead = true;
  } catch (err) {
    // Yenileme fırlattıysa (ör. "Invalid Refresh Token: Refresh Token Not Found")
    // proxy çökmesin. Yalnız gerçek auth ölümünde çıkışa yönlendir; geçici
    // ağ/servis hatasında oturuma dokunma.
    if (isDeadSession(err)) sessionDead = true;
  }

  if (!sessionDead) return response;

  // OTURUM ÖLDÜ. Ölü sb-* çerezlerini temizle — yoksa tarayıcı her istekte aynı
  // geçersiz token'ı gönderip aynı hatayı sonsuza dek tetikler (ve Supabase'e
  // boşuna gider). Temizlik hem redirect'te hem normal response'ta uygulanır.
  const clearStale = (res: NextResponse) => {
    for (const c of staleCookies) {
      res.cookies.set(c.name, "", { maxAge: 0, path: "/" });
    }
    return res;
  };

  const pathname = request.nextUrl.pathname;

  // Korumalı sayfa → bu istek hiç render edilmeden login'e yönlensin (error
  // boundary "Try again" yerine temiz bir "oturumunuz doldu" akışı).
  if (isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = loginPathFor(localeOf(pathname));
    url.search = "expired=1";
    return clearStale(NextResponse.redirect(url));
  }

  // Public sayfa → sayfayı misafir olarak render et, sadece ölü çerezi temizle.
  return clearStale(response);
}

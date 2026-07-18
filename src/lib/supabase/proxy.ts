import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

/* Proxy (eski adıyla middleware) içinde Supabase oturum çerezini tazeler.
   Verilen response üzerine güncel auth çerezlerini yazar ve geri döner. */
export async function updateSession(request: NextRequest, response: NextResponse) {
  // Env yoksa (henüz bağlanmadıysa) sessizce geç — site çalışmaya devam etsin.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  // Misafir (sb-* auth çerezi yok) → yenilenecek token da yok; Supabase'e
  // network çağrısı yapmadan geç. Public sayfalarda TTFB'yi kısaltır.
  // Giriş yapmış kullanıcıda davranış birebir aynı kalır.
  if (!request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"))) {
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
  await supabase.auth.getUser();
  return response;
}

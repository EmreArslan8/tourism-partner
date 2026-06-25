import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/proxy";

/* Next 16'da middleware "proxy" oldu. Burada iki sorumluluk kompoze edilir:
   1) next-intl yönlendirme/locale çözümü (response'u üretir)
   2) Supabase oturum çerezini tazeleme (token süresi dolmadan yeniler)
   Sıra önemli: önce intl response'u alınır, ardından güncel auth çerezleri
   o response'un üzerine yazılır. */
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  return updateSession(request, response);
}

export const config = {
  // _next, statik dosyalar ve api hariç tüm yollarda çalış
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

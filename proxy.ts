import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";
import { updateSession } from "./src/lib/supabase/proxy";

/* Next 16: middleware artık "proxy". Burada iki işi zincirliyoruz:
   1) next-intl locale yönlendirmesi (response'u o üretir)
   2) Supabase oturum çerezi tazeleme (aynı response'a yazar) */
const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  return updateSession(request, response);
}

export const config = {
  // Statik dosyalar ve _next dışındaki tüm yollarda çalış.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

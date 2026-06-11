import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/* Next 16'da middleware "proxy" oldu; next-intl middleware'ini burada kullanıyoruz. */
export default createMiddleware(routing);

export const config = {
  // _next, statik dosyalar ve api hariç tüm yollarda çalış
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

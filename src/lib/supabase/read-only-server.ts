import "server-only";

import { createServerClient } from "@supabase/ssr";
import { headers } from "next/headers";
import type { Database } from "./database.types";

type CookiePair = { name: string; value: string };

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseCookieHeader(value: string | null): CookiePair[] {
  if (!value) return [];
  return value
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf("=");
      if (separator < 1) return null;
      return {
        name: part.slice(0, separator).trim(),
        value: decodeCookieValue(part.slice(separator + 1).trim()),
      };
    })
    .filter((cookie): cookie is CookiePair => Boolean(cookie));
}

/* Server Component / layout içindeki salt-okuma sorguları için istemci.
   Next 16.2.9 dev modunda Server Action sonrası render sırasında cookies()
   mutable-cookie invariant'ına düşebiliyor. Cookie başlığını headers() üzerinden
   okumak aynı oturumu taşır; yazma/refresh ise proxy ve normal server client'tadır. */
export async function createReadOnlyClient() {
  const headerStore = await headers();
  const requestCookies = parseCookieHeader(headerStore.get("cookie"));

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return requestCookies;
        },
        setAll() {
          // Salt-okuma render'ında Set-Cookie yazılmaz. Oturumu proxy yeniler.
        },
      },
    },
  );
}

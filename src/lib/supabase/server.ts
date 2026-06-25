import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/* Sunucu (Server Component / Server Action / Route Handler) Supabase istemcisi.
   Next 16'da cookies() async — bu yüzden bu fabrika da async. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component içinden çağrıldıysa set başarısız olur;
            // oturum yenileme proxy.ts'te yapıldığı için bu güvenle yutulur.
          }
        },
      },
    }
  );
}

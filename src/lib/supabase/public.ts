import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/* Herkese açık (anon) okumalar için çerezsiz Supabase istemcisi.
   cookies() çağırmadığı için bu istemciyi kullanan sayfalar statik/cache'lenebilir
   kalır — sadece public, oturumdan bağımsız veriler için kullanılır. */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/* Service-role Supabase istemcisi — yalnızca SUNUCU tarafında, RLS'i baypas eden
   yönetimsel işlemler için (ör. teklif bildiriminde işletme sahibinin e-postasını
   auth.users'tan okumak). SUPABASE_SERVICE_ROLE_KEY tanımlı değilse null döner;
   çağıran taraf bu durumu zarifçe ele almalıdır.

   ⚠️ Bu anahtar GİZLİDİR — asla client'a sızdırma, yalnızca server action / route'larda kullan. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

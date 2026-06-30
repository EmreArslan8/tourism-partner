"use server";

import { createClient } from "@/lib/supabase/server";

const ALLOWED = new Set(["business", "quote", "page"]);

/* Görüntülenme kaydı — page_views tablosuna yazar (anon insert RLS ile açık).
   Fire-and-forget: hata olsa bile sayfayı etkilemez. Dashboard/Raporlar bunu okur. */
export async function recordView(entityType: string, entityId: number): Promise<void> {
  if (!ALLOWED.has(entityType) || !Number.isInteger(entityId)) return;
  try {
    const supabase = await createClient();
    await supabase.from("page_views").insert({ entity_type: entityType, entity_id: entityId });
  } catch {
    // sessizce yut
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/* Favoriler (Brief §8 "Favoriye Ekleme"): giriş yapmış kullanıcı işletmeleri
   kaydeder. toggleFavorite client island'dan çağrılır; yeni durumu döndürür. */
export async function toggleFavorite(businessId: number): Promise<boolean> {
  if (!Number.isInteger(businessId)) {
    console.warn("[favorites.toggle] invalid business id", { businessId });
    return false;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.warn("[favorites.toggle] missing user", { businessId });
    return false;
  }
  console.info("[favorites.toggle] start", { businessId, userId: user.id });

  const { data: existing, error: readError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("business_id", businessId)
    .maybeSingle();
  if (readError) {
    console.error("[favorites.toggle] read failed", { businessId, userId: user.id, error: readError.message });
    return false;
  }
  console.info("[favorites.toggle] existing", { businessId, userId: user.id, favoriteId: existing?.id ?? null });

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("business_id", businessId);
    if (error) {
      console.error("[favorites.toggle] delete failed", { businessId, userId: user.id, error: error.message });
      return true;
    }
    revalidatePath("/[locale]/dashboard/favorites", "page");
    console.info("[favorites.toggle] deleted", { businessId, userId: user.id });
    return false;
  }

  const { error } = await supabase.from("favorites").insert({ user_id: user.id, business_id: businessId });
  if (error) {
    console.error("[favorites.toggle] insert failed", { businessId, userId: user.id, error: error.message });
    return false;
  }
  revalidatePath("/[locale]/dashboard/favorites", "page");
  console.info("[favorites.toggle] inserted", { businessId, userId: user.id });
  return true;
}

/* Panelin "Favorilerim" listesinden kaldırma (form action). */
export async function removeFavorite(formData: FormData): Promise<void> {
  const businessId = Number(formData.get("business_id"));
  if (!Number.isInteger(businessId)) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("favorites").delete().eq("user_id", user.id).eq("business_id", businessId);
  revalidatePath("/[locale]/dashboard/favorites", "page");
}

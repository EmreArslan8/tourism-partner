"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clean } from "./validate";

/* Değerlendirme & Yorum (Brief §8, B2B güven duvarı): giriş yapmış işletme,
   iş birliği yaptığı DİĞER işletmeyi 1-5 yıldız puanlar ve yorum bırakır.
   Kendi işletmesini puanlayamaz (RLS + burada kontrol). Yorum yazan işletme
   başına hedef işletmeye tek yorum (upsert ile günceller). */
export type ReviewState = { ok: boolean; error?: string };

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const businessId = Number(formData.get("business_id"));
  const rating = Number(formData.get("rating"));
  const comment = clean(formData.get("comment"), 2000);
  if (!Number.isInteger(businessId)) return { ok: false, error: "invalid" };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: "rating" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  // Yazanın kendi işletmesi (görünen ad için) + kendi işletmesini puanlama engeli.
  const { data: myBiz } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();
  if (myBiz && myBiz.id === businessId) return { ok: false, error: "self" };

  const { error } = await supabase.from("reviews").upsert(
    {
      business_id: businessId,
      author_id: user.id,
      author_business_id: myBiz?.id ?? null,
      rating,
      comment,
    },
    { onConflict: "business_id,author_id" },
  );
  if (error) return { ok: false, error: "db" };

  revalidatePath("/[locale]/supplier/[id]", "page");
  revalidatePath("/[locale]/dashboard/reviews", "page");
  return { ok: true };
}

export async function deleteReview(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("reviews").delete().eq("id", id).eq("author_id", user.id);
  revalidatePath("/[locale]/dashboard/reviews", "page");
}

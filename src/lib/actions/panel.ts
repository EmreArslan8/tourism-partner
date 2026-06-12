"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ALL_FACET_SLUGS } from "@/lib/facets";
import type { ActionState } from "./application";
import { clean } from "./validate";

/* Firma panelinde ilan düzenleme — sahibi kendi businesses kaydını günceller.
   Kayıt yoksa (ör. e-posta onayı sonrası ilk giriş) oluşturur.
   Foto URL'leri client tarafında Storage'a yüklenip gizli alanlarla gelir. */
export async function saveMyBusiness(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const name = clean(formData.get("name"), 160);
  if (!name) return { ok: false, error: "missing" };

  // Seçili hizmet/özellik facet'leri — yalnızca bilinen slug'lar.
  const attributes = formData
    .getAll("attr")
    .map((v) => String(v))
    .filter((s) => ALL_FACET_SLUGS.has(s));

  // Galeri: gizli "images" alanı JSON dizi olarak gelir.
  let images: string[] = [];
  try {
    const raw = String(formData.get("images") ?? "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) images = parsed.filter((s) => typeof s === "string").slice(0, 12);
  } catch {
    images = [];
  }

  const payload = {
    name,
    type: clean(formData.get("type"), 80) ?? "",
    country: clean(formData.get("country"), 80) ?? "",
    city: clean(formData.get("city"), 80) ?? "",
    district: clean(formData.get("district"), 80) ?? "",
    description: clean(formData.get("description"), 2000),
    phone: clean(formData.get("phone"), 40),
    website: clean(formData.get("website"), 200),
    image: clean(formData.get("image"), 400),
    images,
    attributes,
  };

  const idRaw = String(formData.get("id") ?? "").trim();

  try {
    if (idRaw && /^\d+$/.test(idRaw)) {
      const { error } = await supabase
        .from("businesses")
        .update(payload)
        .eq("id", Number(idRaw))
        .eq("owner_id", user.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const meta = user.user_metadata ?? {};
      const group = (meta.biz_group as string) || "konaklama";
      const { error } = await supabase.from("businesses").insert({
        owner_id: user.id,
        group,
        status: "pending",
        ...payload,
        type: payload.type || (meta.biz_type as string) || "—",
      });
      if (error) return { ok: false, error: error.message };
    }
    revalidatePath("/[locale]/panel", "page");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey, ActionState } from "@/lib/types";
import { isEmail, isBot, clean } from "./validate";

/* Firma kayıt başvurusu — kayıt formundan applications tablosuna yazar. */
export async function submitApplication(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Bot ise sessizce başarı döndür (insert yapmadan).
  if (isBot(formData)) return { ok: true };

  const name = clean(formData.get("name"), 160);
  const email = clean(formData.get("email"), 200);
  const category = clean(formData.get("category"), 80);

  if (!name || !email || !category) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };

  // Seçilen alt kategori slug'ından ana grup + etiketi çöz.
  let group: GroupKey | null = null;
  let categoryLabel: string | null = null;
  for (const g of CATEGORY_GROUPS) {
    const leaf = g.children.find((c) => c.slug === category);
    if (leaf) {
      group = g.key;
      categoryLabel = leaf.label;
      break;
    }
  }
  // Bilinmeyen kategori slug'ı kabul etme.
  if (!group) return { ok: false, error: "category" };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("applications").insert({
      name,
      email,
      group,
      category_slug: category,
      category_label: categoryLabel,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

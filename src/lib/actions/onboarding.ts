"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

/* Kayıt akışının son adımı: doğrulama sonrası zorunlu kapak görseli.
   Görsel istemcide storage'a yüklenir (oturum gerektirir); bu action yalnızca
   yüklenen yolu doğrulayıp işletmeye yazar ve panele geçirir. */
export async function setBusinessCover(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const rawPath = String(formData.get("path") ?? "").trim();
  // Storage RLS: yol kullanıcının kendi klasörüyle başlamalı. Ekstra doğrulama.
  if (!rawPath || !rawPath.startsWith(`${user.id}/`) || rawPath.length > 400 || rawPath.includes("..")) {
    return { ok: false, error: "path" };
  }

  const businessId = Number(formData.get("businessId"));
  if (!Number.isInteger(businessId) || businessId <= 0) return { ok: false, error: "business" };

  const { error } = await supabase
    .from("businesses")
    .update({ image: rawPath })
    .eq("id", businessId)
    .eq("owner_id", user.id);
  if (error) return { ok: false, error: error.message };

  const locale = await getLocale();
  redirect({ href: "/dashboard", locale });
  return { ok: true };
}

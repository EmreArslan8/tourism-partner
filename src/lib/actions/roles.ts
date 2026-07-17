"use server";

import { revalidatePath } from "next/cache";
import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";

export type RoleResult = { ok: true } | { ok: false; error: string };

const ROLES = ["admin", "partner"] as const;
type Role = (typeof ROLES)[number];

/* Bir kullanıcının rolünü değiştirir (admin ↔ partner). Yalnızca admin çağırabilir;
   RLS "profiles admin update" policy'si + protect_profile_role trigger'ı zorlar.
   Admin kendi admin rolünü düşüremez (kilitlenme koruması). */
export async function setUserRole(formData: FormData): Promise<RoleResult> {
  const context = await requireAdminContext();
  const { supabase, userId } = context;
  const targetId = String(formData.get("userId") ?? "").trim();
  const nextRole = String(formData.get("role") ?? "").trim();

  if (!targetId) return { ok: false, error: "missing_user" };
  if (!ROLES.includes(nextRole as Role)) return { ok: false, error: "invalid_role" };
  if (targetId === userId && nextRole !== "admin") {
    return { ok: false, error: "self_demote" };
  }

  const { data: current } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetId)
    .maybeSingle();

  const { error } = await supabase.from("profiles").update({ role: nextRole }).eq("id", targetId);
  if (error) return { ok: false, error: error.message };

  await writeAdminAudit(context, "user.role.update", "profile", targetId, { role: nextRole }, current ?? null);
  revalidatePath("/[locale]/admin/guvenlik", "page");
  return { ok: true };
}

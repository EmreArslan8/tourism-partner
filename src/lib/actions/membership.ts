"use server";

import { revalidatePath } from "next/cache";
import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";
import { clean } from "./validate";

/* Admin panelden manuel üyelik uzatma — "Üyelik Süresi Sonlanan İşletmeler" ve
   işletme detay panelinden tetiklenir. Bitiş tarihini bugünden ya da mevcut
   bitişten (hangisi ileriyse) itibaren N ay ileri alır, durumu active yapar. */

const MONTH_OPTIONS = new Set([1, 3, 6, 12]);

export async function extendMembership(formData: FormData): Promise<void> {
  const context = await requireAdminContext();
  const { supabase, userId } = context;
  const businessId = Number(formData.get("businessId"));
  const months = Number(formData.get("months") || 12);
  const locale = clean(formData.get("locale"), 8) ?? "tr";
  if (!Number.isInteger(businessId)) throw new Error("Geçersiz işletme.");
  if (!MONTH_OPTIONS.has(months)) throw new Error("Geçersiz süre seçimi.");

  const { data: existing } = await supabase
    .from("business_memberships")
    .select("id,plan,status,starts_at,ends_at")
    .eq("business_id", businessId)
    .order("ends_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date();
  // Süresi henüz dolmamışsa üzerine ekle; dolmuşsa bugünden başlat.
  const base =
    existing && new Date(existing.ends_at).getTime() > now.getTime() ? new Date(existing.ends_at) : now;
  const nextEnds = new Date(base);
  nextEnds.setMonth(nextEnds.getMonth() + months);
  const endsAtIso = nextEnds.toISOString();

  if (existing) {
    const { error } = await supabase
      .from("business_memberships")
      .update({ ends_at: endsAtIso, status: "active", renewed_by_admin_id: userId })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    await writeAdminAudit(
      context,
      "membership.extend",
      "business",
      businessId,
      { months, ends_at: endsAtIso },
      { ends_at: existing.ends_at, status: existing.status },
    );
  } else {
    const payload = {
      business_id: businessId,
      plan: "standard",
      status: "active" as const,
      starts_at: now.toISOString(),
      ends_at: endsAtIso,
      renewed_by_admin_id: userId,
    };
    const { error } = await supabase.from("business_memberships").insert(payload);
    if (error) throw new Error(error.message);
    await writeAdminAudit(context, "membership.create", "business", businessId, payload);
  }

  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/admin/tedarikciler`);
  revalidatePath(`/${locale}/admin/tedarikciler/${businessId}`);
}

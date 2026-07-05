"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, escapeHtml } from "@/lib/email";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { clean } from "./validate";

function groupOrNull(value: FormDataEntryValue | null): GroupKey | null {
  const v = String(value ?? "");
  return CATEGORY_GROUPS.some((g) => g.key === v) ? (v as GroupKey) : null;
}

/* Brief §7/§8 "Talep & Teklif Sistemi": giriş yapmış işletme (acente) bölge için
   talep/ilan açar; ilgili tedarikçiler bu ilana teklif sunar; talep sahibine
   teklif geldiğinde otomatik e-posta gider. */

async function myBusiness(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("businesses")
    .select("id,name")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();
  return data;
}

/* Talep sahibine yeni teklif bildirimi (service-role ile owner e-postası okunur). */
async function notifyRequestOwner(
  requestId: number,
  fromName: string,
  message: string,
  price: string | null,
): Promise<void> {
  try {
    const admin = createAdminClient();
    if (!admin) return;
    const { data: req } = await admin
      .from("b2b_requests")
      .select("title, businesses(owner_id)")
      .eq("id", requestId)
      .maybeSingle();
    const rel = (req as { businesses: { owner_id: string | null } | { owner_id: string | null }[] | null } | null)?.businesses;
    const ownerId = Array.isArray(rel) ? rel[0]?.owner_id : rel?.owner_id;
    if (!ownerId) return;

    const { data: userRes } = await admin.auth.admin.getUserById(ownerId);
    const to = userRes?.user?.email;
    if (!to) return;

    const title = (req as { title?: string } | null)?.title ?? "talebiniz";
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#0b1c30">Talebinize yeni teklif</h2>
        <p style="color:#475569"><b>${escapeHtml(title)}</b> ilanınıza <b>${escapeHtml(fromName)}</b> teklif verdi.</p>
        ${price ? `<p style="color:#0b1c30;font-weight:600">Fiyat: ${escapeHtml(price)}</p>` : ""}
        <p style="color:#475569;white-space:pre-wrap;border-left:3px solid #2563eb;padding-left:12px">${escapeHtml(message)}</p>
        <p style="color:#94a3b8;font-size:13px;margin-top:20px">Teklifleri panelinizden görüntüleyebilirsiniz.</p>
      </div>`;
    await sendEmail({ to, subject: `Yeni teklif — ${title}`, html });
  } catch {
    // bildirim hatası akışı etkilemez
  }
}

/* Acente talep/ilan oluşturur (yayınlanır; admin sonradan denetler). */
export async function createB2bRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const biz = await myBusiness(supabase);
  if (!biz) return;

  const title = clean(formData.get("title"), 160);
  const description = clean(formData.get("description"), 2000);
  const region = clean(formData.get("region"), 120);
  const targetGroup = groupOrNull(formData.get("target_group"));
  if (!title) return;

  await supabase.from("b2b_requests").insert({
    business_id: biz.id,
    title,
    description,
    region,
    target_group: targetGroup,
    status: "published",
  });
  revalidatePath("/[locale]/dashboard/requests", "page");
}

/* İlan görüntülenme sayacı (+1) — teklif verecek tedarikçi ilanı görünce.
   security-definer RPC ile artar (b2b_requests UPDATE RLS sahibe kısıtlı). */
export async function recordB2bRequestView(id: number): Promise<void> {
  if (!Number.isInteger(id)) return;
  try {
    const supabase = await createClient();
    await supabase.rpc("increment_b2b_view", { rid: id });
  } catch {
    // sessizce yut
  }
}

/* Tedarikçi bir talebe teklif sunar → talep sahibine e-posta. */
export async function submitB2bOffer(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const biz = await myBusiness(supabase);
  if (!biz) return;

  const requestId = Number(formData.get("request_id"));
  const message = clean(formData.get("message"), 2000);
  const price = clean(formData.get("price"), 120);
  if (!Number.isInteger(requestId) || !message) return;

  const { error } = await supabase.from("b2b_offers").insert({
    request_id: requestId,
    business_id: biz.id,
    message,
    price,
  });
  if (error) return;

  await notifyRequestOwner(requestId, biz.name, message, price);
  revalidatePath("/[locale]/dashboard/requests", "page");
}

/* Talep sahibi kendi ilanını kapatır (arşivler). */
export async function closeMyB2bRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const biz = await myBusiness(supabase);
  if (!biz) return;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await supabase.from("b2b_requests").update({ status: "archived" }).eq("id", id).eq("business_id", biz.id);
  revalidatePath("/[locale]/dashboard/requests", "page");
}

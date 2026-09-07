"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, escapeHtml } from "@/lib/email";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionState, GroupKey } from "@/lib/types";
import { clean } from "./validate";

/* Fırsat ilanları — talep panosunun aynası: burada müşteri arayan firma kendi
   tarifesini/kontenjanını yayımlar. Talepten farkı, kimliğin AÇIK olması;
   ilan yalnız giriş yapmış üyelere görünür (b2b_deals RLS). */

function groupOrNull(value: FormDataEntryValue | null): GroupKey | null {
  const v = String(value ?? "");
  return CATEGORY_GROUPS.some((g) => g.key === v) ? (v as GroupKey) : null;
}

function cleanDate(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function typesValue(formData: FormData) {
  const allowed = new Set(CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => child.slug)));
  return [...new Set(formData.getAll("target_types").map((value) => String(value).trim()).filter((value) => allowed.has(value)))].slice(0, 40);
}

async function myBusiness(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("businesses")
    .select("id,name,city,country,phone")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();
  return data;
}

/* Fırsat ilanı yayınla. */
export async function createB2bDeal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const biz = await myBusiness(supabase);
  if (!biz) return { ok: false, error: "no_business" };

  const allowed = await checkRateLimit({
    scope: "b2b-deal-create",
    limit: 10,
    globalLimit: 400,
    windowSeconds: 60 * 60,
    identity: [biz.id],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const title = clean(formData.get("title"), 160);
  if (!title) return { ok: false, error: "missing" };

  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const capacity = capacityRaw && /^\d+$/.test(capacityRaw) ? Math.min(Number(capacityRaw), 100000) : null;

  const { error } = await supabase.from("b2b_deals").insert({
    business_id: biz.id,
    title,
    description: clean(formData.get("description"), 2000),
    group_key: groupOrNull(formData.get("target_group")),
    types: typesValue(formData),
    country: clean(formData.get("country"), 80),
    city: clean(formData.get("city"), 80),
    district: clean(formData.get("district"), 80),
    price: clean(formData.get("price"), 160),
    capacity,
    valid_from: cleanDate(formData.get("dateStart")),
    valid_until: cleanDate(formData.get("dateEnd")) ?? cleanDate(formData.get("validUntil")),
    status: "published",
  });
  if (error) {
    console.error("[b2b-deal] insert başarısız", { code: error.code, message: error.message, bizId: biz.id });
    return { ok: false, error: error.code === "42501" ? "forbidden" : (error.message || "insert_failed") };
  }
  revalidatePath("/[locale]/dashboard/firsatlar", "page");
  revalidatePath("/[locale]/dashboard/firsatlar/ilanlarim", "page");
  return { ok: true };
}

/* İlan sahibi kendi fırsat ilanını yayından kaldırır. */
export async function closeMyB2bDeal(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const biz = await myBusiness(supabase);
  if (!biz) return;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await supabase.from("b2b_deals").update({ status: "archived" }).eq("id", id).eq("business_id", biz.id);
  revalidatePath("/[locale]/dashboard/firsatlar", "page");
  revalidatePath("/[locale]/dashboard/firsatlar/ilanlarim", "page");
  revalidatePath("/[locale]/dashboard/firsatlar/[id]", "page");
}

/* İlan görüntülenme sayacı (+1). */
export async function recordB2bDealView(id: number): Promise<void> {
  if (!Number.isInteger(id)) return;
  try {
    const supabase = await createClient();
    await supabase.rpc("increment_b2b_deal_view", { did: id });
  } catch {
    // sessizce yut
  }
}

/* İlan sahibine "ilgileniyorum" bildirimi — kimlik zaten açık olduğu için
   ilgilenen firmanın adı/telefonu doğrudan paylaşılır. */
async function notifyDealOwner(dealId: number, from: { name: string; city: string | null; phone: string | null }, message: string | null) {
  try {
    const admin = createAdminClient();
    if (!admin) return;
    const { data: deal } = await admin
      .from("b2b_deals")
      .select("title, businesses(owner_id)")
      .eq("id", dealId)
      .maybeSingle();
    const rel = (deal as { businesses: { owner_id: string | null } | { owner_id: string | null }[] | null } | null)?.businesses;
    const ownerId = Array.isArray(rel) ? rel[0]?.owner_id : rel?.owner_id;
    if (!ownerId) return;

    const { data: userRes } = await admin.auth.admin.getUserById(ownerId);
    const to = userRes?.user?.email;
    if (!to) return;

    const title = (deal as { title?: string } | null)?.title ?? "fırsat ilanınız";
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#0b1c30">Fırsat ilanınıza ilgi var</h2>
        <p style="color:#475569"><b>${escapeHtml(title)}</b> ilanınızla <b>${escapeHtml(from.name)}</b> ilgileniyor.</p>
        <p style="color:#475569">${escapeHtml([from.city, from.phone].filter(Boolean).join(" · "))}</p>
        ${message ? `<p style="color:#475569;white-space:pre-wrap;border-left:3px solid #2563eb;padding-left:12px">${escapeHtml(message)}</p>` : ""}
        <p style="color:#94a3b8;font-size:13px;margin-top:20px">Detayları panelinizden görüntüleyebilirsiniz.</p>
      </div>`;
    await sendEmail({ to, subject: `Fırsat ilanınıza ilgi — ${title}`, html });
  } catch {
    // bildirim hatası akışı etkilemez
  }
}

/* Üye bir fırsat ilanıyla ilgilendiğini bildirir. Ortak gövde; iki sarmalayıcı
   kullanır: panoda sade <form action>, detayda durum döndüren sürüm. */
async function submitDealInterest(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const biz = await myBusiness(supabase);
  if (!biz) return { ok: false, error: "no_business" };

  const allowed = await checkRateLimit({
    scope: "b2b-deal-interest",
    limit: 30,
    globalLimit: 1500,
    windowSeconds: 60 * 60,
    identity: [biz.id],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const dealId = Number(formData.get("deal_id"));
  if (!Number.isInteger(dealId)) return { ok: false, error: "missing" };
  const message = clean(formData.get("message"), 1000);

  const { error } = await supabase.from("b2b_deal_interests").insert({
    deal_id: dealId,
    business_id: biz.id,
    message,
  });
  if (error) {
    console.error("[b2b-deal-interest] insert başarısız", { code: error.code, message: error.message, dealId, bizId: biz.id });
    // 23505: aynı ilana ikinci kez ilgi — kullanıcı için hata değil.
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: error.code === "42501" ? "forbidden" : (error.message || "insert_failed") };
  }

  await notifyDealOwner(dealId, { name: biz.name, city: biz.city, phone: biz.phone }, message);
  // Pano, ilanlarım ve ilan detayı — üçü de bu kayıttan etkilenir.
  revalidatePath("/[locale]/dashboard/firsatlar", "page");
  revalidatePath("/[locale]/dashboard/firsatlar/ilanlarim", "page");
  revalidatePath("/[locale]/dashboard/firsatlar/[id]", "page");
  return { ok: true };
}

export async function expressDealInterest(formData: FormData): Promise<void> {
  await submitDealInterest(formData);
}

export async function expressDealInterestState(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return await submitDealInterest(formData);
}

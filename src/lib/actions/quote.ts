"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, escapeHtml } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { getCityOptions, getDistrictOptions } from "@/lib/regions";
import type { ActionState } from "@/lib/types";
import { isEmail, isBot, clean } from "./validate";

type QuotePayload = {
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string | null;
  dateRange: string | null;
  people: number | null;
  message: string | null;
  categoryGroup: string | null;
  categoryType: string | null;
  country: string | null;
  city: string | null;
  district: string | null;
};

/* Teklif geldiğinde işletme sahibine otomatik e-posta. Sahibin e-postası
   auth.users'tadır; service-role client ile okunur. Anahtarlar yoksa veya
   herhangi bir hata olursa sessizce atlanır — teklif kaydı asla etkilenmez. */
async function notifyOwnerOfQuote(
  businessId: number,
  q: QuotePayload,
): Promise<void> {
  try {
    const admin = createAdminClient();
    if (!admin) return;

    const { data: biz } = await admin
      .from("businesses")
      .select("name, owner_id")
      .eq("id", businessId)
      .maybeSingle();
    if (!biz?.owner_id) return;

    const { data: userRes } = await admin.auth.admin.getUserById(biz.owner_id);
    const to = userRes?.user?.email;
    if (!to) return;

    const rows: [string, string | null][] = [
      ["Gönderen", q.name],
      ["Şirket", q.company],
      ["E-posta", q.email],
      ["Telefon", q.phone],
      ["Hizmet", q.service],
      ["Kategori", [q.categoryGroup, q.categoryType].filter(Boolean).join(" > ") || null],
      ["Bölge", [q.country, q.city, q.district].filter(Boolean).join(" > ") || null],
      ["Tarih", q.dateRange],
      ["Kişi", q.people != null ? String(q.people) : null],
    ];
    const list = rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${k}</td><td style="padding:4px 0;font-weight:600;color:#0b1c30">${escapeHtml(String(v))}</td></tr>`)
      .join("");

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#0b1c30">Yeni teklif talebi</h2>
        <p style="color:#475569"><b>${escapeHtml(biz.name)}</b> için yeni bir teklif talebi aldınız.</p>
        <table style="border-collapse:collapse;margin:12px 0">${list}</table>
        ${q.message ? `<p style="color:#475569;white-space:pre-wrap;border-left:3px solid #2563eb;padding-left:12px">${escapeHtml(q.message)}</p>` : ""}
        <p style="color:#94a3b8;font-size:13px;margin-top:20px">Yanıtlamak için doğrudan ${escapeHtml(q.email)} adresine yazabilirsiniz.</p>
      </div>`;

    await sendEmail({
      to,
      subject: `Yeni teklif talebi — ${biz.name}`,
      html,
      replyTo: q.email,
    });
  } catch {
    // Bildirim hatası teklif gönderimini etkilemez.
  }
}

function resolveCategory(group: string | null, type: string | null) {
  const category = CATEGORY_GROUPS.find((item) => item.key === group);
  if (!category) return null;
  const child = category.children.find((item) => item.label === type || item.slug === type);
  if (!child) return null;
  return { group: category.key, type: child.label };
}

function isValidCity(country: string | null, city: string | null) {
  return Boolean(country && city && getCityOptions(country).includes(city));
}

function isValidDistrict(country: string | null, city: string | null, district: string | null) {
  if (!district) return true;
  if (!country || !city) return false;
  return getDistrictOptions(country, city).includes(district);
}

/* Teklif (RFQ) gönderimi — teklif formundan quotes tablosuna yazar. */
export async function submitQuote(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (isBot(formData)) return { ok: true };

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 200);
  const phone = clean(formData.get("phone"), 40);
  if (!name || !email || !phone) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };
  const allowed = await checkRateLimit({
    scope: "quote-submit",
    limit: 8,
    windowSeconds: 10 * 60,
    identity: [email.toLowerCase()],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const businessIdRaw = String(formData.get("businessId") ?? "").trim();
  const businessId = businessIdRaw && /^\d+$/.test(businessIdRaw) ? Number(businessIdRaw) : null;

  const peopleRaw = String(formData.get("people") ?? "").trim();
  const people = peopleRaw && /^\d+$/.test(peopleRaw) ? Math.min(Number(peopleRaw), 100000) : null;

  const company = clean(formData.get("company"), 160);
  const selectedCategory = resolveCategory(clean(formData.get("categoryGroup"), 80), clean(formData.get("categoryType"), 120));
  const country = clean(formData.get("country"), 80);
  const city = clean(formData.get("city"), 80);
  const district = clean(formData.get("district"), 80);
  const service = clean(formData.get("service"), 120) ?? selectedCategory?.type ?? null;
  const dateRange = clean(formData.get("dateRange"), 80);
  const message = clean(formData.get("message"), 4000);
  const payload: QuotePayload = {
    name,
    email,
    phone,
    company,
    service,
    dateRange,
    people,
    message,
    categoryGroup: selectedCategory?.group ?? null,
    categoryType: selectedCategory?.type ?? null,
    country,
    city,
    district,
  };

  if (!businessId) {
    if (!selectedCategory || !isValidCity(country, city) || !isValidDistrict(country, city, district)) {
      return { ok: false, error: "missing" };
    }
  }

  try {
    const supabase = await createClient();
    let targetBusinessIds = businessId ? [businessId] : [];

    if (!businessId && selectedCategory && country && city) {
      let query = supabase
        .from("businesses")
        .select("id")
        .eq("status", "approved")
        .eq("group", selectedCategory.group)
        .eq("type", selectedCategory.type)
        .eq("country", country)
        .eq("city", city);

      if (district) query = query.eq("district", district);

      const { data: matches, error: matchError } = await query;
      if (matchError) return { ok: false, error: matchError.message };
      targetBusinessIds = (matches ?? []).map((item) => Number(item.id)).filter(Number.isFinite);
      if (targetBusinessIds.length === 0) return { ok: false, error: "no_match" };
    }

    const rows = targetBusinessIds.map((targetBusinessId) => ({
      business_id: targetBusinessId,
      name,
      email,
      phone,
      company,
      service,
      category_group: selectedCategory?.group ?? null,
      category_type: selectedCategory?.type ?? null,
      country,
      city,
      district,
      date_range: dateRange,
      people,
      message,
    }));

    const { error } = await supabase.from("quotes").insert(rows);
    if (error) return { ok: false, error: error.message };

    // Teklif kaydı başarılı → işletme sahibine otomatik bildirim (varsa).
    await Promise.all(targetBusinessIds.map((targetBusinessId) => notifyOwnerOfQuote(targetBusinessId, payload)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

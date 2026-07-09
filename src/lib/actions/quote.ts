"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, escapeHtml } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { ALL_FACET_SLUGS, attrsPass } from "@/lib/facets";
import { getCityOptions, getDistrictOptions } from "@/lib/regions";
import { normalizeTr } from "@/lib/utils";
import { isPublicBusinessStatus, PUBLIC_BUSINESS_STATUSES } from "@/lib/business-visibility";
import type { ActionState, GroupKey } from "@/lib/types";
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

function cleanList(value: FormDataEntryValue | null, allowed?: Set<string>) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && (!allowed || allowed.has(item)))
    .slice(0, 40);
}

function matchesQuoteKeyword(
  row: { name: string; type: string; tag: string | null; city: string; district: string },
  raw: string | null,
) {
  const needle = normalizeTr(raw ?? "");
  if (!needle) return true;
  return [row.name, row.type, row.tag ?? "", row.city, row.district].some((value) =>
    normalizeTr(value).includes(needle),
  );
}

function cleanDate(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function dateRangeValue(formData: FormData) {
  const start = cleanDate(formData.get("dateStart"));
  const end = cleanDate(formData.get("dateEnd"));
  if (start && end) return `${start} - ${end}`;
  return start ?? end ?? null;
}

function normalizeTrPhone(value: FormDataEntryValue | null) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("90")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^5\d{9}$/.test(digits)) return null;
  return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
}

/* Teklif (RFQ) gönderimi — teklif formundan quotes tablosuna yazar. */
export async function submitQuote(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (isBot(formData)) return { ok: true };

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 200);
  const phone = normalizeTrPhone(formData.get("phone"));
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
  const dateRange = dateRangeValue(formData);
  const message = clean(formData.get("message"), 4000);
  const filterGroups = cleanList(
    formData.get("filterGroups"),
    new Set(CATEGORY_GROUPS.map((item) => item.key)),
  );
  const filterTypes = cleanList(
    formData.get("filterTypes"),
    new Set(CATEGORY_GROUPS.flatMap((item) => item.children.map((child) => child.label))),
  );
  const filterAttrs = cleanList(formData.get("filterAttrs"), ALL_FACET_SLUGS);
  const filterQ = clean(formData.get("filterQ"), 160);
  const filterRatingRaw = Number(formData.get("filterRating"));
  const filterRating = Number.isFinite(filterRatingRaw) ? Math.max(0, Math.min(5, filterRatingRaw)) : 0;
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
    if (businessId) {
      const { data: directTarget, error: directError } = await supabase
        .from("businesses")
        .select("id,status")
        .eq("id", businessId)
        .in("status", [...PUBLIC_BUSINESS_STATUSES])
        .maybeSingle();
      if (directError) return { ok: false, error: directError.message };
      if (!directTarget || !isPublicBusinessStatus(directTarget.status)) return { ok: false, error: "no_match" };
      targetBusinessIds = [Number(directTarget.id)];
    } else if (selectedCategory && country && city) {
      const targetGroups = (filterGroups.length ? filterGroups : [selectedCategory.group]) as GroupKey[];
      const targetTypes = filterTypes.length ? filterTypes : [selectedCategory.type];
      let query = supabase
        .from("businesses")
        .select("id,name,type,tag,city,district,rating,attributes")
        .in("status", [...PUBLIC_BUSINESS_STATUSES])
        .in("group", targetGroups)
        .in("type", targetTypes)
        .eq("country", country)
        .eq("city", city);

      if (district) query = query.eq("district", district);
      if (filterRating > 0) query = query.gte("rating", filterRating);

      const { data: matches, error: matchError } = await query;
      if (matchError) return { ok: false, error: matchError.message };
      targetBusinessIds = (matches ?? [])
        .filter((item) => attrsPass(item.attributes ?? [], new Set(filterAttrs)))
        .filter((item) => matchesQuoteKeyword(item, filterQ))
        .map((item) => Number(item.id))
        .filter(Number.isFinite);
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

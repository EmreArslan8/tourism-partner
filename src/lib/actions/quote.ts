"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { processRecentQuoteEmailDeliveries } from "@/lib/email-delivery";
import { checkRateLimit } from "@/lib/rate-limit";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { ALL_FACET_SLUGS, attrsPass } from "@/lib/facets";
import { isValidCity, isValidDistrict } from "@/lib/geo-server";
import { normalizeTr } from "@/lib/utils";
import { isPublicBusinessStatus, PUBLIC_BUSINESS_STATUSES } from "@/lib/business-visibility";
import type { ActionState, GroupKey } from "@/lib/types";
import { isEmail, isBot, clean } from "./validate";

function resolveCategory(group: string | null, type: string | null) {
  const category = CATEGORY_GROUPS.find((item) => item.key === group);
  if (!category) return null;
  const child = category.children.find((item) => item.label === type || item.slug === type);
  if (!child) return null;
  return { group: category.key, type: child.label };
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

function todayInIstanbul() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
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
    limit: 4,
    identityLimit: 4,
    globalLimit: 120,
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
  const validUntil = cleanDate(formData.get("validUntil"));
  if (!validUntil || validUntil < todayInIstanbul()) return { ok: false, error: "valid_until" };
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
  if (!businessId) {
    const [cityOk, districtOk] = await Promise.all([
      isValidCity(country ?? "", city ?? ""),
      isValidDistrict(country ?? "", city ?? "", district ?? ""),
    ]);
    if (!selectedCategory || !cityOk || !districtOk) {
      return { ok: false, error: "missing" };
    }
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const submissionStartedAt = new Date().toISOString();
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
      requester_id: user?.id ?? null,
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
      valid_until: validUntil,
      people,
      message,
    }));

    const writer = createAdminClient();
    if (!writer) return { ok: false, error: "service_role_unavailable" };
    const { error } = await writer.from("quotes").insert(rows);
    if (error) return { ok: false, error: error.message };

    // Teklif kaydı başarılı → işletme sahibine otomatik bildirim (varsa).
    // Outbox trigger'ı aynı transaction'da teslimat işini oluşturur; burada
    // sadece ilk denemeyi hızlandırıyoruz. Cron, düşen işleri yeniden dener.
    const delivery = await processRecentQuoteEmailDeliveries(email, targetBusinessIds, submissionStartedAt);
    console.info("[quote-submit] DB kaydı tamamlandı, mail sonucu", { targetCount: targetBusinessIds.length, delivery });
    if (process.env.REQUIRE_QUOTE_EMAIL === "true" && delivery.sent + delivery.sentFallback < targetBusinessIds.length) {
      console.error("[quote-submit] REQUIRE_QUOTE_EMAIL nedeniyle başarı dönülmedi", { targetCount: targetBusinessIds.length, delivery });
      return { ok: false, error: "email" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

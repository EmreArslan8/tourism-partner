import { createAdminClient } from "@/lib/supabase/admin";
import { quoteNotificationWhatsapp } from "@/lib/whatsapp-templates/quote-notification";
import { resolveTemplateLanguage, sendWhatsapp, toE164, whatsappConfigured } from "@/lib/whatsapp";

/* Teklif WhatsApp bildirimleri — e-posta outbox'ının aynı deseni.
   Tablo ve trigger: supabase/migrations/20260717130000_quote_whatsapp_outbox.sql

   E-postadan iki farkı var:
   - Fallback alıcı yok; numara yoksa kayıt 'skipped' olur (tekrar denenmez).
   - Env yapılandırılmamışsa kayıt 'pending' bırakılır; anahtarlar eklendiğinde
     cron aynı kayıtları gönderir. */

const MAX_BATCH = 50;
const RETRIES = [60, 300, 1800, 7200];

type Delivery = {
  id: number;
  quote_id: number;
  business_id: number | null;
  recipient_phone: string | null;
  recipient_locale: string | null;
  status: string;
  attempt_count: number;
  max_attempts: number;
};

export type WhatsappDeliveryRun = {
  ok: boolean;
  sent: number;
  skipped: number;
  pending: number;
  failed: number;
  reason?: string;
};

function emptyRun(reason?: string): WhatsappDeliveryRun {
  return { ok: !reason, sent: 0, skipped: 0, pending: 0, failed: 0, reason };
}

function db() {
  const admin = createAdminClient();
  // quote_whatsapp_deliveries migration ile eklendi; `npm run gen:types`
  // çalıştırılana kadar üretilen tiplerde yok (bkz. email-delivery.ts).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return admin ? (admin as any) : null;
}

function retryAt(attempt: number) {
  return new Date(Date.now() + (RETRIES[Math.min(attempt, RETRIES.length - 1)] ?? 7200) * 1000).toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderDelivery(admin: any, delivery: Delivery, language: string) {
  const [{ data: quote }, { data: business }] = await Promise.all([
    admin.from("quotes").select("name,service,category_type,country,city,district,date_range,valid_until,people").eq("id", delivery.quote_id).maybeSingle(),
    delivery.business_id
      ? admin.from("businesses").select("name").eq("id", delivery.business_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (!quote || !business) throw new Error("quote_or_business_not_found");
  return quoteNotificationWhatsapp({
    businessName: business.name,
    senderName: quote.name,
    service: quote.service,
    category: quote.category_type,
    location: [quote.country, quote.city, quote.district].filter(Boolean).join(" · ") || null,
    dateRange: quote.date_range,
    validUntil: quote.valid_until,
    people: quote.people,
  }, language);
}

export async function processQuoteWhatsappDelivery(id: number): Promise<string> {
  console.info("[quote-whatsapp] delivery başlıyor", { deliveryId: id });
  const admin = db();
  if (!admin) {
    console.error("[quote-whatsapp] admin client yok; SUPABASE_SERVICE_ROLE_KEY eksik");
    return "service_role_unavailable";
  }
  if (!whatsappConfigured()) {
    // Kayıt pending kalsın: anahtarlar tanımlandığında cron kaldığı yerden sürer.
    console.warn("[quote-whatsapp] env yapılandırılmadı, kayıt bekletiliyor", { deliveryId: id });
    return "not_configured";
  }

  const { data: claimed } = await admin
    .from("quote_whatsapp_deliveries")
    .update({ status: "sending", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("id,quote_id,business_id,recipient_phone,recipient_locale,status,attempt_count,max_attempts")
    .maybeSingle();
  const delivery = claimed as Delivery | null;
  if (!delivery) {
    console.warn("[quote-whatsapp] delivery claim edilemedi veya kayıt pending değil", { deliveryId: id });
    return "not_claimed";
  }

  const to = toE164(delivery.recipient_phone);
  if (!to) {
    await admin.from("quote_whatsapp_deliveries").update({ status: "skipped", last_error: "recipient_phone_missing_or_invalid", updated_at: new Date().toISOString() }).eq("id", id);
    console.warn("[quote-whatsapp] geçerli numara yok, atlandı", { deliveryId: id, businessId: delivery.business_id });
    return "skipped";
  }

  try {
    const language = resolveTemplateLanguage(delivery.recipient_locale);
    const bodyParams = await renderDelivery(admin, delivery, language);
    const result = await sendWhatsapp({ to, bodyParams, language });
    if (result.ok) {
      await admin.from("quote_whatsapp_deliveries").update({ status: "sent", provider: "meta_cloud", provider_message_id: result.id ?? null, sent_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_error: null }).eq("id", id);
      return "sent";
    }
    throw new Error(result.error ?? "whatsapp_send_failed");
  } catch (error) {
    const attempt = delivery.attempt_count + 1;
    const exhausted = attempt >= delivery.max_attempts;
    const message = error instanceof Error ? error.message : "unknown";
    await admin.from("quote_whatsapp_deliveries").update({ status: exhausted ? "failed" : "pending", attempt_count: attempt, next_attempt_at: retryAt(attempt), last_error: message.slice(0, 1000), updated_at: new Date().toISOString() }).eq("id", id);
    console.error("[quote-whatsapp] teslimat başarısız", { id, attempt, exhausted, error: message });
    return exhausted ? "failed" : "retry_scheduled";
  }
}

function summarizeResults(results: string[]): WhatsappDeliveryRun {
  return {
    ok: results.length > 0 && results.every((result) => result === "sent" || result === "skipped"),
    sent: results.filter((result) => result === "sent").length,
    skipped: results.filter((result) => result === "skipped").length,
    pending: results.filter((result) => result === "retry_scheduled" || result === "not_configured").length,
    failed: results.filter((result) => result === "failed" || result === "service_role_unavailable").length,
    reason: results.length === 0 ? "no_pending_delivery" : undefined,
  };
}

export async function processQuoteWhatsappDeliveries(quoteId: number) {
  const admin = db();
  if (!admin) return emptyRun("service_role_unavailable");
  const { data, error } = await admin.from("quote_whatsapp_deliveries").select("id").eq("quote_id", quoteId).in("status", ["pending", "sending"]);
  if (error) {
    console.error("[quote-whatsapp] outbox okunamadı", error.message);
    return emptyRun(error.message);
  }
  const results = await Promise.all((data ?? []).map((row: { id: number }) => processQuoteWhatsappDelivery(row.id)));
  return summarizeResults(results);
}

/* Teklif gönderiminden hemen sonra ilk denemeyi hızlandırır; e-postadaki
   processRecentQuoteEmailDeliveries ile aynı eşleşme mantığını kullanır. */
export async function processRecentQuoteWhatsappDeliveries(email: string, businessIds: number[], createdAfter: string) {
  const admin = db();
  if (!admin || businessIds.length === 0) return emptyRun(!admin ? "service_role_unavailable" : "no_business_target");
  if (!whatsappConfigured()) return emptyRun("not_configured");
  const { data, error } = await admin
    .from("quotes")
    .select("id")
    .eq("email", email)
    .in("business_id", businessIds)
    .gte("created_at", createdAfter)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[quote-whatsapp] yeni quote outbox eşleşmedi", error.message);
    return emptyRun(error.message);
  }
  const runs = await Promise.all((data ?? []).map((row: { id: number }) => processQuoteWhatsappDeliveries(Number(row.id))));
  const result = runs.reduce((total, run) => ({
    ok: total.ok && run.ok,
    sent: total.sent + run.sent,
    skipped: total.skipped + run.skipped,
    pending: total.pending + run.pending,
    failed: total.failed + run.failed,
    reason: run.reason ?? total.reason,
  }), emptyRun(data?.length ? undefined : "no_quote_delivery_found"));
  console.info("[quote-whatsapp] quote delivery sonucu", result);
  return result;
}

export async function processDueQuoteWhatsappDeliveries() {
  const admin = db();
  if (!admin) return { ok: false, processed: 0, error: "service_role_unavailable" };
  if (!whatsappConfigured()) return { ok: true, processed: 0, skippedReason: "not_configured" };
  const staleBefore = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  await admin.from("quote_whatsapp_deliveries").update({ status: "pending", updated_at: new Date().toISOString() }).eq("status", "sending").lt("updated_at", staleBefore);
  const { data, error } = await admin.from("quote_whatsapp_deliveries").select("id").in("status", ["pending", "sending"]).lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(MAX_BATCH);
  if (error) return { ok: false, processed: 0, error: error.message };
  const results = await Promise.all((data ?? []).map((row: { id: number }) => processQuoteWhatsappDelivery(row.id)));
  return { ok: true, processed: results.length, results };
}

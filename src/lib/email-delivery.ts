import { createAdminClient } from "@/lib/supabase/admin";
import { quoteNotificationEmail } from "@/lib/email-templates/quote-notification";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

const MAX_BATCH = 50;
const RETRIES = [60, 300, 1800, 7200];

type Delivery = {
  id: number;
  quote_id: number;
  business_id: number | null;
  recipient_email: string | null;
  fallback_email: string | null;
  status: string;
  attempt_count: number;
  max_attempts: number;
};

export type EmailDeliveryRun = {
  ok: boolean;
  sent: number;
  sentFallback: number;
  pending: number;
  failed: number;
  reason?: string;
};

function emptyRun(reason?: string): EmailDeliveryRun {
  return { ok: !reason, sent: 0, sentFallback: 0, pending: 0, failed: 0, reason };
}

function db() {
  const admin = createAdminClient();
  // email_deliveries is added by a migration and is intentionally kept out of
  // the generated legacy Database type until `npm run gen:types` is run.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return admin ? (admin as any) : null;
}

function retryAt(attempt: number) {
  return new Date(Date.now() + (RETRIES[Math.min(attempt, RETRIES.length - 1)] ?? 7200) * 1000).toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderDelivery(admin: any, delivery: Delivery) {
  const [{ data: quote }, { data: business }] = await Promise.all([
    admin.from("quotes").select("name,email,phone,company,service,category_type,country,city,district,date_range,valid_until,people,message").eq("id", delivery.quote_id).maybeSingle(),
    delivery.business_id
      ? admin.from("businesses").select("name").eq("id", delivery.business_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (!quote || !business) throw new Error("quote_or_business_not_found");
  return {
    notification: quoteNotificationEmail({
    businessName: business.name,
    senderName: quote.name,
    senderEmail: quote.email,
    senderPhone: quote.phone,
    company: quote.company,
    service: quote.service,
    category: quote.category_type,
    location: [quote.country, quote.city, quote.district].filter(Boolean).join(" · ") || null,
    dateRange: quote.date_range,
    validUntil: quote.valid_until,
    people: quote.people,
    message: quote.message,
    dashboardUrl: `${SITE_URL}/tr/panel/talepler`,
    logoUrl: `${SITE_URL}/assets/logo.webp`,
    }),
    replyTo: quote.email,
  };
}

export async function processQuoteEmailDelivery(id: number): Promise<string> {
  console.info("[quote-email] delivery başlıyor", { deliveryId: id });
  const admin = db();
  if (!admin) {
    console.error("[quote-email] admin client yok; SUPABASE_SERVICE_ROLE_KEY eksik");
    return "service_role_unavailable";
  }

  const { data: claimed } = await admin
    .from("quote_email_deliveries")
    .update({ status: "sending", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("id,quote_id,business_id,recipient_email,fallback_email,status,attempt_count,max_attempts")
    .maybeSingle();
  const delivery = claimed as Delivery | null;
  if (!delivery) {
    console.warn("[quote-email] delivery claim edilemedi veya kayıt pending değil", { deliveryId: id });
    return "not_claimed";
  }

  try {
    const { notification, replyTo } = await renderDelivery(admin, delivery);
    const primary = delivery.recipient_email?.trim() || null;
    const fallback = delivery.fallback_email?.trim() || process.env.EMAIL_FALLBACK_TO?.trim() || null;
    console.info("[quote-email] recipient çözüldü", { deliveryId: id, quoteId: delivery.quote_id, businessId: delivery.business_id, primaryConfigured: Boolean(primary), fallbackConfigured: Boolean(fallback), attempt: delivery.attempt_count + 1 });
    if (!primary && !fallback) throw new Error("recipient_email_missing");

    const first = primary ? await sendEmail({ to: primary, subject: notification.subject, html: notification.html, text: notification.text, replyTo }) : null;
    if (first?.ok) {
      await admin.from("quote_email_deliveries").update({ status: "sent", provider: "resend", provider_message_id: first.id ?? null, sent_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_error: null }).eq("id", id);
      return "sent";
    }

    if (fallback && fallback !== primary) {
      const second = await sendEmail({ to: fallback, subject: `[Fallback] ${notification.subject}`, html: notification.html, text: notification.text, replyTo });
      if (second.ok) {
        await admin.from("quote_email_deliveries").update({ status: "sent_fallback", provider: "resend", provider_message_id: second.id ?? null, sent_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_error: first?.error ?? "primary_delivery_failed" }).eq("id", id);
        console.warn("[quote-email] fallback alıcıya gönderildi", { id, primary });
        return "sent_fallback";
      }
    }
    throw new Error(first?.error ?? "email_send_failed");
  } catch (error) {
    const attempt = delivery.attempt_count + 1;
    const exhausted = attempt >= delivery.max_attempts;
    const message = error instanceof Error ? error.message : "unknown";
    await admin.from("quote_email_deliveries").update({ status: exhausted ? "failed" : "pending", attempt_count: attempt, next_attempt_at: retryAt(attempt), last_error: message.slice(0, 1000), updated_at: new Date().toISOString() }).eq("id", id);
    console.error("[quote-email] teslimat başarısız", { id, attempt, exhausted, error: message });
    return exhausted ? "failed" : "retry_scheduled";
  }
}

export async function processQuoteEmailDeliveries(quoteId: number) {
  console.info("[quote-email] quote delivery lookup", { quoteId });
  const admin = db();
  if (!admin) {
    console.error("[quote-email] outbox oluşturulamadı: SUPABASE_SERVICE_ROLE_KEY eksik");
    return emptyRun("service_role_unavailable");
  }
  const { data, error } = await admin.from("quote_email_deliveries").select("id").eq("quote_id", quoteId).in("status", ["pending", "sending"]);
  if (error) {
    console.error("[quote-email] outbox okunamadı", error.message);
    return emptyRun(error.message);
  }
  const results = await Promise.all((data ?? []).map((row: { id: number }) => processQuoteEmailDelivery(row.id)));
  return summarizeResults(results);
}

function summarizeResults(results: string[]): EmailDeliveryRun {
  return {
    ok: results.length > 0 && results.every((result) => result === "sent" || result === "sent_fallback"),
    sent: results.filter((result) => result === "sent").length,
    sentFallback: results.filter((result) => result === "sent_fallback").length,
    pending: results.filter((result) => result === "retry_scheduled").length,
    failed: results.filter((result) => result === "failed" || result === "service_role_unavailable").length,
    reason: results.length === 0 ? "no_pending_delivery" : undefined,
  };
}

export async function processRecentQuoteEmailDeliveries(email: string, businessIds: number[], createdAfter: string) {
  const admin = db();
  console.info("[quote-email] yeni quote delivery aranıyor", { businessCount: businessIds.length, createdAfter });
  if (!admin || businessIds.length === 0) return emptyRun(!admin ? "service_role_unavailable" : "no_business_target");
  const { data, error } = await admin
    .from("quotes")
    .select("id")
    .eq("email", email)
    .in("business_id", businessIds)
    .gte("created_at", createdAfter)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[quote-email] yeni quote outbox eşleşmedi", error.message);
    return emptyRun(error.message);
  }
  const runs = await Promise.all((data ?? []).map((row: { id: number }) => processQuoteEmailDeliveries(Number(row.id))));
  const result = runs.reduce((total, run) => ({
    ok: total.ok && run.ok,
    sent: total.sent + run.sent,
    sentFallback: total.sentFallback + run.sentFallback,
    pending: total.pending + run.pending,
    failed: total.failed + run.failed,
    reason: run.reason ?? total.reason,
  }), emptyRun(data?.length ? undefined : "no_quote_delivery_found"));
  console.info("[quote-email] quote delivery sonucu", result);
  return result;
}

export async function processDueQuoteEmailDeliveries() {
  const admin = db();
  if (!admin) return { ok: false, processed: 0, error: "service_role_unavailable" };
  const staleBefore = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  await admin.from("quote_email_deliveries").update({ status: "pending", updated_at: new Date().toISOString() }).eq("status", "sending").lt("updated_at", staleBefore);
  const { data, error } = await admin.from("quote_email_deliveries").select("id").in("status", ["pending", "sending"]).lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(MAX_BATCH);
  if (error) return { ok: false, processed: 0, error: error.message };
  const results = await Promise.all((data ?? []).map((row: { id: number }) => processQuoteEmailDelivery(row.id)));
  return { ok: true, processed: results.length, results };
}

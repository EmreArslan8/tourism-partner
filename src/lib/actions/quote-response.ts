"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPanelBusiness } from "@/lib/panel-auth";
import { sendEmail } from "@/lib/email";
import { quoteOfferEmail } from "@/lib/email-templates/quote-offer";
import { EMAIL_LOGO_URL } from "@/lib/site";
import type { ActionState } from "@/lib/types";
import { clean } from "./validate";

/* Tedarikçinin gelen teklife (RFQ) fiyat/serbest-metin yanıtı göndermesi.
   Yanıt teklifi isteyene markalı e-posta ile iletilir, quote_responses'a yazılır
   ve teklif durumu 'quoted' olur. Sahiplik kodda doğrulanır; yazma işlemleri
   RLS'i baypas eden service-role client ile yapılır. Gönderim senkrondur —
   tedarikçi sonucu anında görür. */
export async function sendQuoteOffer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthorized" };

  const biz = await getPanelBusiness();
  if (!biz) return { ok: false, error: "unauthorized" };

  const quoteId = Number(formData.get("quoteId"));
  const message = clean(formData.get("message"), 4000);
  if (!Number.isInteger(quoteId) || quoteId <= 0) return { ok: false, error: "invalid" };
  if (!message) return { ok: false, error: "missing" };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "config" };

  // Sahiplik: teklif bu işletmeye ait olmalı.
  const { data: quote } = await admin
    .from("quotes")
    .select("id,business_id,name,email,service")
    .eq("id", quoteId)
    .maybeSingle();
  if (!quote || quote.business_id !== biz.id) return { ok: false, error: "notFound" };
  if (!quote.email) return { ok: false, error: "no_recipient" };

  const businessEmail = user.email ?? null;
  const email = quoteOfferEmail({
    businessName: biz.name,
    logoUrl: EMAIL_LOGO_URL,
    recipientName: quote.name,
    offerMessage: message,
    service: quote.service,
    businessEmail,
  });

  const result = await sendEmail({
    to: quote.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: businessEmail ?? undefined,
  });

  const sent = result.ok;
  await admin.from("quote_responses").insert({
    quote_id: quoteId,
    business_id: biz.id,
    responder_id: user.id,
    message,
    email_status: sent ? "sent" : "failed",
    email_sent_at: sent ? new Date().toISOString() : null,
    provider_message_id: result.id ?? null,
    last_error: sent ? null : (result.error ?? "send_failed"),
  });

  if (sent) {
    await admin.from("quotes").update({ status: "quoted" }).eq("id", quoteId);
  }

  revalidatePath("/[locale]/dashboard/teklifler", "page");
  return sent ? { ok: true } : { ok: false, error: "send_failed" };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/lib/types";
import { clean, isBot, isEmail } from "./validate";

/* Destek (Brief §8 "Destek Modülü / Ticket"): işletme sahibi platform yönetimine
   teknik/operasyonel destek talebi açar. support_tickets tablosu admin şemasında
   tanımlı; owner RLS'i migration 0003 ile eklendi. */
export async function createSupportTicket(formData: FormData): Promise<void> {
  const subject = clean(formData.get("subject"), 200);
  const message = clean(formData.get("message"), 4000);
  if (!subject || !message) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: biz } = await supabase
    .from("businesses")
    .select("id,name")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  const email = user.email && isEmail(user.email) ? user.email : null;

  await supabase.from("support_tickets").insert({
    sender_name: biz?.name ?? user.email ?? "Üye",
    sender_email: email,
    business_id: biz?.id ?? null,
    subject,
    message,
    status: "new",
  });
  revalidatePath("/[locale]/dashboard/support", "page");
}

/* Talebin gerçekten giriş yapmış kullanıcının işletmesine ait olduğunu doğrular.
   Sahip değilse null döner; owner işlemleri (cevap/çöz/arşiv) buradan geçer. */
async function requireOwnedTicket(ticketId: number) {
  if (!ticketId) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id,business_id,status")
    .eq("id", ticketId)
    .maybeSingle();
  if (!ticket?.business_id) return null;

  const { data: biz } = await supabase
    .from("businesses")
    .select("id,name")
    .eq("id", ticket.business_id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!biz) return null;

  return { supabase, user, ticket, biz };
}

function revalidateSupport(ticketId: number) {
  revalidatePath("/[locale]/dashboard/support", "page");
  revalidatePath("/[locale]/dashboard/support/[id]", "page");
  revalidatePath(`/[locale]/dashboard/support/${ticketId}`, "page");
}

/* İşletme sahibi, kendi destek talebine cevap yazar (panel içi yazışma).
   Mesaj owner RLS ile eklenir; talep tekrar admin'e "yeni" olarak düşsün diye
   durum service-role ile 'new'e çekilir (owner ticket update yetkisi yok). */
export async function replyToOwnTicket(formData: FormData): Promise<void> {
  const ticketId = Number(formData.get("ticket_id"));
  const body = clean(formData.get("message"), 4000);
  if (!body) return;
  const owned = await requireOwnedTicket(ticketId);
  if (!owned) return;
  const { supabase, user, ticket, biz } = owned;

  const { error } = await supabase.from("support_ticket_messages").insert({
    ticket_id: ticketId,
    author_id: user.id,
    author_name: biz.name,
    body,
  });
  if (error) return;

  // Arşivlenmemişse admin bildiriminde görünsün diye tekrar "yeni" durumuna çek.
  if (ticket.status !== "archived") {
    const admin = createAdminClient();
    if (admin) await admin.from("support_tickets").update({ status: "new" }).eq("id", ticketId);
  }

  revalidateSupport(ticketId);
}

/* İşletme kendi talebini "çözüldü" olarak kapatır (sorunu hallolduysa). */
export async function resolveOwnTicket(formData: FormData): Promise<void> {
  const ticketId = Number(formData.get("ticket_id"));
  const owned = await requireOwnedTicket(ticketId);
  if (!owned) return;

  const admin = createAdminClient();
  if (admin) {
    await admin
      .from("support_tickets")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", ticketId);
  }
  revalidateSupport(ticketId);
}

/* İşletme kendi talebini arşive kaldırır — listede "Arşiv" sekmesinde görünür. */
export async function archiveOwnTicket(formData: FormData): Promise<void> {
  const ticketId = Number(formData.get("ticket_id"));
  const owned = await requireOwnedTicket(ticketId);
  if (!owned) return;

  const admin = createAdminClient();
  if (admin) await admin.from("support_tickets").update({ status: "archived" }).eq("id", ticketId);
  revalidateSupport(ticketId);
}

/* Public Yardım Al formu — giriş gerektirmez, ticket admin destek kutusuna düşer.
   Anon RLS açmamak için insert service-role ile yapılır; honeypot + rate limit korur. */
export async function createPublicSupportTicket(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (isBot(formData)) return { ok: true };

  const name = clean(formData.get("name"), 160);
  const email = clean(formData.get("email"), 200);
  const subject = clean(formData.get("subject"), 200);
  const message = clean(formData.get("message"), 4000);
  if (!name || !email || !subject || !message) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };

  const allowed = await checkRateLimit({
    scope: "support-public",
    limit: 3,
    windowSeconds: 10 * 60,
    identity: [email.toLowerCase()],
  });
  if (!allowed) return { ok: false, error: "rate" };

  // Giriş yapmış kullanıcının işletmesi varsa ticket'a iliştir (admin tarafında bağlam).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let businessId: number | null = null;
  if (user) {
    const { data: biz } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .order("id")
      .limit(1)
      .maybeSingle();
    businessId = biz?.id ?? null;
  }

  const admin = createAdminClient();
  const writer = admin ?? (user ? supabase : null);
  if (!writer) return { ok: false, error: "generic" };

  const { error } = await writer.from("support_tickets").insert({
    sender_name: name,
    sender_email: email,
    business_id: businessId,
    subject,
    message,
    status: "new",
  });
  if (error) return { ok: false, error: "generic" };
  return { ok: true };
}

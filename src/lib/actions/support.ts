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

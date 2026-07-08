"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clean, isEmail } from "./validate";

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

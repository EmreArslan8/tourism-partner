"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { isEmail, isBot, clean } from "./validate";

/* Teklif (RFQ) gönderimi — teklif formundan quotes tablosuna yazar. */
export async function submitQuote(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (isBot(formData)) return { ok: true };

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 200);
  if (!name || !email) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };

  const businessIdRaw = String(formData.get("businessId") ?? "").trim();
  const businessId = businessIdRaw && /^\d+$/.test(businessIdRaw) ? Number(businessIdRaw) : null;

  const peopleRaw = String(formData.get("people") ?? "").trim();
  const people = peopleRaw && /^\d+$/.test(peopleRaw) ? Math.min(Number(peopleRaw), 100000) : null;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("quotes").insert({
      business_id: businessId,
      name,
      email,
      company: clean(formData.get("company"), 160),
      service: clean(formData.get("service"), 120),
      date_range: clean(formData.get("dateRange"), 80),
      people,
      message: clean(formData.get("message"), 4000),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

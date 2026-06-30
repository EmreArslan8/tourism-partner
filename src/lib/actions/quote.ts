"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, escapeHtml } from "@/lib/email";
import type { ActionState } from "@/lib/types";
import { isEmail, isBot, clean } from "./validate";

/* Teklif geldiğinde işletme sahibine otomatik e-posta. Sahibin e-postası
   auth.users'tadır; service-role client ile okunur. Anahtarlar yoksa veya
   herhangi bir hata olursa sessizce atlanır — teklif kaydı asla etkilenmez. */
async function notifyOwnerOfQuote(
  businessId: number,
  q: { name: string; email: string; company: string | null; service: string | null; dateRange: string | null; people: number | null; message: string | null },
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
      ["Hizmet", q.service],
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

  const company = clean(formData.get("company"), 160);
  const service = clean(formData.get("service"), 120);
  const dateRange = clean(formData.get("dateRange"), 80);
  const message = clean(formData.get("message"), 4000);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("quotes").insert({
      business_id: businessId,
      name,
      email,
      company,
      service,
      date_range: dateRange,
      people,
      message,
    });
    if (error) return { ok: false, error: error.message };

    // Teklif kaydı başarılı → işletme sahibine otomatik bildirim (varsa).
    if (businessId) {
      await notifyOwnerOfQuote(businessId, { name, email, company, service, dateRange, people, message });
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

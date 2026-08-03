import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { getPromoTemplate, PROMO_TEMPLATES, type PromoTemplate } from "@/lib/promo-templates";

type PromoTemplateRow = Database["public"]["Tables"]["promo_email_templates"]["Row"];
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export function promoTemplateFromRow(row: PromoTemplateRow): PromoTemplate {
  const builtIn = PROMO_TEMPLATES.find((template) => template.id === row.id);

  return {
    id: row.id,
    label: row.label,
    subject: row.subject,
    preheader: row.preheader,
    headline: row.headline,
    intro: row.intro,
    bullets: row.bullets,
    outro: row.outro,
    ctaLabel: row.cta_label,
    campaign: row.campaign,
    imageUrl: row.image_url || builtIn?.imageUrl || "",
    backgroundColor: row.background_color,
    textColor: row.text_color,
    accentColor: row.accent_color,
  };
}

/** Veritabanındaki kayıtlar hazır şablonların aynı id'li sürümlerini ezer. */
export async function listPromoTemplates(): Promise<PromoTemplate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promo_email_templates")
    .select("*")
    .order("updated_at", { ascending: false });

  // Migration henüz uygulanmamış ortamlarda hazır şablonlarla çalışmaya devam et.
  if (error || !data) return PROMO_TEMPLATES;

  const stored = data.map(promoTemplateFromRow);
  const storedIds = new Set(stored.map((template) => template.id));
  return [...stored, ...PROMO_TEMPLATES.filter((template) => !storedIds.has(template.id))];
}

export async function resolvePromoTemplate(
  supabase: SupabaseClient,
  id: string | null | undefined,
): Promise<PromoTemplate> {
  if (id) {
    const { data } = await supabase
      .from("promo_email_templates")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (data) return promoTemplateFromRow(data);
  }

  return getPromoTemplate(id);
}

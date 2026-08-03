"use server";

import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";
import { getPromoTemplate, PROMO_TEMPLATES, type PromoTemplate } from "@/lib/promo-templates";
import { promoTemplateFromRow } from "@/lib/promo-template-store";

export type SavePromoTemplateResult =
  | { ok: true; template: PromoTemplate }
  | { ok: false; error: "forbidden" | "invalid" | "save_failed" };

const trim = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const isColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);
const isImageUrl = (value: string) => !value || /^https?:\/\/[^\s]+$/i.test(value);

function slug(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function savePromoTemplate(input: PromoTemplate): Promise<SavePromoTemplateResult> {
  let context;
  try {
    context = await requireAdminContext();
  } catch {
    return { ok: false, error: "forbidden" };
  }

  const label = trim(input.label, 120);
  const subject = trim(input.subject, 200);
  const preheader = trim(input.preheader, 240);
  const headline = trim(input.headline, 180);
  const intro = trim(input.intro, 6000);
  const bullets = (Array.isArray(input.bullets) ? input.bullets : [])
    .map((bullet) => trim(bullet, 240))
    .filter(Boolean)
    .slice(0, 12);
  const outro = trim(input.outro, 6000);
  const ctaLabel = trim(input.ctaLabel, 80);
  const campaign = slug(trim(input.campaign, 60) || label);
  const imageUrl = trim(input.imageUrl, 1000);
  const backgroundColor = trim(input.backgroundColor, 7);
  const textColor = trim(input.textColor, 7);
  const accentColor = trim(input.accentColor, 7);
  const requestedId = trim(input.id, 80);
  const id = /^[a-z0-9][a-z0-9-]{1,79}$/.test(requestedId)
    ? requestedId
    : `${slug(label) || "mail-sablonu"}-${crypto.randomUUID().slice(0, 8)}`;

  if (
    label.length < 2 ||
    subject.length < 2 ||
    headline.length < 2 ||
    !intro ||
    ctaLabel.length < 2 ||
    campaign.length < 2 ||
    !isImageUrl(imageUrl) ||
    !isColor(backgroundColor) ||
    !isColor(textColor) ||
    !isColor(accentColor)
  ) {
    return { ok: false, error: "invalid" };
  }

  const { data: existing } = await context.supabase
    .from("promo_email_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const values = {
    label,
    subject,
    preheader,
    headline,
    intro,
    bullets,
    outro,
    cta_label: ctaLabel,
    campaign,
    image_url: imageUrl,
    background_color: backgroundColor,
    text_color: textColor,
    accent_color: accentColor,
  };

  const query = existing
    ? context.supabase.from("promo_email_templates").update(values).eq("id", id)
    : context.supabase.from("promo_email_templates").insert({
        id,
        ...values,
        created_by: context.userId,
      });
  const { data, error } = await query.select("*").single();

  if (error || !data) return { ok: false, error: "save_failed" };

  const template = promoTemplateFromRow(data);
  const staticTemplate = PROMO_TEMPLATES.some((item) => item.id === id) ? getPromoTemplate(id) : null;
  await writeAdminAudit(
    context,
    existing ? "promo.template.update" : "promo.template.create",
    "promo_email_template",
    id,
    template,
    existing ? promoTemplateFromRow(existing) : staticTemplate,
  );

  return { ok: true, template };
}

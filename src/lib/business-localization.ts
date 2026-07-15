import type { Business, BusinessTranslation, BusinessTranslations } from "./types";

export type PublicLocale = "tr" | "en" | "ru" | "ar";

const LOCALES = new Set<PublicLocale>(["tr", "en", "ru", "ar"]);

export function normalizeLocale(locale: string): PublicLocale {
  return LOCALES.has(locale as PublicLocale) ? (locale as PublicLocale) : "tr";
}

function clean(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function parseBusinessTranslations(raw: unknown): BusinessTranslations | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;

  const output: BusinessTranslations = {};
  for (const locale of ["tr", "en", "ru", "ar"] as const) {
    const entry = (raw as Record<string, unknown>)[locale];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const source = entry as Record<string, unknown>;
    const translation: BusinessTranslation = {
      description: clean(source.description),
      tag: clean(source.tag),
      seoTitle: clean(source.seoTitle) ?? clean(source.seo_title),
      seoDescription: clean(source.seoDescription) ?? clean(source.seo_description),
    };
    if (Object.values(translation).some(Boolean)) output[locale] = translation;
  }

  return Object.keys(output).length ? output : undefined;
}

export function businessDescription(business: Business, locale: string): string {
  const normalized = normalizeLocale(locale);
  return business.translations?.[normalized]?.description || business.desc;
}

export function businessTag(business: Business, locale: string): string {
  const normalized = normalizeLocale(locale);
  return business.translations?.[normalized]?.tag || business.tag;
}

export function businessSeoTitle(business: Business, locale: string): string | undefined {
  const normalized = normalizeLocale(locale);
  return business.translations?.[normalized]?.seoTitle || business.seoTitle;
}

export function businessSeoDescription(business: Business, locale: string): string | undefined {
  const normalized = normalizeLocale(locale);
  return business.translations?.[normalized]?.seoDescription || business.seoDescription;
}

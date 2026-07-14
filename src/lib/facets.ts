import type { Business, GroupKey, Facet } from "./types";

/* Filtreleme motoru — facet (öznitelik) kayıt defteri.
   Tüm çok-seçim facet'ler `business.attributes` slug'ları üzerinden çalışır.
   Mantık: facet İÇİNDE "VEYA", facet'ler ARASINDA "VE" (klasik faceted search).
   scope: "common" → her kategoride görünür; GroupKey[] → ilgili grup seçiliyse görünür. */

export const FACETS: Facet[] = [
  // ——— KONAKLAMA ———
  {
    key: "yildiz", label: "Yıldız", scope: ["konaklama"],
    options: [
      { slug: "yildiz-5", label: "5 yıldız" },
      { slug: "yildiz-4", label: "4 yıldız" },
      { slug: "yildiz-3", label: "3 yıldız" },
      { slug: "butik", label: "Butik" },
    ],
  },
  {
    key: "konsept", label: "Konsept", scope: ["konaklama"],
    options: [
      { slug: "ultra-hersey-dahil", label: "Ultra her şey dahil" },
      { slug: "hersey-dahil", label: "Her şey dahil" },
      { slug: "yarim-pansiyon", label: "Yarım pansiyon" },
      { slug: "oda-kahvalti", label: "Oda + kahvaltı" },
    ],
  },
  {
    key: "olanak", label: "Olanaklar", scope: ["konaklama"],
    options: [
      { slug: "denize-sifir", label: "Denize sıfır" },
      { slug: "havuz", label: "Havuz" },
      { slug: "spa", label: "Spa" },
      { slug: "mice-salon", label: "MICE / toplantı" },
      { slug: "cocuk-kulubu", label: "Çocuk kulübü" },
    ],
  },

  // ——— ACENTE & DMC ———
  {
    key: "pazar", label: "Çalışılan pazar", scope: ["acente"],
    options: [
      { slug: "pazar-avrupa", label: "Avrupa" },
      { slug: "pazar-rusya-bdt", label: "Rusya / BDT" },
      { slug: "pazar-ortadogu", label: "Orta Doğu" },
      { slug: "pazar-uzakdogu", label: "Uzak Doğu" },
    ],
  },

  // ——— ULAŞIM ———
  {
    key: "arac-tipi", label: "Araç tipi", scope: ["ulasim"],
    options: [
      { slug: "vip-arac", label: "VIP araç" },
      { slug: "minibus", label: "Minibüs" },
      { slug: "otobus", label: "Otobüs" },
      { slug: "rent-a-car", label: "Rent A Car" },
    ],
  },

  // ——— DİLLER (rehber + acente + sağlık ortak) ———
  {
    key: "dil", label: "Diller", scope: ["rehber", "acente", "saglik"],
    options: [
      { slug: "dil-en", label: "İngilizce" },
      { slug: "dil-de", label: "Almanca" },
      { slug: "dil-fr", label: "Fransızca" },
      { slug: "dil-es", label: "İspanyolca" },
      { slug: "dil-ru", label: "Rusça" },
      { slug: "dil-ar", label: "Arapça" },
    ],
  },
];

// slug → facet key ve slug → etiket eşlemeleri (gruplama ve aktif etiketler için)
const SLUG_TO_FACET: Record<string, string> = {};
const SLUG_TO_LABEL: Record<string, string> = {};
const FACET_ORDER: Record<string, number> = {};
for (const f of FACETS) {
  FACET_ORDER[f.key] = FACET_ORDER[f.key] ?? Object.keys(FACET_ORDER).length;
  for (const o of f.options) {
    SLUG_TO_FACET[o.slug] = f.key;
    SLUG_TO_LABEL[o.slug] = o.label;
  }
}

export const ALL_FACET_SLUGS = new Set(Object.keys(SLUG_TO_FACET));
export const facetLabel = (slug: string) => SLUG_TO_LABEL[slug] ?? slug;

/** Seçili gruplara göre gösterilecek facet'ler (ortak + ilgili grup facet'leri). */
export function visibleFacets(groups: GroupKey[]): Facet[] {
  return FACETS.filter(
    (f) => f.scope === "common" || (groups.length > 0 && f.scope.some((g) => groups.includes(g)))
  );
}

/** Facet süzgeci: facet-içi VEYA, facet'ler-arası VE. */
export function attrsPass(businessAttrs: string[] | undefined, selected: Set<string>): boolean {
  if (selected.size === 0) return true;
  const has = new Set(businessAttrs ?? []);
  const byFacet: Record<string, string[]> = {};
  for (const slug of selected) {
    const k = SLUG_TO_FACET[slug] ?? "_";
    (byFacet[k] ??= []).push(slug);
  }
  return Object.values(byFacet).every((slugs) => slugs.some((s) => has.has(s)));
}

export type FeaturedFacetTag = { slug: string; label: string; facetKey: string };

/**
 * İşletme detayında / vitrin kartında gösterilecek öne çıkan çipler.
 * Kaynak: `business.attributes` slug'ları.
 * Sıralama: önce ortak facet'ler, sonra grup facet'leri; aynı facet içinde admin sırası korunur.
 */
export function featuredFacetTags(
  business: Pick<Business, "group" | "attributes">,
  limit = 6
): FeaturedFacetTag[] {
  const attrs = business.attributes ?? [];
  const visibleFacetKeys = new Set(visibleFacets([business.group]).map((f) => f.key));
  const seen = new Set<string>();
  const tags = attrs.flatMap((slug, index) => {
    const facetKey = SLUG_TO_FACET[slug];
    if (!facetKey || !visibleFacetKeys.has(facetKey) || seen.has(slug)) return [];
    seen.add(slug);
    return [{
      slug,
      label: SLUG_TO_LABEL[slug] ?? slug,
      facetKey,
      facetOrder: FACET_ORDER[facetKey] ?? Number.MAX_SAFE_INTEGER,
      index,
    }];
  });

  return tags
    .sort((a, b) => a.facetOrder - b.facetOrder || a.index - b.index)
    .slice(0, limit)
    .map(({ slug, label, facetKey }) => ({ slug, label, facetKey }));
}

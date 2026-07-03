import type { GroupKey, Facet, FacetOption } from "./types";

/* Filtreleme motoru — facet (öznitelik) kayıt defteri.
   Tüm çok-seçim facet'ler `business.attributes` slug'ları üzerinden çalışır.
   Mantık: facet İÇİNDE "VEYA", facet'ler ARASINDA "VE" (klasik faceted search).
   scope: "common" → her kategoride görünür; GroupKey[] → ilgili grup seçiliyse görünür. */

export const FACETS: Facet[] = [
  // ——— ORTAK (ticari) — projenin asıl ayrıştırıcısı ———
  {
    key: "vade", label: "Ödeme / vade", scope: "common",
    options: [
      { slug: "pesin", label: "Peşin" },
      { slug: "vadeli", label: "Vadeli" },
      { slug: "cari-hesap", label: "Cari hesap" },
    ],
  },
  {
    key: "kontenjan", label: "Kontenjan modeli", scope: "common",
    options: [
      { slug: "garanti-kontenjan", label: "Garanti kontenjan" },
      { slug: "allotment", label: "Allotment" },
      { slug: "talep-uzerine", label: "Talep üzerine" },
    ],
  },
  {
    key: "calisma", label: "Çalışma şekli", scope: "common",
    options: [
      { slug: "komisyonlu", label: "Komisyonlu" },
      { slug: "esnek-iptal", label: "Esnek iptal" },
      { slug: "anlik-kontenjan", label: "Anlık kontenjan (online)" },
    ],
  },
  {
    key: "para", label: "Para birimi", scope: "common",
    options: [
      { slug: "para-try", label: "₺ TRY" },
      { slug: "para-eur", label: "€ EUR" },
      { slug: "para-usd", label: "$ USD" },
    ],
  },

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
    key: "belge", label: "İşletme belgesi", scope: ["acente"],
    options: [
      { slug: "a-grubu", label: "A grubu" },
      { slug: "b-grubu", label: "B grubu" },
      { slug: "c-grubu", label: "C grubu" },
    ],
  },
  {
    key: "pazar", label: "Çalışılan pazar", scope: ["acente"],
    options: [
      { slug: "pazar-avrupa", label: "Avrupa" },
      { slug: "pazar-rusya-bdt", label: "Rusya / BDT" },
      { slug: "pazar-ortadogu", label: "Orta Doğu" },
      { slug: "pazar-uzakdogu", label: "Uzak Doğu" },
    ],
  },
  {
    key: "uzmanlik-acente", label: "Uzmanlık", scope: ["acente"],
    options: [
      { slug: "kultur-turu", label: "Kültür turu" },
      { slug: "mice", label: "MICE" },
      { slug: "mavi-yolculuk", label: "Mavi yolculuk" },
      { slug: "okul-gezisi", label: "Okul gezisi" },
    ],
  },

  // ——— REHBER ———
  {
    key: "uzmanlik-rehber", label: "Uzmanlık", scope: ["rehber"],
    options: [
      { slug: "uz-tarihi", label: "Tarihi / arkeoloji" },
      { slug: "uz-doga", label: "Doğa / trekking" },
      { slug: "uz-kruvaziyer", label: "Kruvaziyer" },
      { slug: "uz-muze", label: "Müze" },
    ],
  },

  // ——— ULAŞIM ———
  {
    key: "tasima-belge", label: "Taşıma belgesi", scope: ["ulasim"],
    options: [
      { slug: "d2-belgesi", label: "D2 belgesi" },
      { slug: "kabis-kaydi", label: "KABİS kaydı" },
      { slug: "yetkili-transfer", label: "Yetkili transfer" },
    ],
  },
  {
    key: "arac-tipi", label: "Araç tipi", scope: ["ulasim"],
    options: [
      { slug: "vip-arac", label: "VIP araç" },
      { slug: "minibus", label: "Minibüs" },
      { slug: "otobus", label: "Otobüs" },
      { slug: "rent-a-car", label: "Rent A Car" },
    ],
  },

  // ——— AKTİVİTE & DENEYİM ———
  {
    key: "lisans", label: "Lisans / güvenlik", scope: ["aktivite"],
    options: [{ slug: "lisansli", label: "Lisanslı işletme" }],
  },
  {
    key: "aktivite-satis", label: "Satış modeli", scope: ["aktivite"],
    options: [
      { slug: "blok-satis", label: "Blok satış" },
      { slug: "gunluk-operasyon", label: "Günlük operasyon" },
      { slug: "acente-paneli", label: "Acente paneli" },
    ],
  },

  // ——— SAĞLIK ———
  {
    key: "akreditasyon", label: "Akreditasyon", scope: ["saglik"],
    options: [
      { slug: "jci", label: "JCI" },
      { slug: "iso", label: "ISO" },
    ],
  },
  {
    key: "paket", label: "Paket", scope: ["saglik"],
    options: [
      { slug: "paket-konaklama-transfer", label: "Konaklama + transfer dahil" },
      { slug: "refakat-tercuman", label: "Refakat / tercüman" },
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
for (const f of FACETS) {
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

import type { CategoryGroup, GroupKey } from "./types";
import { groupPalette } from "@/theme";

/* Hiyerarşik kategori taksonomisi — sol kenar kataloğunu besler.
   Ana başlık (group) → alt tür (leaf). İleride DB'de self-referencing tablo olacak.

   slug = dilden bağımsız İngilizce kanonik kimlik (URL + çeviri anahtarı).
   label = DB'de business.type olarak saklanan Türkçe kanonik değer (legacy uyum).
   Görünen metin daima slug üzerinden i18n'den gelir (bkz. service namespace). */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "konaklama",
    label: "Konaklama",
    children: [
      { slug: "resort", label: "Resort / Tatil Köyü", section: "Otel" },
      { slug: "city-hotel", label: "Şehir Oteli", section: "Otel" },
      { slug: "boutique-hotel", label: "Butik Otel", section: "Otel" },
      { slug: "apart-hotel", label: "Apart Otel", section: "Otel" },
      { slug: "thermal-spa", label: "Termal / Spa", section: "Otel" },
      { slug: "historic-mansion", label: "Tarihi Konak / Pansiyon", section: "Otel" },
      { slug: "bungalow-lodge", label: "Bungalov & Dağ Evi", section: "Alternatif Konaklama" },
      { slug: "villa", label: "Villa", section: "Alternatif Konaklama" },
      { slug: "camping-glamping", label: "Kamp & Glamping", section: "Alternatif Konaklama" },
      { slug: "tiny-house", label: "Tiny House", section: "Alternatif Konaklama" },
      { slug: "vineyard-house", label: "Bağ Evi", section: "Alternatif Konaklama" },
    ],
  },
  {
    key: "acente",
    label: "Seyahat Acentesi",
    children: [
      { slug: "dmc", label: "DMC" },
      { slug: "incoming", label: "Incoming" },
      { slug: "outgoing", label: "Outgoing" },
      { slug: "tour-operator", label: "Tur Operatörleri" },
      { slug: "b2b-wholesaler", label: "B2B Wholesaler" },
      { slug: "flight-tickets", label: "Uçak Bileti" },
      { slug: "mice", label: "MICE" },
      { slug: "health-tourism", label: "Sağlık Turizmi" },
    ],
  },
  {
    key: "ulasim",
    label: "Ulaşım",
    children: [
      { slug: "airport-transfer", label: "Havalimanı Transfer" },
      { slug: "intercity-transfer", label: "Şehirlerarası Transfer" },
      { slug: "vip-transfer", label: "VIP / Lüks Transfer" },
      { slug: "car-rental", label: "Rent A Car" },
    ],
  },
  {
    key: "rehber",
    label: "Rehberlik",
    children: [
      { slug: "culture-archaeology", label: "Kültür ve Arkeoloji", section: "Uzmanlık Alanları" },
      { slug: "gastronomy-guide", label: "Gastronomi", section: "Uzmanlık Alanları" },
      { slug: "nature-adventure-trekking", label: "Doğa, Macera & Trekking", section: "Uzmanlık Alanları" },
      { slug: "faith-mythology", label: "İnanç & Mitoloji", section: "Uzmanlık Alanları" },
      { slug: "lifestyle", label: "Lifestyle", section: "Uzmanlık Alanları" },
      { slug: "package-tour", label: "Paket Tur", section: "Hizmet Verme Şekilleri" },
      { slug: "private-tour", label: "Münferit", section: "Hizmet Verme Şekilleri" },
      { slug: "day-tour", label: "Günübirlik", section: "Hizmet Verme Şekilleri" },
      { slug: "mice-guide", label: "MICE", section: "Hizmet Verme Şekilleri" },
    ],
  },
  {
    key: "gastronomi",
    label: "Gastronomi",
    children: [
      { slug: "restaurant", label: "Restoranlar" },
      { slug: "gourmet-experience", label: "Gurme Deneyim Alanları" },
      { slug: "local-food", label: "Yerel Lezzet Noktaları" },
    ],
  },
  {
    key: "saglik",
    label: "Sağlık",
    children: [
      { slug: "hair-transplant", label: "Saç Ekimi ve Estetik", section: "Klinikler" },
      { slug: "dermatology", label: "Dermatoloji", section: "Klinikler" },
      { slug: "plastic-surgery", label: "Plastik / Estetik Cerrahi", section: "Klinikler" },
      { slug: "dental", label: "Diş Sağlığı", section: "Klinikler" },
      { slug: "eye-health", label: "Göz Sağlığı", section: "Klinikler" },
      { slug: "general-surgery", label: "Genel Cerrahi", section: "Klinikler" },
      { slug: "hospital", label: "Hastane", section: "Hastane" },
    ],
  },
  {
    key: "aktivite",
    label: "Aktivite & Entertainment",
    children: [
      { slug: "outdoor-nature-adventure", label: "Outdoor, Doğa, Macera" },
      { slug: "arts-culture-entertainment", label: "Kültür Sanat Eğlence" },
      { slug: "theme-parks", label: "Tematik Parklar" },
      { slug: "workshops-local-experiences", label: "Atölyeler ve Yerel Deneyimler" },
    ],
  },
];

export const GROUP_COLORS: Record<GroupKey, string> = groupPalette;

export function groupLabel(key: GroupKey): string {
  return CATEGORY_GROUPS.find((g) => g.key === key)?.label ?? key;
}

/* Grup anahtarı (DB/internal, Türkçe kökenli) ↔ URL slug (İngilizce, dilden bağımsız).
   Internal GroupKey ve DB business.group Türkçe kalır; yalnızca URL'de İngilizce görünür
   (bkz. explore-filters URL sınırı). Görünen ad zaten `cat` namespace'inden çevrilir. */
export const GROUP_URL_SLUGS: Record<GroupKey, string> = {
  konaklama: "accommodation",
  acente: "agency",
  ulasim: "transport",
  rehber: "guide",
  gastronomi: "gastronomy",
  saglik: "health",
  aktivite: "activities",
};
const GROUP_KEY_BY_URL_SLUG = new Map(
  (Object.entries(GROUP_URL_SLUGS) as [GroupKey, string][]).map(([key, slug]) => [slug, key]),
);

/** Grup anahtarını URL slug'ına çevirir (accommodation). */
export function groupUrlSlug(key: GroupKey): string {
  return GROUP_URL_SLUGS[key] ?? key;
}

/** URL token'ından grup anahtarı: yeni İngilizce slug veya eski Türkçe key (geriye uyum). */
export function groupKeyFromUrl(token: string): GroupKey | null {
  const bySlug = GROUP_KEY_BY_URL_SLUG.get(token);
  if (bySlug) return bySlug;
  return token in GROUP_URL_SLUGS ? (token as GroupKey) : null;
}

/* Eski (Türkçe kökenli) leaf slug → yeni İngilizce slug. DB'de business_services,
   profiles.service_slugs/category_slug eski slug'ları tuttuğu için gösterim/çözümleme
   bu alias'tan geçer. DB migrate edildikten sonra (sonraki aşama) kaldırılabilir. */
const SLUG_ALIASES: Record<string, string> = {
  "sehir-oteli": "city-hotel",
  "butik-otel": "boutique-hotel",
  "apart-otel": "apart-hotel",
  "termal-spa": "thermal-spa",
  "tarihi-konak": "historic-mansion",
  "bungalov-dag-evi": "bungalow-lodge",
  "kamp-glamping": "camping-glamping",
  "bag-evi": "vineyard-house",
  "tur-operatoru": "tour-operator",
  "ucak-bileti": "flight-tickets",
  "saglik-turizmi": "health-tourism",
  "havalimani-transfer": "airport-transfer",
  "sehirlerarasi-transfer": "intercity-transfer",
  "rent-a-car": "car-rental",
  "kultur-arkeoloji": "culture-archaeology",
  "rehber-gastronomi": "gastronomy-guide",
  "doga-macera-trekking": "nature-adventure-trekking",
  "inanc-mitoloji": "faith-mythology",
  "paket-tur": "package-tour",
  "munferit": "private-tour",
  "gunubirlik": "day-tour",
  "rehber-mice": "mice-guide",
  "restoran": "restaurant",
  "gurme-deneyim": "gourmet-experience",
  "yerel-lezzet": "local-food",
  "sac-ekimi-estetik": "hair-transplant",
  "dermatoloji": "dermatology",
  "plastik-estetik-cerrahi": "plastic-surgery",
  "dis-sagligi": "dental",
  "goz-sagligi": "eye-health",
  "genel-cerrahi": "general-surgery",
  "hastane": "hospital",
  "outdoor-doga-macera": "outdoor-nature-adventure",
  "kultur-sanat-eglence": "arts-culture-entertainment",
  "tematik-parklar": "theme-parks",
  "atolye-yerel-deneyim": "workshops-local-experiences",
};

/** Eski slug'ı güncel kanonik slug'a çevirir (zaten güncelse aynen döner). */
export function canonicalServiceSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

/* slug ↔ leaf çözümleme — çoklu-seçim (business_services) slug tuttuğu için
   gösterimde ve doğrulamada kullanılır. */
const LEAF_BY_SLUG = new Map(
  CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => [child.slug, { ...child, group: group.key }] as const)),
);
const LEAF_SLUG_BY_LABEL = new Map(
  CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => [child.label, child.slug] as const)),
);

/** Alt kategori slug'ından etiket; bulunamazsa slug'ın kendisi döner. */
export function serviceLabel(slug: string): string {
  return LEAF_BY_SLUG.get(canonicalServiceSlug(slug))?.label ?? slug;
}

/** Alt kategori slug'ı (eski/yeni) veya kayıtlı Türkçe etiketinden i18n anahtarını çözer. */
export function serviceTranslationKey(value: string): string | null {
  const canonical = canonicalServiceSlug(value);
  if (LEAF_BY_SLUG.has(canonical)) return canonical;
  return LEAF_SLUG_BY_LABEL.get(value) ?? null;
}

/** Slug geçerli mi ve verilen gruba ait mi? */
export function isServiceOfGroup(slug: string, group: GroupKey): boolean {
  return LEAF_BY_SLUG.get(canonicalServiceSlug(slug))?.group === group;
}

/** Bir grubun geçerli alt kategori slug kümesi. */
export function groupServiceSlugs(group: GroupKey): Set<string> {
  return new Set(CATEGORY_GROUPS.find((g) => g.key === group)?.children.map((c) => c.slug) ?? []);
}

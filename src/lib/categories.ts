import type { CategoryGroup, GroupKey } from "./types";
import { groupPalette } from "@/theme";

/* Hiyerarşik kategori taksonomisi — sol kenar kataloğunu besler.
   Ana başlık (group) → alt tür (leaf). İleride DB'de self-referencing tablo olacak. */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "konaklama",
    label: "Konaklama",
    children: [
      { slug: "resort", label: "Resort / Tatil Köyü", section: "Otel" },
      { slug: "sehir-oteli", label: "Şehir Oteli", section: "Otel" },
      { slug: "butik-otel", label: "Butik Otel", section: "Otel" },
      { slug: "apart-otel", label: "Apart Otel", section: "Otel" },
      { slug: "termal-spa", label: "Termal / Spa", section: "Otel" },
      { slug: "tarihi-konak", label: "Tarihi Konak / Pansiyon", section: "Otel" },
      { slug: "bungalov-dag-evi", label: "Bungalov & Dağ Evi", section: "Alternatif Konaklama" },
      { slug: "villa", label: "Villa", section: "Alternatif Konaklama" },
      { slug: "kamp-glamping", label: "Kamp & Glamping", section: "Alternatif Konaklama" },
      { slug: "tiny-house", label: "Tiny House", section: "Alternatif Konaklama" },
      { slug: "bag-evi", label: "Bağ Evi", section: "Alternatif Konaklama" },
    ],
  },
  {
    key: "acente",
    label: "Seyahat Acentesi",
    children: [
      { slug: "dmc", label: "DMC" },
      { slug: "incoming", label: "Incoming" },
      { slug: "outgoing", label: "Outgoing" },
      { slug: "tur-operatoru", label: "Tur Operatörleri" },
      { slug: "b2b-wholesaler", label: "B2B Wholesaler" },
      { slug: "ucak-bileti", label: "Uçak Bileti" },
      { slug: "mice", label: "MICE" },
      { slug: "saglik-turizmi", label: "Sağlık Turizmi" },
    ],
  },
  {
    key: "ulasim",
    label: "Ulaşım",
    children: [
      { slug: "havalimani-transfer", label: "Havalimanı Transfer" },
      { slug: "sehirlerarasi-transfer", label: "Şehirlerarası Transfer" },
      { slug: "vip-transfer", label: "VIP / Lüks Transfer" },
      { slug: "rent-a-car", label: "Rent A Car" },
    ],
  },
  {
    key: "rehber",
    label: "Rehberlik",
    children: [
      { slug: "kultur-arkeoloji", label: "Kültür ve Arkeoloji", section: "Uzmanlık Alanları" },
      { slug: "rehber-gastronomi", label: "Gastronomi", section: "Uzmanlık Alanları" },
      { slug: "doga-macera-trekking", label: "Doğa, Macera & Trekking", section: "Uzmanlık Alanları" },
      { slug: "inanc-mitoloji", label: "İnanç & Mitoloji", section: "Uzmanlık Alanları" },
      { slug: "lifestyle", label: "Lifestyle", section: "Uzmanlık Alanları" },
      { slug: "paket-tur", label: "Paket Tur", section: "Hizmet Verme Şekilleri" },
      { slug: "munferit", label: "Münferit", section: "Hizmet Verme Şekilleri" },
      { slug: "gunubirlik", label: "Günübirlik", section: "Hizmet Verme Şekilleri" },
      { slug: "rehber-mice", label: "MICE", section: "Hizmet Verme Şekilleri" },
    ],
  },
  {
    key: "gastronomi",
    label: "Gastronomi",
    children: [
      { slug: "restoran", label: "Restoranlar" },
      { slug: "gurme-deneyim", label: "Gurme Deneyim Alanları" },
      { slug: "yerel-lezzet", label: "Yerel Lezzet Noktaları" },
    ],
  },
  {
    key: "saglik",
    label: "Sağlık",
    children: [
      { slug: "sac-ekimi-estetik", label: "Saç Ekimi ve Estetik", section: "Klinikler" },
      { slug: "dermatoloji", label: "Dermatoloji", section: "Klinikler" },
      { slug: "plastik-estetik-cerrahi", label: "Plastik / Estetik Cerrahi", section: "Klinikler" },
      { slug: "dis-sagligi", label: "Diş Sağlığı", section: "Klinikler" },
      { slug: "goz-sagligi", label: "Göz Sağlığı", section: "Klinikler" },
      { slug: "genel-cerrahi", label: "Genel Cerrahi", section: "Klinikler" },
      { slug: "hastane", label: "Hastane", section: "Hastane" },
    ],
  },
  {
    key: "aktivite",
    label: "Aktivite & Entertainment",
    children: [
      { slug: "outdoor-doga-macera", label: "Outdoor, Doğa, Macera" },
      { slug: "kultur-sanat-eglence", label: "Kültür Sanat Eğlence" },
      { slug: "tematik-parklar", label: "Tematik Parklar" },
      { slug: "atolye-yerel-deneyim", label: "Atölyeler ve Yerel Deneyimler" },
    ],
  },
];

export const GROUP_COLORS: Record<GroupKey, string> = groupPalette;

export function groupLabel(key: GroupKey): string {
  return CATEGORY_GROUPS.find((g) => g.key === key)?.label ?? key;
}

/* slug ↔ leaf çözümleme — çoklu-seçim (business_services) slug tuttuğu için
   gösterimde ve doğrulamada kullanılır. */
const LEAF_BY_SLUG = new Map(
  CATEGORY_GROUPS.flatMap((group) => group.children.map((child) => [child.slug, { ...child, group: group.key }] as const)),
);

/** Alt kategori slug'ından etiket; bulunamazsa slug'ın kendisi döner. */
export function serviceLabel(slug: string): string {
  return LEAF_BY_SLUG.get(slug)?.label ?? slug;
}

/** Slug geçerli mi ve verilen gruba ait mi? */
export function isServiceOfGroup(slug: string, group: GroupKey): boolean {
  return LEAF_BY_SLUG.get(slug)?.group === group;
}

/** Bir grubun geçerli alt kategori slug kümesi. */
export function groupServiceSlugs(group: GroupKey): Set<string> {
  return new Set(CATEGORY_GROUPS.find((g) => g.key === group)?.children.map((c) => c.slug) ?? []);
}

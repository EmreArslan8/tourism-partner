import type { CategoryGroup, GroupKey } from "./types";
import { groupPalette } from "@/theme";

/* Hiyerarşik kategori taksonomisi — sol kenar kataloğunu besler.
   Ana başlık (group) → alt tür (leaf). İleride DB'de self-referencing tablo olacak. */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "konaklama",
    label: "Konaklama",
    children: [
      { slug: "otel", label: "Otel" },
      { slug: "resort", label: "Resort" },
      { slug: "butik-otel", label: "Butik Otel" },
      { slug: "bungalov", label: "Bungalov" },
      { slug: "villa", label: "Villa" },
    ],
  },
  {
    key: "acente",
    label: "Acente & Tur",
    children: [
      { slug: "seyahat-acentesi", label: "Seyahat Acentesi" },
      { slug: "tur-firmasi", label: "Tur Firması" },
      { slug: "dmc", label: "DMC" },
    ],
  },
  {
    key: "rehber",
    label: "Rehberlik",
    children: [{ slug: "tur-rehberi", label: "Tur Rehberi" }],
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
    key: "aktivite",
    label: "Aktivite & Deneyim",
    children: [
      { slug: "balon-turu", label: "Balon Turu" },
      { slug: "tekne-yat", label: "Tekne / Yat" },
      { slug: "adrenalin-sporlari", label: "Adrenalin Sporları" },
      { slug: "binicilik", label: "Binicilik" },
    ],
  },
  {
    key: "saglik",
    label: "Sağlık Turizmi",
    children: [
      { slug: "hastane", label: "Hastane" },
      { slug: "sac-klinigi", label: "Saç Kliniği" },
      { slug: "dis-klinigi", label: "Diş Kliniği" },
    ],
  },
  {
    key: "gastronomi",
    label: "Gastronomi",
    children: [
      { slug: "restoran", label: "Restoran" },
      { slug: "gurme-deneyim", label: "Gurme Deneyim" },
      { slug: "yerel-lezzet-noktasi", label: "Yerel Lezzet Noktası" },
    ],
  },
];

export const GROUP_COLORS: Record<GroupKey, string> = groupPalette;

export function groupLabel(key: GroupKey): string {
  return CATEGORY_GROUPS.find((g) => g.key === key)?.label ?? key;
}

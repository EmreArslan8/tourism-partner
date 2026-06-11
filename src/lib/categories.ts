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
    key: "eglence",
    label: "Eğlence",
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
];

export const GROUP_COLORS: Record<GroupKey, string> = groupPalette;

/** İşletmenin kendi görseli yoksa kart kapağında kullanılan gruba özel
    varsayılan stok görsel (public/assets/cards/). */
export const GROUP_COVER: Record<GroupKey, string> = {
  konaklama: "/assets/cards/hotel-1.jpg",
  acente: "/assets/cards/agency-1.jpg",
  rehber: "/assets/cards/guide-1.jpg",
  eglence: "/assets/cards/balloon-1.jpg",
  saglik: "/assets/cards/clinic-1.jpg",
};

export function groupLabel(key: GroupKey): string {
  return CATEGORY_GROUPS.find((g) => g.key === key)?.label ?? key;
}

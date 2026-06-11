/* Ortak tip tanımları — Faz 1 (seed veri). İleride Supabase şemasıyla eşlenecek. */

export type GroupKey = "konaklama" | "acente" | "rehber" | "eglence" | "saglik";

export interface CategoryNode {
  slug: string;
  label: string;
}

export interface CategoryGroup {
  key: GroupKey;
  label: string;
  children: CategoryNode[];
}

export interface Business {
  id: number;
  group: GroupKey;
  /** Alt kategori / tür etiketi, ör. "Otel", "Villa", "Diş Kliniği" */
  type: string;
  name: string;
  country: string;
  city: string;
  district: string;
  coords: [number, number];
  desc: string;
  rating: number;
  reviews: number;
  tag: string;
  verified: boolean;
  /** Landing vitrininde reklam olarak gösterilsin mi (bizim seçimimiz) */
  sponsored: boolean;
  /** Kart kapak görseli (public/ altı yol). Yoksa gruba göre varsayılan kullanılır. */
  image?: string;
}

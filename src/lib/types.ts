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
  /** Filtreleme facet slug'ları (hizmet/özellik/ticari şartlar). Bkz. lib/facets.ts */
  attributes?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
}

// --- Facet Types ---
export type FacetOption = { slug: string; label: string };
export type Facet = {
  key: string;
  label: string;
  scope: "common" | GroupKey[];
  options: FacetOption[];
};

// --- Listing & Filter Types ---
export type Sort = "featured" | "rating" | "az";

export interface ListingFilters {
  groups: Set<GroupKey>;
  types: Set<string>;
  country: string;
  city: string;
  district: string;
  verifiedOnly: boolean;
  minRating: number;
  attrs: Set<string>;
}

// --- Action Types ---
export type ActionState = { ok: boolean; error?: string };

// --- Admin Types ---
export type AdminBusiness = Business & {
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
};

export type AdminApplication = {
  id: number;
  name: string;
  email: string;
  group: GroupKey | null;
  categoryLabel: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type AdminQuote = {
  id: number;
  businessId: number | null;
  name: string;
  company: string | null;
  email: string;
  service: string | null;
  dateRange: string | null;
  people: number | null;
  message: string | null;
  status: string;
  internalNote: string | null;
  createdAt: string;
};

export type ContentPage = {
  id: number;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  canonicalPath: string | null;
  ogImage: string | null;
  status: "draft" | "published" | "archived";
  updatedAt: string;
};

export type AdminData = {
  mode: "supabase" | "demo";
  userEmail?: string;
  isAdmin: boolean;
  businesses: AdminBusiness[];
  applications: AdminApplication[];
  quotes: AdminQuote[];
  pages: ContentPage[];
};

/* Ortak tip tanımları — Faz 1 (seed veri). İleride Supabase şemasıyla eşlenecek. */

export type GroupKey = "konaklama" | "acente" | "ulasim" | "rehber" | "aktivite" | "saglik" | "gastronomi";
export type BusinessLegalType = "company" | "individual";

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
  legalType?: BusinessLegalType;
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
  /** Premium Partner dopingi: ücretli, kalıcı öne çıkarma (admin kontrollü). */
  sponsored: boolean;
  /** Doping bitiş zamanı (ISO). Gelecekteyse işletme "öne çıkan" sayılır.
      Yeni işletme onaylandığında otomatik 24 saatlik hoş geldin dopingi de bunu kullanır. */
  dopingUntil?: string;
  /** Kurum (firma) iletişim — YALNIZCA detay sayfasında gösterilir (Brief §6A).
      Liste/istemci payload'ına gönderilmez (bkz. toListingBusiness) — aksi halde
      telefonlar listeden toplu kazınabilir. Yetkili kişi bilgisi ASLA buraya konmaz. */
  phone?: string;
  website?: string;
  /** Sunucuda önceden hesaplanan profil doluluk skoru (0–8). Liste payload'ında
      phone/website çıkarıldığı için skor sunucuda hesaplanıp taşınır. */
  completeness?: number;
  /** Kart kapak görseli (public/ altı yol). Yoksa gruba göre varsayılan kullanılır. */
  image?: string;
  /** İşletmenin kendi galeri görselleri. */
  images?: string[];
  /** Filtreleme facet slug'ları (hizmet/özellik/ticari şartlar). Bkz. lib/facets.ts */
  attributes?: string[];
  /** Rehber çalışma bölgeleri (şehir adları) — acente araması bu şehirlerle de eşleşir.
      Yalnızca rehber kategorisinde dolu; details.work_regions'tan türetilir. */
  workRegions?: string[];
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
  minRating: number;
  attrs: Set<string>;
}

// --- Action Types ---
export type ActionState = { ok: boolean; error?: string };

export type BusinessDocument = {
  kind: string;
  name: string;
  /** Permanent private storage path for new document records. */
  path?: string;
  /** Signed URL for display, or legacy public URL. Not stored as the canonical value. */
  url?: string;
};

// --- Admin Types ---
export type BusinessLifecycleStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "expired"
  | "blacklisted"
  | "suspended";

export type AdminBusiness = Business & {
  status: BusinessLifecycleStatus;
  createdAt?: string;
  /** Onay incelemesi için: panelde yüklenen evraklar + dinamik alanlar. */
  documents?: BusinessDocument[];
  details?: Record<string, string>;
};

export type AdminApplicationDoc = {
  /** Belge etiketi, ör. "TÜRSAB Belgesi" */
  label: string;
  /** Yüklendi mi; false ise kartta "Eksik" olarak kırmızı gösterilir. */
  uploaded: boolean;
  /** Yüklü belgenin görüntüleme URL'i (varsa) */
  url?: string;
};

export type AdminApplication = {
  id: number;
  name: string;
  email: string;
  group: GroupKey | null;
  categoryLabel: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  /** Aşağıdakiler opsiyoneldir — applications tablosu henüz tutmuyorsa boş geçilir,
      kart bu alanları yalnızca veri varsa gösterir. */
  contactPerson?: string;
  phone?: string;
  address?: string;
  documents?: AdminApplicationDoc[];
};

export type AdminQuote = {
  id: number;
  businessId: number | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  categoryGroup: string | null;
  categoryType: string | null;
  country: string | null;
  city: string | null;
  district: string | null;
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

export type AdminMembership = {
  id: number;
  businessId: number;
  plan: string;
  status: "trial" | "active" | "expired" | "cancelled";
  startsAt: string;
  endsAt: string;
};

export type AdminPageView = {
  id: number;
  entityType: string;
  entityId: number | null;
  visitorId: string | null;
  viewedAt: string;
};

export type AdminSystemBackup = {
  id: number;
  status: "pending" | "running" | "completed" | "failed";
  completedAt: string | null;
  createdAt: string;
};

export type AdminAuditLog = {
  id: number;
  adminId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type AdminData = {
  mode: "supabase" | "demo";
  userEmail?: string;
  isAdmin: boolean;
  businesses: AdminBusiness[];
  applications: AdminApplication[];
  quotes: AdminQuote[];
  pages: ContentPage[];
  memberships: AdminMembership[];
  pageViews: AdminPageView[];
  lastBackup: AdminSystemBackup | null;
  auditLogs: AdminAuditLog[];
};

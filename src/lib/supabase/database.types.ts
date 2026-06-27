/* Supabase şema tipleri — TEK KAYNAK.
   supabase/schema.sql ile elle eşlendi. İdeal: `supabase gen types typescript`
   ile üretmek (proje linklendiğinde `npm run gen:types`). O güne kadar bu dosya
   şema değişikliklerinde elle güncellenmeli; Row tipleri uygulama genelinde
   buradan türetilir (bkz. lib/businesses.ts, lib/admin.ts). */

export type BusinessGroup = "konaklama" | "acente" | "rehber" | "eglence" | "saglik";
export type BusinessStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "expired"
  | "blacklisted"
  | "suspended";
export type ContentPageStatus = "draft" | "published" | "archived";

type Timestamp = string;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: string;
          created_at: Timestamp;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: string;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      businesses: {
        Row: {
          id: number;
          owner_id: string | null;
          group: BusinessGroup;
          type: string;
          name: string;
          country: string;
          city: string;
          district: string;
          lat: number | null;
          lng: number | null;
          description: string | null;
          rating: number;
          reviews: number;
          tag: string | null;
          verified: boolean;
          sponsored: boolean;
          image: string | null;
          images: string[];
          attributes: string[];
          phone: string | null;
          website: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          canonical_path: string | null;
          og_image: string | null;
          status: BusinessStatus;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          owner_id?: string | null;
          group: BusinessGroup;
          type: string;
          name: string;
          country: string;
          city: string;
          district: string;
          lat?: number | null;
          lng?: number | null;
          description?: string | null;
          rating?: number;
          reviews?: number;
          tag?: string | null;
          verified?: boolean;
          sponsored?: boolean;
          image?: string | null;
          images?: string[];
          attributes?: string[];
          phone?: string | null;
          website?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[];
          canonical_path?: string | null;
          og_image?: string | null;
          status?: BusinessStatus;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
        Relationships: [];
      };
      quotes: {
        Row: {
          id: number;
          business_id: number | null;
          name: string;
          company: string | null;
          email: string;
          service: string | null;
          date_range: string | null;
          people: number | null;
          message: string | null;
          status: string;
          internal_note: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id?: number | null;
          name: string;
          company?: string | null;
          email: string;
          service?: string | null;
          date_range?: string | null;
          people?: number | null;
          message?: string | null;
          status?: string;
          internal_note?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: number;
          name: string;
          email: string;
          group: BusinessGroup | null;
          category_slug: string | null;
          category_label: string | null;
          status: BusinessStatus;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          group?: BusinessGroup | null;
          category_slug?: string | null;
          category_label?: string | null;
          status?: BusinessStatus;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];
      };
      content_pages: {
        Row: {
          id: number;
          slug: string;
          locale: string;
          title: string;
          excerpt: string | null;
          body: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          canonical_path: string | null;
          og_image: string | null;
          status: ContentPageStatus;
          updated_at: Timestamp;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          slug: string;
          locale?: string;
          title: string;
          excerpt?: string | null;
          body?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[];
          canonical_path?: string | null;
          og_image?: string | null;
          status?: ContentPageStatus;
          updated_at?: Timestamp;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["content_pages"]["Insert"]>;
        Relationships: [];
      };
      business_memberships: {
        Row: {
          id: number;
          business_id: number;
          plan: string;
          status: "trial" | "active" | "expired" | "cancelled";
          starts_at: Timestamp;
          ends_at: Timestamp;
          renewed_by_admin_id: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id: number;
          plan?: string;
          status?: "trial" | "active" | "expired" | "cancelled";
          starts_at?: Timestamp;
          ends_at: Timestamp;
          renewed_by_admin_id?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["business_memberships"]["Insert"]>;
        Relationships: [];
      };
      page_views: {
        Row: {
          id: number;
          entity_type: string;
          entity_id: number | null;
          visitor_id: string | null;
          ip_hash: string | null;
          user_agent: string | null;
          viewed_at: Timestamp;
        };
        Insert: {
          id?: number;
          entity_type: string;
          entity_id?: number | null;
          visitor_id?: string | null;
          ip_hash?: string | null;
          user_agent?: string | null;
          viewed_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["page_views"]["Insert"]>;
        Relationships: [];
      };
      system_backups: {
        Row: {
          id: number;
          status: "pending" | "running" | "completed" | "failed";
          storage_path: string | null;
          completed_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          status?: "pending" | "running" | "completed" | "failed";
          storage_path?: string | null;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["system_backups"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          admin_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          old_value: Record<string, unknown> | null;
          new_value: Record<string, unknown> | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          admin_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          old_value?: Record<string, unknown> | null;
          new_value?: Record<string, unknown> | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      business_group: BusinessGroup;
      business_status: BusinessStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

/* Kısayol Row tipleri — uygulama genelinde kullanılır. */
export type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
export type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type ContentPageRow = Database["public"]["Tables"]["content_pages"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

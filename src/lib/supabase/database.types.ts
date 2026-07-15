/* Supabase şema tipleri — TEK KAYNAK.
   supabase/schema.sql ile elle eşlendi. İdeal: `supabase gen types typescript`
   ile üretmek (proje linklendiğinde `npm run gen:types`). O güne kadar bu dosya
   şema değişikliklerinde elle güncellenmeli; Row tipleri uygulama genelinde
   buradan türetilir (bkz. lib/businesses.ts, lib/admin.ts). */

export type BusinessGroup = "konaklama" | "acente" | "ulasim" | "rehber" | "aktivite" | "saglik" | "gastronomi";
export type BusinessStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "expired"
  | "blacklisted"
  | "suspended";
export type ContentPageStatus = "draft" | "published" | "archived";
export type B2BRequestStatus = "pending" | "published" | "archived" | "rejected";
export type AdBannerStatus = "draft" | "active" | "paused" | "archived";
export type PopupFrequency = "always" | "daily" | "session";
export type SupportTicketStatus = "new" | "in_progress" | "resolved" | "archived";
export type BusinessPartnerRequestStatus = "pending" | "accepted" | "rejected";

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
          account_type: string;
          sector: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: string;
          account_type?: string;
          sector?: string | null;
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
          founder_partner: boolean;
          founder_partner_number: number | null;
          doping_until: Timestamp | null;
          image: string | null;
          images: string[];
          attributes: string[];
          details: Record<string, string>;
          documents: { kind: string; name: string; path?: string; url?: string }[];
          reject_reason: string | null;
          phone: string | null;
          website: string | null;
          socials: Record<string, string>;
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
          founder_partner?: boolean;
          founder_partner_number?: number | null;
          doping_until?: Timestamp | null;
          image?: string | null;
          images?: string[];
          attributes?: string[];
          details?: Record<string, string>;
          documents?: { kind: string; name: string; path?: string; url?: string }[];
          reject_reason?: string | null;
          phone?: string | null;
          website?: string | null;
          socials?: Record<string, string>;
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
      business_drafts: {
        Row: {
          id: string;
          user_id: string;
          draft_key: string;
          group: BusinessGroup;
          cover_image: string | null;
          gallery_images: string[];
          documents: { kind: string; name: string; path?: string; url?: string }[];
          updated_at: Timestamp;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          user_id: string;
          draft_key: string;
          group: BusinessGroup;
          cover_image?: string | null;
          gallery_images?: string[];
          documents?: { kind: string; name: string; path?: string; url?: string }[];
          updated_at?: Timestamp;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["business_drafts"]["Insert"]>;
        Relationships: [];
      };
      business_contacts: {
        Row: {
          id: number;
          business_id: number;
          full_name: string;
          title: string | null;
          phone: string | null;
          email: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id: number;
          full_name: string;
          title?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["business_contacts"]["Insert"]>;
        Relationships: [];
      };
      business_partners: {
        Row: {
          id: number;
          business_id: number;
          partner_business_id: number;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id: number;
          partner_business_id: number;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["business_partners"]["Insert"]>;
        Relationships: [];
      };
      business_services: {
        Row: {
          id: number;
          business_id: number;
          group_key: BusinessGroup;
          service_slug: string;
          is_primary: boolean;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id: number;
          group_key: BusinessGroup;
          service_slug: string;
          is_primary?: boolean;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["business_services"]["Insert"]>;
        Relationships: [];
      };
      business_partner_requests: {
        Row: {
          id: number;
          requester_business_id: number;
          receiver_business_id: number;
          status: BusinessPartnerRequestStatus;
          created_at: Timestamp;
          responded_at: Timestamp | null;
        };
        Insert: {
          id?: number;
          requester_business_id: number;
          receiver_business_id: number;
          status?: BusinessPartnerRequestStatus;
          created_at?: Timestamp;
          responded_at?: Timestamp | null;
        };
        Update: Partial<Database["public"]["Tables"]["business_partner_requests"]["Insert"]>;
        Relationships: [];
      };
      b2b_offers: {
        Row: {
          id: number;
          request_id: number;
          business_id: number;
          message: string;
          price: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          request_id: number;
          business_id: number;
          message: string;
          price?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["b2b_offers"]["Insert"]>;
        Relationships: [];
      };
      favorites: {
        Row: {
          id: number;
          user_id: string;
          business_id: number;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          user_id: string;
          business_id: number;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: number;
          business_id: number;
          author_id: string;
          author_business_id: number | null;
          rating: number;
          comment: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id: number;
          author_id: string;
          author_business_id?: number | null;
          rating: number;
          comment?: string | null;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      quotes: {
        Row: {
          id: number;
          business_id: number | null;
          requester_id: string | null;
          name: string;
          company: string | null;
          email: string;
          phone: string | null;
          service: string | null;
          category_group: string | null;
          category_type: string | null;
          country: string | null;
          city: string | null;
          district: string | null;
          date_range: string | null;
          valid_until: string | null;
          people: number | null;
          message: string | null;
          status: string;
          internal_note: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id?: number | null;
          requester_id?: string | null;
          name: string;
          company?: string | null;
          email: string;
          phone?: string | null;
          service?: string | null;
          category_group?: string | null;
          category_type?: string | null;
          country?: string | null;
          city?: string | null;
          district?: string | null;
          date_range?: string | null;
          valid_until?: string | null;
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
          reject_reason: string | null;
          contact_person: string | null;
          phone: string | null;
          address: string | null;
          documents: { label: string; uploaded: boolean; url?: string }[];
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
          reject_reason?: string | null;
          contact_person?: string | null;
          phone?: string | null;
          address?: string | null;
          documents?: { label: string; uploaded: boolean; url?: string }[];
          status?: BusinessStatus;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: number;
          parent_id: number | null;
          group_key: BusinessGroup;
          label: string;
          slug: string;
          sort_order: number;
          is_active: boolean;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: number;
          parent_id?: number | null;
          group_key: BusinessGroup;
          label: string;
          slug: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      b2b_requests: {
        Row: {
          id: number;
          business_id: number | null;
          title: string;
          description: string | null;
          region: string | null;
          target_group: BusinessGroup | null;
          target_types: string[];
          status: B2BRequestStatus;
          view_count: number;
          moderation_note: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: number;
          business_id?: number | null;
          title: string;
          description?: string | null;
          region?: string | null;
          target_group?: BusinessGroup | null;
          target_types?: string[];
          status?: B2BRequestStatus;
          view_count?: number;
          moderation_note?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["b2b_requests"]["Insert"]>;
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
      ad_banners: {
        Row: {
          id: number;
          title: string;
          image_url: string;
          target_url: string;
          placement: string;
          status: AdBannerStatus;
          starts_at: Timestamp | null;
          ends_at: Timestamp | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: number;
          title: string;
          image_url: string;
          target_url: string;
          placement?: string;
          status?: AdBannerStatus;
          starts_at?: Timestamp | null;
          ends_at?: Timestamp | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["ad_banners"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: number;
          locale: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body: string | null;
          category: string | null;
          cover_image: string | null;
          status: ContentPageStatus;
          seo_title: string | null;
          seo_description: string | null;
          published_at: Timestamp | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: number;
          locale?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          body?: string | null;
          category?: string | null;
          cover_image?: string | null;
          status?: ContentPageStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: Timestamp | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      admin_popups: {
        Row: {
          id: number;
          title: string;
          body: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_url: string | null;
          target_role: string;
          frequency: PopupFrequency;
          status: AdBannerStatus;
          starts_at: Timestamp | null;
          ends_at: Timestamp | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: number;
          title: string;
          body?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_url?: string | null;
          target_role?: string;
          frequency?: PopupFrequency;
          status?: AdBannerStatus;
          starts_at?: Timestamp | null;
          ends_at?: Timestamp | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["admin_popups"]["Insert"]>;
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: number;
          sender_name: string;
          sender_email: string | null;
          business_id: number | null;
          subject: string;
          message: string;
          status: SupportTicketStatus;
          assigned_admin_id: string | null;
          resolved_at: Timestamp | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: number;
          sender_name: string;
          sender_email?: string | null;
          business_id?: number | null;
          subject: string;
          message: string;
          status?: SupportTicketStatus;
          assigned_admin_id?: string | null;
          resolved_at?: Timestamp | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
        Relationships: [];
      };
      support_ticket_messages: {
        Row: {
          id: number;
          ticket_id: number;
          author_id: string | null;
          author_name: string | null;
          body: string;
          created_at: Timestamp;
        };
        Insert: {
          id?: number;
          ticket_id: number;
          author_id?: string | null;
          author_name?: string | null;
          body: string;
          created_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["support_ticket_messages"]["Insert"]>;
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
    Functions: {
      increment_b2b_view: {
        Args: { rid: number };
        Returns: undefined;
      };
    };
    Enums: {
      business_group: BusinessGroup;
      business_status: BusinessStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

/* Kısayol Row tipleri — uygulama genelinde kullanılır. */
export type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
export type BusinessContactRow = Database["public"]["Tables"]["business_contacts"]["Row"];
export type BusinessPartnerRow = Database["public"]["Tables"]["business_partners"]["Row"];
export type BusinessPartnerRequestRow = Database["public"]["Tables"]["business_partner_requests"]["Row"];
export type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type ContentPageRow = Database["public"]["Tables"]["content_pages"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type B2BRequestRow = Database["public"]["Tables"]["b2b_requests"]["Row"];
export type B2BOfferRow = Database["public"]["Tables"]["b2b_offers"]["Row"];
export type FavoriteRow = Database["public"]["Tables"]["favorites"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type AdBannerRow = Database["public"]["Tables"]["ad_banners"]["Row"];
export type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];
export type AdminPopupRow = Database["public"]["Tables"]["admin_popups"]["Row"];
export type SupportTicketRow = Database["public"]["Tables"]["support_tickets"]["Row"];

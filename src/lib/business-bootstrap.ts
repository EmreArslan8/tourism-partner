import type { SupabaseClient } from "@supabase/supabase-js";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { replaceBusinessServices } from "@/lib/business-services";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { businessSlug } from "@/lib/business-slug";
import type { GroupKey } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any, any, any>;

function groupFromMetadata(value: unknown): GroupKey {
  return typeof value === "string" && CATEGORY_GROUPS.some((group) => group.key === value)
    ? (value as GroupKey)
    : "konaklama";
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/*
 * Kayıt sırasında oturumsuz yüklenen kapak "signup-drafts/" altında durur. İşletme
 * oluşunca görseli kullanıcının kendi klasörüne taşır ki panelin sahiplik-kapsamlı
 * yol doğrulaması (cleanStoragePath: `${userId}/` şartı) onu kabul etsin — aksi halde
 * kullanıcı panelden ilk kaydında kapak silinirdi. Başarısızsa null döner (kapaksız
 * kalır, onboarding kapısı yakalar). Draft yolları kullanıcılar arası benzersiz (UUID),
 * karışma olmaz.
 */
export async function promoteSignupCover(
  userId: string,
  businessId: number,
  businessName: string,
  draftPath: string,
): Promise<string | null> {
  if (!draftPath.startsWith("signup-drafts/") || draftPath.includes("..")) return null;
  const admin = createAdminClient();
  if (!admin) return null;

  const ext = draftPath.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const slug = businessSlug({ name: businessName }) || `business-${businessId}`;
  const target = `${userId}/businesses/${businessId}-${slug}/cover/${crypto.randomUUID()}.${ext}`;

  const { error } = await admin.storage.from(BUSINESS_IMAGES_BUCKET).move(draftPath, target);
  if (error) return null;
  return target;
}

/*
 * E-posta doğrulaması açık olan tedarikçi kayıtlarında işletme kaydı signUp anında
 * oluşturulamaz (oturum yok). Kayıt adım 3'te toplanan profil auth metadata'sına yazılır;
 * bu fonksiyon doğrulama sonrası (callback) ilk kez çağrıldığında kaydı metadata'dan üretir.
 * İş idempotent: owner_id için zaten kayıt varsa hiçbir şey yapmaz.
 */
export async function ensureBusinessFromMetadata(
  supabase: Client,
  user: { id: string; user_metadata?: Record<string, unknown> | null },
): Promise<{ created: boolean; businessId?: number }> {
  const meta = user.user_metadata ?? {};
  // Yalnızca tedarikçi (listelenecek) kayıtta işletme oluşur; alıcıda kategori yok.
  const accountType = typeof meta.account_type === "string" ? meta.account_type : "supplier";
  if (accountType === "buyer") return { created: false };
  if (!meta.biz_group) return { created: false };

  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing?.id) return { created: false, businessId: existing.id };

  const group = groupFromMetadata(meta.biz_group);
  const name = str(meta.firm_name, 160) || str(meta.full_name, 160) || "—";
  const type = str(meta.biz_type, 80) || "—";
  const description = str(meta.biz_description, 2000);
  // Kayıt adım 3'te oturumsuz yüklenen kapak (bkz. /api/signup/cover). Public bucket
  // olduğu için draft yolu doğrudan kapak değeri olarak kullanılabilir.
  const coverRaw = str(meta.biz_cover, 400);
  const cover = coverRaw.startsWith("signup-drafts/") && !coverRaw.includes("..") ? coverRaw : "";

  const { data: created, error } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      group,
      type,
      name,
      country: str(meta.biz_country, 80),
      city: str(meta.biz_city, 80),
      district: str(meta.biz_district, 80),
      description: description || null,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !created?.id) return { created: false };

  // Kapağı kullanıcının klasörüne taşı ve işletmeye yaz (panel uyumlu yol).
  if (cover) {
    const finalPath = await promoteSignupCover(user.id, created.id, name, cover);
    if (finalPath) {
      await supabase.from("businesses").update({ image: finalPath }).eq("id", created.id).eq("owner_id", user.id);
    }
  }

  const serviceSlugs = Array.isArray(meta.service_slugs)
    ? (meta.service_slugs as unknown[]).filter((s): s is string => typeof s === "string")
    : [];
  if (serviceSlugs.length > 0) {
    await replaceBusinessServices(supabase, created.id, group, serviceSlugs);
  }

  const contact = meta.biz_contact && typeof meta.biz_contact === "object" ? (meta.biz_contact as Record<string, unknown>) : null;
  const contactName = str(contact?.name, 160);
  if (contactName) {
    await supabase.from("business_contacts").insert({
      business_id: created.id,
      full_name: contactName,
      phone: str(contact?.phone, 40) || null,
      email: str(contact?.email, 200) || null,
    });
  }

  return { created: true, businessId: created.id };
}

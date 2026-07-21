import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_IMAGES_BUCKET } from "@/lib/business-images";
import { businessSlug } from "@/lib/business-slug";

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

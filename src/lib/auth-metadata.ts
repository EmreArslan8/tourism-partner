import { createAdminClient } from "@/lib/supabase/admin";

/*
 * İşletme profilinin kalıcı yeri public.signup_intents / public.businesses'tır.
 * Bu alanlar yalnızca eski kayıt akışının emniyet ağı olarak Auth metadata'sına
 * yazılmıştı. Supabase user_metadata'yı access token'a koyduğu için burada
 * bırakılmaları JWT'yi ve dolayısıyla Cookie header'ını gereksiz büyütür.
 */
export const LEGACY_BUSINESS_METADATA_KEYS = [
  "biz_group",
  "biz_type",
  "category_slug",
  "service_slugs",
  "biz_country",
  "biz_city",
  "biz_district",
  "biz_address",
  "biz_description",
  "biz_phone",
  "biz_whatsapp",
  "biz_cover",
  "biz_contact",
] as const;

type Metadata = Record<string, unknown> | null | undefined;

export function hasLegacyBusinessMetadata(metadata: Metadata): boolean {
  if (!metadata) return false;
  return LEGACY_BUSINESS_METADATA_KEYS.some((key) => metadata[key] != null);
}

export type CompactAuthMetadataResult =
  | { ok: true; changed: boolean }
  | { ok: false; changed: false; error: string };

export type AuthMetadataWriteResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * signup_intents yazımı başarısız olursa işletme verisinin kaybolmaması için
 * kullanılan son emniyet ağı. Olağan kayıt akışında çağrılmaz.
 */
export async function preserveLegacyBusinessAuthMetadata(
  userId: string,
  metadata: Record<string, unknown>,
): Promise<AuthMetadataWriteResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service_role_unavailable" };

  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/**
 * Bilinen eski işletme alanlarını Auth metadata'sından siler; profil, sağlayıcı
 * ve Supabase'in kendi alanlarına dokunmaz. GoTrue metadata güncellemesinde null
 * değer ilgili anahtarı siler.
 */
export async function compactBusinessAuthMetadata(
  userId: string,
  knownMetadata?: Metadata,
): Promise<CompactAuthMetadataResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, changed: false, error: "service_role_unavailable" };

  let metadata = knownMetadata;
  if (metadata === undefined) {
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error) return { ok: false, changed: false, error: error.message };
    metadata = data.user?.user_metadata as Metadata;
  }

  if (!hasLegacyBusinessMetadata(metadata)) return { ok: true, changed: false };

  const removalPatch = Object.fromEntries(
    LEGACY_BUSINESS_METADATA_KEYS.map((key) => [key, null]),
  );
  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: removalPatch,
  });
  if (error) return { ok: false, changed: false, error: error.message };

  return { ok: true, changed: true };
}

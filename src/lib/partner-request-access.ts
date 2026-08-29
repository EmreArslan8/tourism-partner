import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function isPartnerRequestFeatureEnabled(
  supabase: SupabaseClient<Database>,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("platform_feature_flags")
    .select("enabled")
    .eq("key", "partner_requests")
    .maybeSingle();

  return !error && data?.enabled === true;
}

export async function hasPartnerRequestAccess(
  supabase: SupabaseClient<Database>,
  businessId: number,
): Promise<boolean> {
  if (!(await isPartnerRequestFeatureEnabled(supabase))) return false;

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("business_memberships")
    .select("id")
    .eq("business_id", businessId)
    .eq("status", "active")
    .lte("starts_at", now)
    .gte("ends_at", now)
    .limit(1)
    .maybeSingle();

  return !error && Boolean(data);
}

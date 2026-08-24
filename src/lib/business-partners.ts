import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { businessSlug } from "@/lib/business-slug";
import { PUBLIC_BUSINESS_STATUSES } from "@/lib/business-visibility";
import type { BusinessGroup } from "@/lib/supabase/database.types";

export type PublicBusinessPartner = {
  id: number;
  name: string;
  group: BusinessGroup;
  type: string;
  city: string;
  country: string;
  slug: string;
};

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isMissingPartnerRequestsTable(error: { code?: string }) {
  // PostgreSQL undefined_table veya PostgREST schema-cache table lookup hatası.
  return error.code === "42P01" || error.code === "PGRST205";
}

async function getBusinessPartnersCached(businessId: number): Promise<PublicBusinessPartner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("businesses");
  cacheTag("business-partners");

  if (!hasEnv()) return [];

  const supabase = createPublicClient();
  const { data: links, error: linkError } = await supabase
    .from("business_partner_requests")
    .select("requester_business_id,receiver_business_id")
    .eq("status", "accepted")
    .or(`requester_business_id.eq.${businessId},receiver_business_id.eq.${businessId}`)
    .order("created_at", { ascending: false });

  if (linkError) {
    if (isMissingPartnerRequestsTable(linkError)) return [];
    throw new Error(linkError.message);
  }

  const ids = [
    ...new Set(
      (links ?? [])
        .map((link) =>
          Number(link.requester_business_id) === businessId
            ? Number(link.receiver_business_id)
            : Number(link.requester_business_id),
        )
        .filter(Number.isFinite),
    ),
  ];
  if (ids.length === 0) return [];

  const { data: businesses, error: businessError } = await supabase
    .from("businesses")
    .select("id,name,group,type,city,country,status")
    .in("id", ids)
    .in("status", [...PUBLIC_BUSINESS_STATUSES]);

  if (businessError) {
    throw new Error(businessError.message);
  }

  const byId = new Map((businesses ?? []).map((business) => [Number(business.id), business]));
  return ids
    .map((id) => byId.get(id))
    .filter((business): business is NonNullable<typeof business> => Boolean(business))
    .map((business) => ({
      id: Number(business.id),
      name: business.name,
      group: business.group,
      type: business.type,
      city: business.city,
      country: business.country,
      slug: businessSlug({ name: business.name }),
    }));
}

export async function getBusinessPartners(businessId: number): Promise<PublicBusinessPartner[]> {
  try {
    return await getBusinessPartnersCached(businessId);
  } catch (error) {
    console.error("[business-partners] sorgu başarısız:", error);
    return [];
  }
}

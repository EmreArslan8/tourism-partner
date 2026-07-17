import { getAdminAccess } from "@/lib/admin-auth";
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import type { BusinessPartnerRequestStatus } from "@/lib/supabase/database.types";

export type AdminPartnerBusiness = {
  id: number;
  name: string;
  group: string;
  type: string;
  city: string;
};

export type AdminPartnerRequest = {
  id: number;
  requester: AdminPartnerBusiness;
  receiver: AdminPartnerBusiness;
  status: BusinessPartnerRequestStatus;
  createdAt: string;
  respondedAt: string | null;
};

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getAdminPartnerRequests(): Promise<AdminPartnerRequest[]> {
  if (!hasEnv()) return [];
  const access = await getAdminAccess();
  if (!access.isAdmin) return [];

  const supabase = await createClient();
  const { data: requests, error } = await supabase
    .from("business_partner_requests")
    .select("id,requester_business_id,receiver_business_id,status,created_at,responded_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);

  const ids = Array.from(new Set((requests ?? []).flatMap((row) => [Number(row.requester_business_id), Number(row.receiver_business_id)])));
  if (ids.length === 0) return [];

  const { data: businesses, error: businessError } = await supabase
    .from("businesses")
    .select("id,name,group,type,city")
    .in("id", ids);
  if (businessError) throw new Error(businessError.message);

  const businessById = new Map(
    (businesses ?? []).map((business) => [Number(business.id), {
      id: Number(business.id),
      name: business.name,
      group: business.group,
      type: business.type,
      city: business.city,
    }]),
  );

  return (requests ?? []).flatMap((row) => {
    const requester = businessById.get(Number(row.requester_business_id));
    const receiver = businessById.get(Number(row.receiver_business_id));
    if (!requester || !receiver) return [];
    return [{
      id: Number(row.id),
      requester,
      receiver,
      status: row.status,
      createdAt: row.created_at,
      respondedAt: row.responded_at,
    }];
  });
}

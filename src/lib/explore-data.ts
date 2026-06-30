import { createClient } from "@/lib/supabase/server";
import { getBusinesses } from "@/lib/businesses";
import { isDoped } from "@/lib/listing";
import type { Business } from "@/lib/types";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type ExploreData = {
  businesses: Business[];
  gated: boolean;
};

export async function getExploreData(): Promise<ExploreData> {
  const businessesPromise = getBusinesses();
  const gatedPromise = getExploreGated();
  const [businesses, gated] = await Promise.all([businessesPromise, gatedPromise]);

  return {
    gated,
    businesses: gated ? businesses.filter(isDoped) : businesses,
  };
}

async function getExploreGated(): Promise<boolean> {
  if (!hasEnv()) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !user;
}

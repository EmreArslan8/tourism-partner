import { createClient } from "@/lib/supabase/server";
import { getBusinesses } from "@/lib/businesses";
import { isDoped } from "@/lib/listing";
import type { Business } from "@/lib/types";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type ExploreData = {
  businesses: Business[];
  isGuest: boolean;
};

/* Keşfet verisi.
   Kural (müşteri güncellemesi 30.06): üye OLMAYAN kullanıcı filtreleme sonucunda
   yalnızca dopingli/premium işletmeleri görür; doping olmayanlar hiç listelenmez.
   Bu kısıt yalnızca toplu listeleme/filtreleme içindir — bir işletmenin
   /supplier/[slug] detay sayfası herkese açıktır (deep-link / SEO). */
export async function getExploreData(): Promise<ExploreData> {
  const [businesses, isGuest] = await Promise.all([getBusinesses(), getIsGuest()]);
  return {
    isGuest,
    businesses: isGuest ? businesses.filter(isDoped) : businesses,
  };
}

async function getIsGuest(): Promise<boolean> {
  if (!hasEnv()) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !user;
}

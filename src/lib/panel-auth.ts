import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { BusinessGroup } from "@/lib/supabase/database.types";

/* Tedarikçi paneli için tek veri kaynağı. React cache() ile request başına tek
   kez çalışır; layout + tüm panel sayfaları aynı sorguyu paylaşır (admin tarafın
   getAdminAccess deseniyle aynı). Böylece 7 ayrı auth.getUser() → 1'e iner. */

export type PanelBusinessLite = {
  id: number;
  name: string;
  group: BusinessGroup;
  type: string;
  city: string | null;
  country: string | null;
  district: string | null;
  status: string;
  sponsored: boolean;
  doping_until: string | null;
};

export type PanelSession = {
  userId: string;
  email: string;
  accountType: string | null;
};

/* getUser() request başına tek kez doğrulansın diye cache'li katman. Ham user
   nesnesi (email, user_metadata) gerektiğinde (ör. PanelData) doğrudan kullanılır. */
export const getPanelUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/* Oturum + hesap tipi — auth gate ve sidebar/e-posta için. */
export const getPanelSession = cache(async (): Promise<PanelSession | null> => {
  const user = await getPanelUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? "",
    accountType: (profile?.account_type as string | null) ?? null,
  };
});

/* Kullanıcının birincil işletmesi (hafif kolonlar) — talep/doping/değerlendirme/destek. */
export const getPanelBusiness = cache(async (): Promise<PanelBusinessLite | null> => {
  const user = await getPanelUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("id,name,group,type,city,country,district,status,sponsored,doping_until")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  return (data as PanelBusinessLite | null) ?? null;
});

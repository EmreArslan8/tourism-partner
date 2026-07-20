import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getPanelUser } from "@/lib/panel-auth";

export type SupplierOnboarding = { businessId: number | null; businessName: string; hasCover: boolean };

/* Tedarikçinin zorunlu kapak görseli durumu. Kayıt akışının son adımı (görsel)
   oturum gerektirdiğinden doğrulama sonrası /onboarding'de tamamlanır; panel layout'u
   kapak yoksa oraya yönlendirir. Request başına tek sorgu (cache). */
export const getSupplierOnboarding = cache(async (): Promise<SupplierOnboarding> => {
  const user = await getPanelUser();
  if (!user) return { businessId: null, businessName: "", hasCover: false };

  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("id,name,image")
    .eq("owner_id", user.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (!data?.id) return { businessId: null, businessName: "", hasCover: false };
  const hasCover = typeof data.image === "string" && data.image.trim().length > 0;
  return { businessId: Number(data.id), businessName: String(data.name ?? ""), hasCover };
});

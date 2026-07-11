import "server-only";

import { createClient } from "@/lib/supabase/server";

export type MemberBusinessContact = {
  id: number;
  fullName: string;
  title: string | null;
  phone: string | null;
  email: string | null;
};

export type BusinessContactAccess = {
  isAuthenticated: boolean;
  contacts: MemberBusinessContact[];
};

/* Oturuma bağlı özel veri: misafir için DB sorgusu yapılmaz ve iletişim bilgisi
   HTML/RSC çıktısına taşınmaz. Üye sorgusu da yalnız gerekli kolonları döndürür. */
export async function getBusinessContactsForViewer(businessId: number): Promise<BusinessContactAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isAuthenticated: false, contacts: [] };

  const { data, error } = await supabase
    .from("business_contacts")
    .select("id,full_name,title,phone,email")
    .eq("business_id", businessId)
    .order("id", { ascending: true })
    .limit(20);

  if (error) {
    console.error(`[business-contacts] Yetkili kişiler okunamadı: ${error.message}`);
    return { isAuthenticated: true, contacts: [] };
  }

  return {
    isAuthenticated: true,
    contacts: (data ?? []).map((contact) => ({
      id: Number(contact.id),
      fullName: contact.full_name,
      title: contact.title,
      phone: contact.phone,
      email: contact.email,
    })),
  };
}

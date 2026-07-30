import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

/*
 * Kayıt anı mükerrer kontrolü — aynı işletmenin ikinci kez kaydolmasını engeller.
 *
 * Neden isim değil e-posta: gerçek vakada (zirkel360) iki hesap 2 dakika arayla
 * açıldı; hesap e-postaları bir harf farklıydı (khaled/khalid) ama işletme iletişim
 * e-postası birebir aynıydı. İsim kontrolü owner_id bazlı olduğu için farklı
 * hesaplarda çalışmıyor, hesap e-postası kontrolü de farklı yazımı yakalamıyor.
 *
 * Neden iki tablo: işletme kaydı kayıt anında değil, ensureBusinessForUser ile
 * asenkron oluşuyor (callback/giriş/panel/cron). Aynı vakada ikinci kayıt
 * yapıldığında ilk kaydın businesses satırı henüz yoktu. Bu yüzden hem oluşmuş
 * business_contacts hem de bekleyen signup_intents taranır.
 *
 * service-role kullanır: kayıt anında oturum yoktur, RLS altında bu satırlar
 * okunamaz. Anahtar yoksa (null client) kayıt engellenmez — kontrol sessizce
 * atlanır, mükerrer kaydı bloklamak kayıt akışını kırmaktan daha az önemlidir.
 */
export async function isContactEmailTaken(emails: string[]): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[business-contacts] mükerrer kontrolü atlandı: service_role yok");
    return false;
  }

  const candidates = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
  if (candidates.length === 0) return false;

  for (const email of candidates) {
    // ilike joker karakter içermediğinde büyük/küçük harf duyarsız eşitliktir.
    const { data: contact, error: contactError } = await admin
      .from("business_contacts")
      .select("business_id")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();
    if (contactError) {
      console.error(`[business-contacts] mükerrer kontrolü başarısız: ${contactError.message}`);
      return false;
    }
    if (contact) return true;

    // Henüz işletmeye dönüşmemiş kayıt niyetleri. 'failed' niyet hiç uygulanmayacağı
    // için engel sayılmaz; kullanıcı baştan kaydolabilmeli. Niyetin hesap e-postası
    // burada kontrol edilmez — onu Supabase'in kendi "already registered" hatası
    // zaten "giriş yapmayı dene" mesajıyla karşılıyor.
    const { data: intent, error: intentError } = await admin
      .from("signup_intents")
      .select("id")
      .neq("status", "failed")
      .ilike("payload->contact->>email", email)
      .limit(1)
      .maybeSingle();
    if (intentError) {
      console.error(`[business-contacts] niyet mükerrer kontrolü başarısız: ${intentError.message}`);
      return false;
    }
    if (intent) return true;
  }

  return false;
}

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

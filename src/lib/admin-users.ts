import { cache } from "react";
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  accountType: string;
  createdAt: string;
};

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* Yetki ekranı yalnızca aktif admin hesaplarını listeler. E-posta adresleri
   auth.users'tan (service-role) çekilip eşleştirilir; anahtar yoksa e-posta boş
   kalır ama liste yine çalışır. Adminler `profiles admin read` policy'siyle okur. */
export const getAdminUsers = cache(async (): Promise<AdminUser[]> => {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id,full_name,role,account_type,created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true });
  if (error || !profiles) return [];

  // E-postaları service-role ile auth.users'tan al (varsa).
  const emails = new Map<string, string>();
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const user of data?.users ?? []) {
      if (user.email) emails.set(user.id, user.email);
    }
  }

  return profiles.map((profile) => ({
    id: profile.id,
    email: emails.get(profile.id) ?? null,
    fullName: profile.full_name,
    role: profile.role,
    accountType: profile.account_type,
    createdAt: profile.created_at,
  }));
});

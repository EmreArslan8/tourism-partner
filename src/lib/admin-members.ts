import { cache } from "react";
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/admin-auth";
import { selectAll } from "@/lib/supabase/select-all";

/*
 * Üye (hesap) düzeyinde admin görünümü. Panelin geri kalanı işletme düzeyinde çalışır
 * (businesses tablosu); alıcı (buyer) üyelerin ise tasarım gereği işletme kaydı yoktur,
 * bu yüzden bugüne kadar admin panelinde hiçbir yerde görünmüyorlardı.
 *
 * Ayrıca "tedarikçi hesabı var ama işletmesi yok" durumunu görünür kılar — 20-21
 * Temmuz'da 3 tedarikçinin kaydı tam olarak böyle sessizce yarım kalmıştı
 * (bkz. lib/signup-intents.ts).
 *
 * profiles admin RLS ile okunur ("profiles admin read"); e-posta / son giriş bilgisi
 * auth.users'ta olduğundan yalnızca service-role ile alınabilir.
 */

/* Admin hesapları listelenmez: onlar üye değil, panelin işletenidir. Dışarıda
   tutulmaları "işletmesi yok" sayacını da anlamlı kılar — admin hesaplarının zaten
   işletmesi olmaz, listede kalsalardı her zaman yanlış alarm üretirlerdi. */
export type MemberKind = "supplier" | "buyer";

export type AdminMember = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  kind: MemberKind;
  sector: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmed: boolean;
  /** Tedarikçide bağlı işletme; yoksa kayıt yarım kalmış demektir. */
  business: { id: number; name: string; status: string } | null;
  /** Alıcının platformdaki gerçek aktivitesi: gönderdiği teklif talebi sayısı. */
  quoteCount: number;
};

export type AdminMembersData = {
  members: AdminMember[];
  counts: Record<MemberKind | "all", number>;
  /** Tedarikçi olup işletmesi olmayan hesaplar — dikkat gerektirir. */
  missingBusiness: number;
  /** auth.users okunamadıysa (service_role yok) e-posta/son giriş boş kalır. */
  authUnavailable: boolean;
};

function kindOf(accountType: unknown): MemberKind {
  return accountType === "buyer" ? "buyer" : "supplier";
}

export const getAdminMembers = cache(async (): Promise<AdminMembersData> => {
  const empty: AdminMembersData = {
    members: [],
    counts: { all: 0, supplier: 0, buyer: 0 },
    missingBusiness: 0,
    authUnavailable: false,
  };

  const access = await getAdminAccess();
  if (!access.isAdmin) return empty;

  const supabase = await createClient();

  const [profilesRes, businessesRes, quotesRes] = await Promise.all([
    selectAll(
      (from, to) =>
        supabase
          .from("profiles")
          .select("id,full_name,phone,role,account_type,sector,created_at")
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to),
      { label: "admin-members/profiles" },
    ),
    selectAll(
      (from, to) =>
        supabase
          .from("businesses")
          .select("id,name,status,owner_id")
          .order("id", { ascending: true })
          .range(from, to),
      { label: "admin-members/businesses" },
    ),
    selectAll(
      (from, to) =>
        supabase
          .from("quotes")
          .select("id,requester_id")
          .order("id", { ascending: false })
          .range(from, to),
      { label: "admin-members/quotes" },
    ),
  ]);

  if (profilesRes.error) {
    console.error("[admin-members] profiller okunamadı", { error: profilesRes.error.message });
    return empty;
  }

  // owner_id başına ilk (en düşük id'li) işletme — panelin getPanelBusiness davranışıyla aynı.
  const businessByOwner = new Map<string, { id: number; name: string; status: string }>();
  for (const row of businessesRes.data) {
    const owner = row.owner_id;
    if (!owner || businessByOwner.has(owner)) continue;
    businessByOwner.set(owner, { id: Number(row.id), name: String(row.name), status: String(row.status) });
  }

  const quotesByRequester = new Map<string, number>();
  for (const row of quotesRes.data) {
    const requester = row.requester_id;
    if (!requester) continue;
    quotesByRequester.set(requester, (quotesByRequester.get(requester) ?? 0) + 1);
  }

  // E-posta ve son giriş yalnızca auth.users'ta; service-role gerekir.
  const admin = createAdminClient();
  const authById = new Map<string, { email: string; lastSignInAt: string | null; confirmed: boolean }>();
  let authUnavailable = true;
  if (admin) {
    try {
      let page = 1;
      for (;;) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw new Error(error.message);
        for (const user of data.users) {
          authById.set(user.id, {
            email: user.email ?? "",
            lastSignInAt: user.last_sign_in_at ?? null,
            confirmed: Boolean(user.email_confirmed_at),
          });
        }
        if (data.users.length < 1000) break;
        page += 1;
      }
      authUnavailable = false;
    } catch (error) {
      console.error("[admin-members] auth kullanıcıları okunamadı", {
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  const members: AdminMember[] = profilesRes.data
    .filter((row) => row.role !== "admin")
    .map((row) => {
      const id = String(row.id);
      const auth = authById.get(id);
      return {
        id,
        fullName: String(row.full_name ?? "").trim(),
        email: auth?.email ?? "",
        phone: row.phone ?? null,
        kind: kindOf(row.account_type),
        sector: row.sector ?? null,
        createdAt: String(row.created_at),
        lastSignInAt: auth?.lastSignInAt ?? null,
        emailConfirmed: auth?.confirmed ?? false,
        business: businessByOwner.get(id) ?? null,
        quoteCount: quotesByRequester.get(id) ?? 0,
      };
    });

  const counts = {
    all: members.length,
    supplier: members.filter((m) => m.kind === "supplier").length,
    buyer: members.filter((m) => m.kind === "buyer").length,
  };

  return {
    members,
    counts,
    missingBusiness: members.filter((m) => m.kind === "supplier" && !m.business).length,
    authUnavailable,
  };
});

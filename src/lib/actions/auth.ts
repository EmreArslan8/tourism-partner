"use server";

import { redirect } from "@/i18n/navigation";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey, ActionState } from "@/lib/types";
import { isEmail, isBot, clean } from "./validate";

/** Alt kategori slug'ından ana grup + tür etiketini çözer. */
function resolveCategory(slug: string): { group: GroupKey; typeLabel: string } | null {
  for (const g of CATEGORY_GROUPS) {
    const leaf = g.children.find((c) => c.slug === slug);
    if (leaf) return { group: g.key, typeLabel: leaf.label };
  }
  return null;
}

/* E-posta + şifre ile giriş (tek kimlik = Supabase Auth).
   Rol bazlı yönlendirme: admin → /admin, diğerleri → /dashboard. */
export async function signIn(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  // Rolü oku → admin ise admin paneline, değilse firma paneline.
  let role = "partner";
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    if (profile?.role) role = profile.role;
  }

  const locale = await getLocale();
  redirect({ href: role === "admin" ? "/admin" : "/dashboard", locale });
  return { ok: true };
}

/* Firma hesabı oluştur — auth kullanıcısı + (oturum açıldıysa) businesses kaydı.
   E-posta onayı kapalıysa doğrudan panele yönlenir; açıksa "e-postanı doğrula" döner. */
export async function signUp(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (isBot(formData)) return { ok: true };

  const name = clean(formData.get("name"), 160);
  const email = clean(formData.get("email"), 200);
  const password = String(formData.get("password") ?? "");
  const category = clean(formData.get("category"), 80);

  if (!name || !email || !password || !category) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };
  if (password.length < 6) return { ok: false, error: "password" };

  const cat = resolveCategory(category);
  if (!cat) return { ok: false, error: "category" };

  const locale = await getLocale();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const loginPath = locale === "tr" ? "/tr/giris" : "/en/login";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}${loginPath}` : undefined,
      data: {
        full_name: name,
        firm_name: name,
        biz_group: cat.group,
        biz_type: cat.typeLabel,
        category_slug: category,
      },
    },
  });
  if (error) {
    const m = error.message.toLowerCase();
    if (error.status === 429 || m.includes("rate limit")) return { ok: false, error: "rate" };
    if (m.includes("already registered") || m.includes("already been registered")) return { ok: false, error: "exists" };
    if (m.includes("invalid") && m.includes("email")) return { ok: false, error: "email" };
    if (m.includes("password")) return { ok: false, error: "password" };
    return { ok: false, error: "generic" };
  }

  // Oturum hemen açıldıysa (e-posta onayı kapalı) firma kaydını oluştur ve panele git.
  if (data.session && data.user) {
    await supabase.from("businesses").insert({
      owner_id: data.user.id,
      group: cat.group,
      type: cat.typeLabel,
      name,
      country: "",
      city: "",
      district: "",
      status: "pending",
    });
    redirect({ href: "/dashboard", locale });
  }

  // E-posta onayı gerekiyor.
  return { ok: true };
}

/* Çıkış yap. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect({ href: "/", locale });
}

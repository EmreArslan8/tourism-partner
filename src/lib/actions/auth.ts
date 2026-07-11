"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";
import { checkRateLimit } from "@/lib/rate-limit";
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
  const allowed = await checkRateLimit({
    scope: "auth-signin",
    limit: 8,
    windowSeconds: 10 * 60,
    identity: [email.toLowerCase()],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  // Rolü + üye tipini oku → admin: /admin, alıcı: /explore, tedarikçi: /dashboard.
  let role = "partner";
  let accountType = "supplier";
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_type")
      .eq("id", data.user.id)
      .maybeSingle();
    if (profile?.role) role = profile.role;
    if (profile?.account_type) accountType = profile.account_type;
  }

  const locale = await getLocale();
  const href = role === "admin" ? "/admin" : accountType === "buyer" ? "/explore" : "/dashboard";
  redirect({ href, locale });
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
  // Üye tipi: 'buyer' = sadece arayan/kullanan firma (listelenmez, kategori istemez).
  const accountType = clean(formData.get("accountType"), 20) === "buyer" ? "buyer" : "supplier";
  // Alıcı için opsiyonel sektör (analitik). Tedarikçide yok sayılır.
  const sector = accountType === "buyer" ? clean(formData.get("sector"), 40) : "";

  if (!name || !email || !password) return { ok: false, error: "missing" };
  // Kategori yalnızca tedarikçi (listelenecek) kayıtta zorunlu.
  if (accountType === "supplier" && !category) return { ok: false, error: "missing" };
  if (!isEmail(email)) return { ok: false, error: "email" };
  if (password.length < 6) return { ok: false, error: "password" };
  const allowed = await checkRateLimit({
    scope: "auth-signup",
    limit: 5,
    windowSeconds: 60 * 60,
    identity: [email.toLowerCase()],
  });
  if (!allowed) return { ok: false, error: "rate" };

  // Tedarikçi ise kategori çöz; alıcı ise kategori yok.
  const cat = accountType === "supplier" ? resolveCategory(category!) : null;
  if (accountType === "supplier" && !cat) return { ok: false, error: "category" };

  const locale = await getLocale();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Doğrulama linki callback'e döner → oturumu kurup direkt panele atar.
      emailRedirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}`,
      data: {
        full_name: name,
        firm_name: name,
        account_type: accountType,
        ...(sector ? { sector } : {}),
        ...(cat ? { biz_group: cat.group, biz_type: cat.typeLabel, category_slug: category } : {}),
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

  // Oturum hemen açıldıysa (e-posta onayı kapalı): tedarikçi ise firma kaydı oluştur,
  // alıcı ise kayıt oluşturmadan keşfete yönlendir.
  if (data.session && data.user) {
    if (cat) {
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
    }
    redirect({ href: accountType === "buyer" ? "/explore" : "/dashboard", locale });
  }

  // E-posta onayı gerekiyor.
  return { ok: true };
}

/* Doğrulama e-postasını yeniden gönder (verify ekranındaki "tekrar gönder"). */
export async function resendSignupEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  const clean = email.trim();
  if (!isEmail(clean)) return { ok: false, error: "email" };
  const allowed = await checkRateLimit({
    scope: "auth-resend",
    limit: 3,
    windowSeconds: 10 * 60,
    identity: [clean.toLowerCase()],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const locale = await getLocale();
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: clean,
    options: { emailRedirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}` },
  });
  if (error) return { ok: false, error: "generic" };
  return { ok: true };
}

/* Şifre sıfırlama bağlantısı gönder — link callback üzerinden /reset-password'a düşer.
   E-posta kayıtlı olmasa bile "gönderildi" döner (hesap varlığı sızdırılmaz). */
export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!isEmail(email)) return { ok: false, error: "email" };
  const allowed = await checkRateLimit({
    scope: "auth-reset",
    limit: 3,
    windowSeconds: 10 * 60,
    identity: [email.toLowerCase()],
  });
  if (!allowed) return { ok: false, error: "rate" };

  const locale = await getLocale();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}&next=reset`,
  });
  return { ok: true };
}

/* Sıfırlama linkiyle gelen (recovery oturumu açık) kullanıcının yeni şifresini kaydeder. */
export async function updatePassword(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  if (password.length < 8) return { ok: false, error: "short" };
  if (password !== password2) return { ok: false, error: "mismatch" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "session" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: "generic" };
  return { ok: true };
}

/* Çıkış yap. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect({ href: "/", locale });
}

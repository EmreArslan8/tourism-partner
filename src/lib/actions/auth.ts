"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS, isServiceOfGroup } from "@/lib/categories";
import { ensureBusinessForUser, recordSignupIntent } from "@/lib/signup-intents";
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

function validPhone(value: string): string {
  const v = value.trim();
  return /^[+]?[\d][\d\s()/-]{6,}$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7 ? v : "";
}

/* E-posta + şifre ile giriş (tek kimlik = Supabase Auth).
   Rol bazlı yönlendirme: admin → /admin, diğerleri → /dashboard. */
/* Giriş sonrası rol/üye tipine göre yönlendirme yapar (redirect throw eder). */
async function redirectAfterLogin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string | undefined,
): Promise<void> {
  let role = "partner";
  let accountType = "supplier";
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_type")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.role) role = profile.role;
    if (profile?.account_type) accountType = profile.account_type;

    // Doğrulama callback'i kaçmış olabilir (e-posta başka bir tarayıcıda açıldıysa
    // PKCE code değişimi başarısız olur). Girişte idempotent olarak tamamla — işletmesi
    // olan kullanıcıda hiçbir şey yapmaz.
    if (role !== "admin" && accountType !== "buyer") {
      const ensured = await ensureBusinessForUser(userId);
      if (!ensured.ok && ensured.reason === "error") {
        console.error("[auth-signin] işletme tamamlanamadı", { userId, error: ensured.error });
      }
    }
  }
  const locale = await getLocale();
  const href = role === "admin" ? "/admin" : accountType === "buyer" ? "/explore" : "/dashboard";
  redirect({ href, locale });
}

export async function signIn(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // 2. FAZ — 2FA kodu doğrulama. İlk fazda şifre doğrulanıp aal1 oturum açıldıysa
  // ve kullanıcının doğrulanmış TOTP faktörü varsa buraya düşülür.
  const mfaFactorId = String(formData.get("mfaFactorId") ?? "").trim();
  const mfaChallengeId = String(formData.get("mfaChallengeId") ?? "").trim();
  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (mfaFactorId && mfaChallengeId) {
    if (!/^\d{6}$/.test(code)) return { ok: false, error: "mfa", factorId: mfaFactorId, challengeId: mfaChallengeId };
    const { error } = await supabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: mfaChallengeId, code });
    if (error) return { ok: false, error: "mfa_invalid", factorId: mfaFactorId, challengeId: mfaChallengeId };
    const { data: userData } = await supabase.auth.getUser();
    await redirectAfterLogin(supabase, userData.user?.id);
    return { ok: true };
  }

  // 1. FAZ — e-posta + şifre.
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

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  // 2FA aktifse (doğrulanmış faktör var → nextLevel aal2) kod iste.
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const factorId = factors?.totp[0]?.id;
    if (factorId) {
      const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
      if (!chErr && challenge) {
        return { ok: false, error: "mfa", factorId, challengeId: challenge.id };
      }
    }
  }

  await redirectAfterLogin(supabase, data.user?.id);
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

  // Çoklu hizmet seçimi (business_services). Birincil (category) her zaman dahil.
  const serviceSlugs =
    cat
      ? [...new Set([category!, ...String(formData.get("services") ?? "").split(",").map((s) => s.trim())])]
          .filter((slug) => slug && isServiceOfGroup(slug, cat.group))
      : [];

  // Kayıt adımı 3'te (yalnızca tedarikçi) toplanan işletme profili — hepsi opsiyonel.
  // Oturum henüz açılmadığı için (e-posta onayı) auth metadata'sına yazılır ve
  // işletme kaydı ilk oluşturulurken uygulanır (callback / panel).
  // Kapak görseli kayıt adım 3'te oturumsuz draft olarak yüklendi (/api/signup/cover).
  // Yalnızca beklenen "signup-drafts/" önekli yolu kabul et.
  const coverDraftRaw = String(formData.get("bizCoverDraft") ?? "").trim();
  const coverDraft =
    coverDraftRaw.startsWith("signup-drafts/") && coverDraftRaw.length <= 400 && !coverDraftRaw.includes("..")
      ? coverDraftRaw
      : "";
  const bizProfile = cat
    ? {
        country: clean(formData.get("bizCountry"), 80) ?? "",
        city: clean(formData.get("bizCity"), 80) ?? "",
        district: clean(formData.get("bizDistrict"), 80) ?? "",
        description: clean(formData.get("bizDescription"), 2000) ?? "",
        whatsapp: validPhone(clean(formData.get("bizWhatsapp"), 40) ?? ""),
        contactName: clean(formData.get("contactName"), 160) ?? "",
        // Geçersiz iletişim bilgisi DB'ye yazılmasın (istemci doğrulaması baypas edilse bile).
        contactPhone: validPhone(clean(formData.get("contactPhone"), 40) ?? ""),
        contactEmail: (() => {
          const v = clean(formData.get("contactEmail"), 200) ?? "";
          return isEmail(v) ? v : "";
        })(),
        cover: coverDraft,
      }
    : null;
  if (cat && bizProfile && (!bizProfile.contactName || !bizProfile.contactPhone || !bizProfile.whatsapp)) {
    return { ok: false, error: "missing" };
  }
  const hasBizProfile = Boolean(
    bizProfile &&
      (bizProfile.country || bizProfile.description || bizProfile.whatsapp || bizProfile.contactName || bizProfile.cover),
  );

  const locale = await getLocale();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Doğrulama linki callback'e döner → oturumu kurup direkt panele atar.
      emailRedirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}`,
      data: {
        // Supabase e-posta şablonları .Data.locale ile Türkçe/İngilizce metni seçer.
        locale,
        full_name: name,
        firm_name: name,
        account_type: accountType,
        ...(sector ? { sector } : {}),
        ...(cat ? { biz_group: cat.group, biz_type: cat.typeLabel, category_slug: category, service_slugs: serviceSlugs } : {}),
        // Kayıt adımı 3 profili — işletme kaydı oluşurken uygulanır (bkz. callback/panel).
        ...(hasBizProfile && bizProfile
          ? {
              biz_country: bizProfile.country,
              biz_city: bizProfile.city,
              biz_district: bizProfile.district,
              biz_description: bizProfile.description,
              biz_phone: bizProfile.whatsapp,
              biz_whatsapp: bizProfile.whatsapp,
              biz_cover: bizProfile.cover,
              biz_contact: {
                name: bizProfile.contactName,
                phone: bizProfile.contactPhone,
                email: bizProfile.contactEmail,
              },
            }
          : {}),
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

  // Niyeti HEMEN ve kalıcı olarak yaz — oturum açılmamış olsa bile. İşletme kaydının
  // oluşması artık doğrulama linkinden dönüşe bağlı değil; ensureBusinessForUser bunu
  // callback / giriş / panel girişi / cron'dan idempotent olarak tamamlar.
  if (data.user && cat) {
    await recordSignupIntent(data.user.id, email, {
      group: cat.group,
      type: cat.typeLabel,
      name,
      country: bizProfile?.country ?? "",
      city: bizProfile?.city ?? "",
      district: bizProfile?.district ?? "",
      description: bizProfile?.description ?? "",
      phone: bizProfile?.whatsapp ?? "",
      whatsapp: bizProfile?.whatsapp ?? "",
      cover: bizProfile?.cover ?? "",
      serviceSlugs,
      contact: bizProfile?.contactName
        ? {
            name: bizProfile.contactName,
            phone: bizProfile.contactPhone,
            email: bizProfile.contactEmail,
          }
        : undefined,
    });
  }

  // Oturum hemen açıldıysa (e-posta onayı kapalı): tedarikçi ise firma kaydını şimdi
  // oluştur, alıcı ise kayıt oluşturmadan keşfete yönlendir.
  if (data.session && data.user) {
    if (cat) {
      const ensured = await ensureBusinessForUser(data.user.id);
      if (!ensured.ok) {
        // Kayıp değil: niyet 'pending' kaldı, cron ve sonraki panel girişi tekrar dener.
        console.error("[auth-signup] işletme oluşturulamadı", {
          userId: data.user.id,
          reason: ensured.reason,
          error: ensured.error,
        });
      }
    }
    redirect({ href: "/dashboard", locale });
  }

  // E-posta onayı gerekiyor.
  return { ok: true };
}

/* Doğrulama e-postasını yeniden gönder (verify ekranındaki "tekrar gönder"). */
export async function resendSignupEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  const clean = email.trim();
  const masked = clean.replace(/^(.{2}).*(@.*)$/, "$1***$2");
  if (!isEmail(clean)) {
    console.warn("[auth-resend] geçersiz e-posta", { email: masked });
    return { ok: false, error: "email" };
  }
  console.info("[auth-resend] başlıyor", {
    email: masked,
    siteUrl: SITE_URL,
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
  const resendRateLimitDisabled = process.env.AUTH_RESEND_RATE_LIMIT_DISABLED === "true";
  if (!resendRateLimitDisabled) {
    const allowed = await checkRateLimit({
      scope: "auth-resend",
      limit: 3,
      windowSeconds: 10 * 60,
      identity: [clean.toLowerCase()],
    });
    if (!allowed) {
      console.warn("[auth-resend] rate limit", { email: masked });
      return { ok: false, error: "rate" };
    }
  } else {
    console.warn("[auth-resend] uygulama rate limit geçici olarak kapalı");
  }

  const locale = await getLocale();
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: clean,
    options: { emailRedirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}` },
  });
  if (error) {
    console.error("[auth-resend] Supabase başarısız", {
      email: masked,
      status: error.status,
      code: error.code,
      message: error.message,
    });
    return { ok: false, error: error.status === 429 ? "rate" : "generic" };
  }
  console.info("[auth-resend] Supabase kabul etti", { email: masked, redirectTo: `${SITE_URL}/api/auth/callback?locale=${locale}` });
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

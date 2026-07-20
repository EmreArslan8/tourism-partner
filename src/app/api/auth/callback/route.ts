import { NextResponse, type NextRequest } from "next/server";
import { hashBusinessInviteToken } from "@/lib/business-owner-invites";
import { ensureBusinessFromMetadata } from "@/lib/business-bootstrap";
import { createClient } from "@/lib/supabase/server";

/*
 * E-posta doğrulama linki buraya döner (emailRedirectTo). PKCE code'u oturuma
 * çevirir ve kullanıcıyı doğrudan paneline/keşfete atar — elle giriş gerekmez.
 * Kod yoksa/hatalıysa giriş sayfasına düşer (mevcut davranış → asla daha kötü değil).
 * /api altında olduğu için next-intl proxy'sini baypas eder.
 */
const DEST = {
  tr: { dashboard: "/tr/panel", explore: "/tr/kesfet", login: "/tr/giris", reset: "/tr/sifre-yenile" },
  en: { dashboard: "/en/dashboard", explore: "/en/explore", login: "/en/login", reset: "/en/reset-password" },
  ru: { dashboard: "/ru/dashboard", explore: "/ru/explore", login: "/ru/login", reset: "/ru/reset-password" },
  ar: { dashboard: "/ar/dashboard", explore: "/ar/explore", login: "/ar/login", reset: "/ar/reset-password" },
} as const;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedLocale = url.searchParams.get("locale");
  const locale = requestedLocale === "en" || requestedLocale === "ru" || requestedLocale === "ar" ? requestedLocale : "tr";
  const d = DEST[locale];

  if (!code) return NextResponse.redirect(new URL(d.login, url.origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL(d.login, url.origin));

  // Şifre sıfırlama linki: recovery oturumu açıldı → yeni şifre ekranına git.
  if (url.searchParams.get("next") === "reset") {
    return NextResponse.redirect(new URL(d.reset, url.origin));
  }

  // İşletme sahipliği daveti: doğrulanan oturum aynı tek kullanımlık davete döner.
  const invite = url.searchParams.get("invite");
  if (invite && invite.length >= 30 && invite.length <= 160) {
    // E-posta doğrulaması oturumu kurdu; daveti aynı transaction-safe RPC ile
    // otomatik kabul et. Başarısızsa kullanıcı ayrıntılı durumu davet ekranında görür.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: accepted } = await (supabase as any).rpc("accept_business_owner_invite", {
      p_token_hash: hashBusinessInviteToken(invite),
    });
    if (accepted === "accepted" || accepted === "already_accepted") {
      return NextResponse.redirect(new URL(d.dashboard, url.origin));
    }
    const segment = locale === "tr" ? "isletme-daveti" : "business-invite";
    const target = new URL(`/${locale}/${segment}`, url.origin);
    target.searchParams.set("token", invite);
    return NextResponse.redirect(target);
  }

  // Kayıt adım 3'te toplanan işletme profilini metadata'dan uygula (idempotent).
  // Oturum bu noktada kurulu; tedarikçi kaydı yoksa metadata'dan üretilir.
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user) {
    try {
      await ensureBusinessFromMetadata(supabase, userData.user);
    } catch (error) {
      console.error("[auth/callback] işletme bootstrap hatası:", error instanceof Error ? error.message : error);
    }
  }

  // Panel kabuğu kullanıcı tipine göre doğru çalışma alanını gösterir.
  return NextResponse.redirect(new URL(d.dashboard, url.origin));
}

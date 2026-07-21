import { NextResponse, type NextRequest } from "next/server";
import { hashBusinessInviteToken } from "@/lib/business-owner-invites";
import { ensureBusinessForUser } from "@/lib/signup-intents";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmailOnce } from "@/lib/welcome-email";

/*
 * E-posta doğrulama linki buraya döner (emailRedirectTo). PKCE code'u oturuma
 * çevirir ve kullanıcıyı doğrudan paneline/keşfete atar — elle giriş gerekmez.
 * Kod yoksa/hatalıysa giriş sayfasına düşer (mevcut davranış → asla daha kötü değil).
 * /api altında olduğu için next-intl proxy'sini baypas eder.
 */
const DEST = {
  tr: { dashboard: "/tr/panel", explore: "/tr/kesfet", login: "/tr/giris", reset: "/tr/sifre-yenile", help: "/tr/yardim" },
  en: { dashboard: "/en/dashboard", explore: "/en/explore", login: "/en/login", reset: "/en/reset-password", help: "/en/help" },
  ru: { dashboard: "/ru/dashboard", explore: "/ru/explore", login: "/ru/login", reset: "/ru/reset-password", help: "/ru/help" },
  ar: { dashboard: "/ar/dashboard", explore: "/ar/explore", login: "/ar/login", reset: "/ar/reset-password", help: "/ar/help" },
} as const;

type Locale = keyof typeof DEST;

function asLocale(value: unknown): Locale | null {
  return value === "tr" || value === "en" || value === "ru" || value === "ar" ? value : null;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  // Linkteki ?locale= birincil kaynak; bozulmuş/eksikse aşağıda kullanıcının
  // kayıt sırasında yazılan user_metadata.locale'ine düşülür.
  const paramLocale = asLocale(url.searchParams.get("locale"));
  const locale: Locale = paramLocale ?? "tr";
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

  // Kayıt niyetini işletmeye dönüştür (idempotent). Bu yol artık tek şans değil:
  // buraya hiç ulaşılamazsa giriş, panel girişi ve cron aynı işi tamamlar.
  const { data: userData } = await supabase.auth.getUser();
  // Link'te locale yoksa kullanıcının kayıt dilini kullan — Türkçe'ye düşmek yerine.
  const effectiveLocale: Locale =
    paramLocale ?? asLocale(userData.user?.user_metadata?.locale) ?? "tr";
  const dest = DEST[effectiveLocale];

  if (userData.user) {
    try {
      const ensured = await ensureBusinessForUser(userData.user.id);
      if (!ensured.ok && ensured.reason === "error") {
        console.error("[auth/callback] işletme tamamlanamadı", {
          userId: userData.user.id,
          error: ensured.error,
        });
      }
    } catch (error) {
      console.error("[auth/callback] işletme bootstrap hatası:", error instanceof Error ? error.message : error);
    }

    // Hoş geldin maili — onay öncesi sessizliği doldurur. Tek seferlik olduğu
    // auth metadata bayrağıyla garanti edilir; hata redirect'i bloklamaz.
    try {
      await sendWelcomeEmailOnce(userData.user, effectiveLocale, {
        dashboard: dest.dashboard,
        explore: dest.explore,
        help: dest.help,
      });
    } catch (error) {
      console.error("[welcome-email] beklenmeyen hata", error instanceof Error ? error.message : error);
    }
  }

  // Panel kabuğu kullanıcı tipine göre doğru çalışma alanını gösterir.
  return NextResponse.redirect(new URL(dest.dashboard, url.origin));
}

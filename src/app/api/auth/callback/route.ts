import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
 * E-posta doğrulama linki buraya döner (emailRedirectTo). PKCE code'u oturuma
 * çevirir ve kullanıcıyı doğrudan paneline/keşfete atar — elle giriş gerekmez.
 * Kod yoksa/hatalıysa giriş sayfasına düşer (mevcut davranış → asla daha kötü değil).
 * /api altında olduğu için next-intl proxy'sini baypas eder.
 */
const DEST = {
  tr: { dashboard: "/tr/panel", explore: "/tr/kesfet", login: "/tr/giris" },
  en: { dashboard: "/en/dashboard", explore: "/en/explore", login: "/en/login" },
} as const;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const locale = url.searchParams.get("locale") === "en" ? "en" : "tr";
  const d = DEST[locale];

  if (!code) return NextResponse.redirect(new URL(d.login, url.origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL(d.login, url.origin));

  // Üye tipine göre hedef: alıcı → keşfet, tedarikçi → panel.
  let dest: string = d.dashboard;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.account_type === "buyer") dest = d.explore;
  }

  return NextResponse.redirect(new URL(dest, url.origin));
}

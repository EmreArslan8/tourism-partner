import type { User } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { welcomeEmail, type WelcomeAccountType, type WelcomeEmailLocale } from "@/lib/email-templates/welcome";
import { EMAIL_LOGO_URL, SITE_URL } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

/* E-posta doğrulandıktan sonra bir kez gönderilen hoş geldin maili.
   Tek seferlik olması auth metadata'sındaki welcome_email_sent_at bayrağıyla
   sağlanır — yeni tablo/kolon gerekmez. Service role anahtarı yoksa bayrak
   yazılamayacağı için mail hiç gönderilmez (tekrar tekrar gitmesindense hiç
   gitmesin); business-approval-email ile aynı zarif düşüş davranışı. */

type Paths = { dashboard: string; explore: string; help: string };

export async function sendWelcomeEmailOnce(
  user: User,
  locale: WelcomeEmailLocale,
  paths: Paths
): Promise<"sent" | "already_sent" | "skipped" | "failed"> {
  const to = user.email?.trim();
  if (!to) {
    console.warn("[welcome-email] kullanıcının e-postası yok", { userId: user.id });
    return "skipped";
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  if (meta.welcome_email_sent_at) return "already_sent";

  const admin = createAdminClient();
  if (!admin) {
    console.warn("[welcome-email] admin client yok; SUPABASE_SERVICE_ROLE_KEY eksik");
    return "skipped";
  }

  const displayName =
    (typeof meta.firm_name === "string" && meta.firm_name.trim()) ||
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    to;
  const accountType: WelcomeAccountType = meta.account_type === "buyer" ? "buyer" : "supplier";

  const message = welcomeEmail({
    locale,
    accountType,
    displayName,
    dashboardUrl: `${SITE_URL}${paths.dashboard}`,
    exploreUrl: `${SITE_URL}${paths.explore}`,
    helpUrl: `${SITE_URL}${paths.help}`,
    logoUrl: EMAIL_LOGO_URL,
  });

  // Bayrağı gönderimden ÖNCE yaz: aynı anda iki callback isteği gelirse
  // kullanıcı iki mail almasın. Gönderim başarısız olursa bayrak temizlenir.
  const { error: flagError } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...meta, welcome_email_sent_at: new Date().toISOString() },
  });
  if (flagError) {
    console.error("[welcome-email] bayrak yazılamadı, mail gönderilmedi", { userId: user.id, error: flagError.message });
    return "failed";
  }

  const delivery = await sendEmail({ to, subject: message.subject, html: message.html, text: message.text });
  if (delivery.ok) {
    console.info("[welcome-email] gönderildi", { userId: user.id, locale, accountType, providerId: delivery.id ?? null });
    return "sent";
  }

  // Gönderilemedi — bayrağı geri al ki sonraki denemede tekrar şans olsun.
  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...meta, welcome_email_sent_at: null },
  });
  console.error("[welcome-email] gönderilemedi", {
    userId: user.id,
    skipped: delivery.skipped ?? false,
    error: delivery.error ?? null,
  });
  return "failed";
}

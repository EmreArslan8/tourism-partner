import { cookies, headers } from "next/headers";
import { createHash, randomUUID } from "crypto";

/* Anonim ziyaretçi kimliği + bot tespiti.
   Amaç: page_views'te "tekil görüntülenme" (distinct visitor_id) hesaplanabilsin ve
   bot/crawler trafiği sayıma (ve öneri balancing'ine) karışmasın. Kimlik gizlidir:
   IP ham tutulmaz, sha256 ile hash'lenir; visitor_id rastgele UUID'dir (kişisel veri değil). */

const COOKIE = "tp_vid";
const ONE_YEAR = 60 * 60 * 24 * 365;

/* Yaygın bot/crawler/HTTP-client imzaları. Gerçek tarayıcı UA'larıyla eşleşmez
   (Chrome/Safari/Firefox/Edge token'ları listede yok). UA boşsa bot varsayılır. */
const BOT_RE =
  /bot\b|crawl|spider|slurp|mediapartners|googlebot|bingpreview|facebookexternalhit|embedly|quora|pinterest|slackbot|telegram|whatsapp|discordbot|baiduspider|yandex|duckduckbot|semrush|ahrefs|mj12|dotbot|petalbot|headless|phantom|puppeteer|playwright|python-requests|curl\/|wget|axios|node-fetch|okhttp|java\//i;

export function isBotUA(ua: string): boolean {
  if (!ua.trim()) return true;
  return BOT_RE.test(ua);
}

export type VisitorContext = {
  isBot: boolean;
  visitorId: string;
  ipHash: string;
  userAgent: string;
};

/* İstekten ziyaretçi bağlamını çıkarır; visitor_id cookie'si yoksa oluşturup set eder.
   Cookie set edilemeyen bağlamlarda (statik render vb.) sessizce geçer. */
export async function getVisitorContext(): Promise<VisitorContext> {
  const h = await headers();
  const userAgent = (h.get("user-agent") ?? "").slice(0, 400);
  const ipRaw =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(ipRaw).digest("hex").slice(0, 40);

  const jar = await cookies();
  let visitorId = jar.get(COOKIE)?.value;
  if (!visitorId) {
    visitorId = randomUUID();
    try {
      jar.set(COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: ONE_YEAR,
        path: "/",
      });
    } catch {
      // Cookie yazılamayan bağlam — visitorId yine de bu istek için kullanılır.
    }
  }

  return { isBot: isBotUA(userAgent), visitorId, ipHash, userAgent };
}

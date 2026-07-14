"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getVisitorContext } from "@/lib/visitor";

const ALLOWED = new Set(["business", "quote", "page", "impression"]);

/* Görüntülenme kaydı — page_views tablosuna yazar (anon insert RLS ile açık).
   entity_type 'business' = detay sayfası ziyareti (click); 'impression' = kartın
   arama sonucunda ekrana gelmesi. İkisi de işletmenin görüntülenme metriğini besler.

   Sağlamlaştırma: anonim visitor_id (cookie) + hash'li IP + UA yazılır → panelde
   "tekil görüntülenme" (distinct visitor_id) hesaplanabilir. Bot/crawler trafiği
   sayılmaz (öneri balancing'i de böylece şişmez). Client tarafında sessionStorage
   ayrıca oturum-başına tekrarları eler.
   Fire-and-forget: hata olsa bile sayfayı etkilemez. Dashboard/Raporlar bunu okur. */
export async function recordView(entityType: string, entityId: number): Promise<void> {
  if (!ALLOWED.has(entityType) || !Number.isInteger(entityId)) return;
  try {
    const { isBot, visitorId, ipHash, userAgent } = await getVisitorContext();
    if (isBot) return; // botları/crawler'ları sayma

    const allowed = await checkRateLimit({
      scope: "record-view",
      limit: 60,
      windowSeconds: 60,
      identity: [entityType, entityId, visitorId],
    });
    if (!allowed) return;

    const supabase = await createClient();
    await supabase.from("page_views").insert({
      entity_type: entityType,
      entity_id: entityId,
      visitor_id: visitorId,
      ip_hash: ipHash,
      user_agent: userAgent,
    });
  } catch {
    // sessizce yut
  }
}

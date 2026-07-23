import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SignupIntentPayload } from "@/lib/supabase/database.types";
import type { GroupKey } from "@/lib/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { promoteSignupCover } from "@/lib/business-bootstrap";
import { replaceBusinessServices } from "@/lib/business-services";
import { CATEGORY_GROUPS } from "@/lib/categories";

/*
 * Kayıt niyeti (signup intent) — kayıt → işletme akışının TEK doğruluk kaynağı.
 *
 * Neden var: işletme kaydı eskiden yalnızca e-posta doğrulama callback'inde oluşuyordu.
 * O route PKCE code değişimine bağlı; kullanıcı doğrulama linkini başka bir tarayıcıda
 * açtığında oturum kurulamıyor ve işletme hiç oluşmuyordu. Artık niyet kayıt anında
 * (oturumsuz, service-role ile) signup_intents'e yazılır; işletmeye dönüştürme ise
 * idempotent ensureBusinessForUser'a bırakılır ve üç ayrı yerden çağrılır:
 * callback, giriş ve panel girişi — biri kaçarsa diğeri yakalar. Hiç geri dönmeyen
 * kullanıcı için cron uzlaştırıcı son emniyet ağıdır (api/cron/apply-signup-intents).
 */

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

/** Bu sayıdan sonra niyet 'failed'e çekilir ve log'a alarm düşer. */
export const MAX_INTENT_ATTEMPTS = 5;

export type EnsureResult =
  | { ok: true; businessId: number; created: boolean }
  | { ok: false; reason: "no_intent" | "unavailable" | "error"; error?: string };

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isGroup(value: unknown): value is GroupKey {
  return typeof value === "string" && CATEGORY_GROUPS.some((group) => group.key === value);
}

/*
 * Auth metadata'sından niyet üretir — signup_intents'ten ÖNCE kaydolmuş kullanıcılar
 * için geriye uyum yolu. Alıcıda (buyer) ve kategori seçilmemiş kayıtta null döner:
 * bu hesapların işletmesi olmaması beklenen durumdur.
 */
export function payloadFromMetadata(
  meta: Record<string, unknown> | null | undefined,
): SignupIntentPayload | null {
  const m = meta ?? {};
  const accountType = typeof m.account_type === "string" ? m.account_type : "supplier";
  if (accountType === "buyer") return null;
  if (!isGroup(m.biz_group)) return null;

  const contact =
    m.biz_contact && typeof m.biz_contact === "object" ? (m.biz_contact as Record<string, unknown>) : null;
  const coverRaw = str(m.biz_cover, 400);

  return {
    group: m.biz_group,
    type: str(m.biz_type, 80),
    name: str(m.firm_name, 160) || str(m.full_name, 160),
    country: str(m.biz_country, 80),
    city: str(m.biz_city, 80),
    district: str(m.biz_district, 80),
    address: str(m.biz_address, 260),
    description: str(m.biz_description, 2000),
    phone: str(m.biz_phone, 40),
    whatsapp: str(m.biz_whatsapp, 40),
    // Public bucket'taki oturumsuz draft yolu (bkz. api/signup/cover).
    cover: coverRaw.startsWith("signup-drafts/") && !coverRaw.includes("..") ? coverRaw : "",
    serviceSlugs: Array.isArray(m.service_slugs)
      ? (m.service_slugs as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
    contact: contact
      ? { name: str(contact.name, 160), phone: str(contact.phone, 40), email: str(contact.email, 200) }
      : undefined,
  };
}

/*
 * Kayıt anında çağrılır — oturum henüz yokken (e-posta onayı açık) bile çalışsın diye
 * service-role kullanır. Açık niyet varsa yeniden yazmaz; DB'deki kısmi unique index
 * (user_id where status='pending') bunu ayrıca garantiler.
 */
export async function recordSignupIntent(
  userId: string,
  email: string | null,
  payload: SignupIntentPayload,
): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[signup-intents] service_role yok — niyet kaydedilemedi", { userId });
    return null;
  }

  const { data: open } = await admin
    .from("signup_intents")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .maybeSingle();
  if (open?.id) return open.id;

  const { data, error } = await admin
    .from("signup_intents")
    .insert({ user_id: userId, email, payload })
    .select("id")
    .single();
  if (error || !data?.id) {
    console.error("[signup-intents] niyet yazılamadı", { userId, error: error?.message });
    return null;
  }
  return data.id;
}

/*
 * Niyeti işletmeye dönüştürür: businesses + kapak taşıma + hizmetler + yetkili kişi.
 * Bu mantığın TEK kopyası — daha önce auth.ts (signUp) ve business-bootstrap.ts içinde
 * ikiye bölünmüştü.
 */
async function createBusinessFromPayload(
  admin: AdminClient,
  userId: string,
  payload: SignupIntentPayload,
  intentId: string | null,
): Promise<{ ok: true; businessId: number } | { ok: false; error: string }> {
  const group = payload.group;
  if (!isGroup(group)) return { ok: false, error: "missing_group" };

  const name = str(payload.name, 160) || "—";
  const whatsapp = str(payload.whatsapp, 40);
  const address = str(payload.address, 260);
  const { data: created, error } = await admin
    .from("businesses")
    .insert({
      owner_id: userId,
      group,
      type: str(payload.type, 80) || "—",
      name,
      country: str(payload.country, 80),
      city: str(payload.city, 80),
      district: str(payload.district, 80),
      description: str(payload.description, 2000) || null,
      phone: str(payload.phone, 40) || null,
      details: {
        ...(whatsapp ? { whatsapp } : {}),
        ...(address ? { address } : {}),
      },
      status: "pending",
      // Kolon yalnızca niyet varken yazılır: migration henüz uygulanmamış bir DB'de
      // (kod önce deploy edilirse) insert yine de çalışsın — kayıt kaybı olmasın.
      ...(intentId ? { signup_intent_id: intentId } : {}),
    })
    .select("id")
    .single();

  if (error || !created?.id) {
    // 23505: signup_intent_id unique — eşzamanlı ikinci deneme. Kayıp değil, yarış.
    if (error?.code === "23505" && intentId) {
      const { data: winner } = await admin
        .from("businesses")
        .select("id")
        .eq("signup_intent_id", intentId)
        .maybeSingle();
      if (winner?.id) return { ok: true, businessId: Number(winner.id) };
    }
    return { ok: false, error: error?.message ?? "insert_failed" };
  }

  const businessId = Number(created.id);

  // Kapak: oturumsuz yüklenen draft'ı kullanıcının kendi klasörüne taşı (panel uyumlu yol).
  // Başarısızsa işletme kapaksız kalır; onboarding kapısı kullanıcıya tamamlatır.
  const cover = str(payload.cover, 400);
  if (cover) {
    const finalPath = await promoteSignupCover(userId, businessId, name, cover);
    if (finalPath) {
      const { error: imageError } = await admin
        .from("businesses")
        .update({ image: finalPath })
        .eq("id", businessId);
      if (imageError) {
        console.error("[signup-intents] kapak yazılamadı", { businessId, error: imageError.message });
      }
    } else {
      console.error("[signup-intents] kapak taşınamadı", { businessId, cover });
    }
  }

  const serviceSlugs = (payload.serviceSlugs ?? []).filter((slug) => typeof slug === "string");
  if (serviceSlugs.length > 0) {
    await replaceBusinessServices(admin, businessId, group, serviceSlugs);
  }

  const contactName = str(payload.contact?.name, 160);
  if (contactName) {
    const { error: contactError } = await admin.from("business_contacts").insert({
      business_id: businessId,
      full_name: contactName,
      phone: str(payload.contact?.phone, 40) || null,
      email: str(payload.contact?.email, 200) || null,
    });
    if (contactError) {
      console.error("[signup-intents] yetkili kişi yazılamadı", { businessId, error: contactError.message });
    }
  }

  return { ok: true, businessId };
}

async function markApplied(admin: AdminClient, intentId: string, businessId: number): Promise<void> {
  await admin
    .from("signup_intents")
    .update({
      status: "applied",
      business_id: businessId,
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_error: null,
    })
    .eq("id", intentId);
}

async function markFailure(
  admin: AdminClient,
  intentId: string,
  attempts: number,
  error: string,
): Promise<void> {
  const nextAttempts = attempts + 1;
  const exhausted = nextAttempts >= MAX_INTENT_ATTEMPTS;
  await admin
    .from("signup_intents")
    .update({
      status: exhausted ? "failed" : "pending",
      attempts: nextAttempts,
      last_error: error.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", intentId);
  if (exhausted) {
    console.error("[signup-intents] ALARM: niyet kalıcı olarak başarısız", { intentId, error });
  }
}

/*
 * Kayıt akışının idempotent giriş noktası. Oturumun kurulduğu her yerden çağrılabilir;
 * işletme zaten varsa hiçbir şey yapmaz. Kayıp yaratmamak için hata ASLA yutulmaz:
 * her başarısızlık niyete (attempts/last_error) ve log'a yazılır.
 */
export async function ensureBusinessForUser(userId: string): Promise<EnsureResult> {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[signup-intents] service_role yok — işletme tamamlanamadı", { userId });
    return { ok: false, reason: "unavailable" };
  }

  const [{ data: existing }, { data: intent }] = await Promise.all([
    admin.from("businesses").select("id").eq("owner_id", userId).order("id").limit(1).maybeSingle(),
    admin
      .from("signup_intents")
      .select("id,payload,attempts")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle(),
  ]);

  if (existing?.id) {
    const businessId = Number(existing.id);
    // Panelden/adminden elle oluşturulmuş olabilir — açık niyeti kapat ki cron tekrar denemesin.
    if (intent?.id) await markApplied(admin, intent.id, businessId);
    return { ok: true, businessId, created: false };
  }

  let payload = intent?.payload ?? null;
  if (!payload || !isGroup(payload.group)) {
    // Geriye uyum: signup_intents'ten önce kaydolmuş kullanıcılar metadata'dan tamamlanır.
    const { data: fetched } = await admin.auth.admin.getUserById(userId);
    payload = payloadFromMetadata(fetched.user?.user_metadata);
  }
  // Alıcı (buyer) ve kategori seçmemiş hesaplar: işletme beklenmiyor.
  if (!payload) return { ok: false, reason: "no_intent" };

  const result = await createBusinessFromPayload(admin, userId, payload, intent?.id ?? null);
  if (!result.ok) {
    if (intent?.id) await markFailure(admin, intent.id, intent.attempts ?? 0, result.error);
    console.error("[signup-intents] işletme oluşturulamadı", { userId, error: result.error });
    return { ok: false, reason: "error", error: result.error };
  }

  if (intent?.id) await markApplied(admin, intent.id, result.businessId);
  return { ok: true, businessId: result.businessId, created: true };
}

/** Cron uzlaştırıcı için: belirtilen süreden eski, hâlâ bekleyen niyetler. */
export async function listStalePendingIntents(
  admin: AdminClient,
  olderThanMinutes: number,
  limit: number,
): Promise<{ id: string; user_id: string }[]> {
  const cutoff = new Date(Date.now() - olderThanMinutes * 60_000).toISOString();
  const { data, error } = await admin
    .from("signup_intents")
    .select("id,user_id")
    .eq("status", "pending")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("[signup-intents] bekleyen niyetler okunamadı", { error: error.message });
    return [];
  }
  return (data ?? []).map((row) => ({ id: String(row.id), user_id: String(row.user_id) }));
}

export type SignupIntentHealth = { pending: number; failed: number };

/** Bu süreden eski 'pending' niyet artık normal değil, takılmış demektir. */
const STALE_INTENT_HOURS = 24;

/* Admin gözlemlenebilirliği — takılmış/başarısız niyet sayaçları. Bu sorunu bir daha
   kimse elle keşfetmesin diye admin panelinde uyarı olarak gösterilir. Admin kendi
   oturumuyla okur (RLS "signup intents admin read" policy'si); cron service-role ile.

   'pending' yalnızca 24 saatten eskiler sayılır: yeni kaydolmuş ama e-postasını henüz
   doğrulamamış kullanıcı normal ve geçici olarak beklemededir, uyarı üretmemelidir. */
export async function getSignupIntentHealth(
  client: SupabaseClient<Database> | null,
): Promise<SignupIntentHealth> {
  if (!client) return { pending: 0, failed: 0 };
  const cutoff = new Date(Date.now() - STALE_INTENT_HOURS * 60 * 60_000).toISOString();
  const [pending, failed] = await Promise.all([
    client
      .from("signup_intents")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("created_at", cutoff),
    client.from("signup_intents").select("id", { count: "exact", head: true }).eq("status", "failed"),
  ]);
  return { pending: pending.count ?? 0, failed: failed.count ?? 0 };
}

export type { SignupIntentPayload };

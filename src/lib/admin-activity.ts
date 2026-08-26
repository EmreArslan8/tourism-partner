import { cache } from "react";
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";

/*
 * İşletme hareketleri — admin panelindeki tek görünüm.
 *
 * İki kaynak birleşir:
 *  - session_events  → giriş / çıkış / başarısız giriş (uygulama yazar, bkz. lib/session-log.ts)
 *  - record_changes  → satır değişiklikleri (DB trigger yazar, bkz. public.log_row_change)
 *
 * Admin işlemleri BURADA DEĞİL: onlar audit_logs'ta ve Güvenlik sayfasında listelenir.
 * record_changes admin yazımlarını da yakalar (trigger herkesi görür); actor'ün işletme
 * sahibi olup olmadığına bakarak ayırıyoruz — "kim değiştirdi" sorusunun cevabı bu.
 */

export type ActivityActorKind = "owner" | "admin" | "system";

export type SessionEventItem = {
  id: number;
  event: "login" | "logout" | "login_failed" | "mfa_failed";
  reason: string | null;
  userId: string | null;
  userName: string;
  email: string;
  businessName: string | null;
  ipAddress: string | null;
  createdAt: string;
};

export type RecordChangeItem = {
  id: number;
  tableName: string;
  recordId: string;
  op: "INSERT" | "UPDATE" | "DELETE";
  changedFields: string[];
  actorId: string | null;
  actorName: string;
  actorKind: ActivityActorKind;
  businessId: number | null;
  businessName: string | null;
  createdAt: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
};

export type AdminActivityData = {
  sessions: SessionEventItem[];
  changes: RecordChangeItem[];
  /** Son 24 saatte giriş yapan farklı üye sayısı. */
  activeToday: number;
  /** Son 7 gündeki başarısız giriş denemesi. */
  failedWeek: number;
};

const LIMIT = 200;

export const getAdminActivity = cache(async (): Promise<AdminActivityData> => {
  const empty: AdminActivityData = { sessions: [], changes: [], activeToday: 0, failedWeek: 0 };
  const supabase = await createClient();

  const [sessionsRes, changesRes, profilesRes, businessesRes] = await Promise.all([
    supabase
      .from("session_events")
      .select("id,user_id,email,event,reason,ip_address,created_at")
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    supabase
      .from("record_changes")
      .select("id,table_name,record_id,business_id,op,actor_id,actor_role,changed_fields,old_value,new_value,created_at")
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    supabase.from("profiles").select("id,full_name,role"),
    supabase.from("businesses").select("id,name,owner_id"),
  ]);

  if (sessionsRes.error || changesRes.error) {
    console.error("[admin-activity] okunamadı", {
      sessions: sessionsRes.error?.message,
      changes: changesRes.error?.message,
    });
    return empty;
  }

  const profileById = new Map(
    (profilesRes.data ?? []).map((row) => [
      String(row.id),
      { name: String(row.full_name ?? "").trim(), role: String(row.role ?? "partner") },
    ]),
  );
  const businessById = new Map(
    (businessesRes.data ?? []).map((row) => [
      Number(row.id),
      { name: String(row.name), ownerId: row.owner_id ? String(row.owner_id) : null },
    ]),
  );
  // Üyenin işletmesini oturum satırında gösterebilmek için ters indeks.
  const businessByOwner = new Map<string, string>();
  for (const [, biz] of businessById) {
    if (biz.ownerId && !businessByOwner.has(biz.ownerId)) businessByOwner.set(biz.ownerId, biz.name);
  }

  const sessions: SessionEventItem[] = (sessionsRes.data ?? []).map((row) => {
    const userId = row.user_id ? String(row.user_id) : null;
    return {
      id: Number(row.id),
      event: row.event,
      reason: row.reason ?? null,
      userId,
      userName: (userId && profileById.get(userId)?.name) || "",
      email: row.email ?? "",
      businessName: userId ? businessByOwner.get(userId) ?? null : null,
      ipAddress: row.ip_address ?? null,
      createdAt: row.created_at,
    };
  });

  const changes: RecordChangeItem[] = (changesRes.data ?? []).map((row) => {
    const actorId = row.actor_id ? String(row.actor_id) : null;
    const businessId = row.business_id === null ? null : Number(row.business_id);
    const biz = businessId === null ? null : businessById.get(businessId) ?? null;
    const profile = actorId ? profileById.get(actorId) : undefined;

    // Sahibi mi, admin mi, yoksa cron/service-role mü yaptı?
    let actorKind: ActivityActorKind = "system";
    if (actorId) actorKind = profile?.role === "admin" ? "admin" : "owner";

    return {
      id: Number(row.id),
      tableName: String(row.table_name),
      recordId: String(row.record_id),
      op: row.op,
      changedFields: row.changed_fields ?? [],
      actorId,
      actorName: profile?.name || (actorKind === "system" ? String(row.actor_role ?? "sistem") : ""),
      actorKind,
      businessId,
      businessName: biz?.name ?? null,
      createdAt: row.created_at,
      oldValue: row.old_value,
      newValue: row.new_value,
    };
  });

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const activeToday = new Set(
    sessions
      .filter((s) => s.event === "login" && new Date(s.createdAt).getTime() >= dayAgo)
      .map((s) => s.userId ?? s.email),
  ).size;
  const failedWeek = sessions.filter(
    (s) => s.event === "login_failed" && new Date(s.createdAt).getTime() >= weekAgo,
  ).length;

  return { sessions, changes, activeToday, failedWeek };
});

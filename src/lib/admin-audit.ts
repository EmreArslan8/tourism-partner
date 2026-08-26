import { createClient } from "@/lib/supabase/server";
import { getRequestMeta } from "@/lib/request-meta";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type AdminAuditContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
};

export async function requireAdminContext(): Promise<AdminAuditContext> {
  if (!hasEnv()) throw new Error("Supabase bağlantısı yok.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş gerekli.");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "admin") throw new Error("Admin yetkisi gerekli.");
  return { supabase, userId: user.id };
}

export async function writeAdminAudit(
  context: AdminAuditContext,
  action: string,
  entityType: string,
  entityId: string | number | null,
  newValue?: Record<string, unknown>,
  oldValue?: Record<string, unknown> | null,
) {
  const meta = await getRequestMeta();
  const { error } = await context.supabase.from("audit_logs").insert({
    admin_id: context.userId,
    action,
    entity_type: entityType,
    entity_id: entityId === null ? null : String(entityId),
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
    ...meta,
  });

  if (error) {
    console.error("Audit log yazılamadı:", error.message);
  }
}

import { cache } from "react";
import { createReadOnlyClient as createClient } from "@/lib/supabase/read-only-server";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type AdminAccess = {
  mode: "supabase" | "demo";
  userEmail?: string;
  isAdmin: boolean;
};

export const getAdminAccess = cache(async (): Promise<AdminAccess> => {
  if (!hasEnv()) {
    return { mode: "demo", isAdmin: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { mode: "supabase", isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { mode: "supabase", userEmail: user.email ?? undefined, isAdmin: false };
  }

  return { mode: "supabase", userEmail: user.email ?? undefined, isAdmin: true };
});

export type AdminMfaStatus = {
  enabled: boolean;
  /** Aktif (doğrulanmış) TOTP faktörünün id'si — kaldırma için gerekli. */
  factorId: string | null;
};

/* Admin'in TOTP (2FA) durumunu döner. Doğrulanmış bir faktör varsa 2FA aktiftir. */
export const getAdminMfaStatus = cache(async (): Promise<AdminMfaStatus> => {
  if (!hasEnv()) return { enabled: false, factorId: null };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error || !data) return { enabled: false, factorId: null };
  const verified = data.totp.find((factor) => factor.status === "verified");
  return { enabled: Boolean(verified), factorId: verified?.id ?? null };
});

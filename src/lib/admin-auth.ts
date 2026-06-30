import { cache } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

const hasEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type AdminAccess = {
  mode: "supabase" | "demo";
  userEmail?: string;
  isAdmin: boolean;
};

export const getAdminAccess = cache(async (): Promise<AdminAccess> => {
  const devBypass =
    process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_BYPASS === "1";

  if (!hasEnv()) {
    if (devBypass) {
      await connection();
      return { mode: "demo", userEmail: "demo@admin.local", isAdmin: true };
    }
    return { mode: "demo", isAdmin: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (devBypass) {
      await connection();
      return { mode: "demo", userEmail: "demo@admin.local", isAdmin: true };
    }
    return { mode: "supabase", isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    if (devBypass) {
      await connection();
      return { mode: "demo", userEmail: "demo@admin.local", isAdmin: true };
    }
    return { mode: "supabase", userEmail: user.email ?? undefined, isAdmin: false };
  }

  return { mode: "supabase", userEmail: user.email ?? undefined, isAdmin: true };
});

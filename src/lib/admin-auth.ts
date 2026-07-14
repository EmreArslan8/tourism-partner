import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

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

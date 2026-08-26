import { headers } from "next/headers";

/** Denetim kayıtları için istek üstbilgisi (IP + user agent). */
export async function getRequestMeta(): Promise<{
  ip_address: string | null;
  user_agent: string | null;
}> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return {
    ip_address: forwardedFor || headerList.get("x-real-ip"),
    user_agent: headerList.get("user-agent"),
  };
}

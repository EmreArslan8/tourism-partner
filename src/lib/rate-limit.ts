import { createHash } from "crypto";
import { headers } from "next/headers";

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowSeconds: number;
  identity?: Array<string | number | null | undefined>;
};

const env = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 40);
}

async function requesterIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

async function restFetch(path: string, init: RequestInit = {}) {
  const { url, key } = env();
  if (!url || !key) return null;
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=minimal",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

async function callRateLimitRpc(params: {
  key: string;
  scope: string;
  limit: number;
  windowSeconds: number;
}) {
  const response = await restFetch("rpc/check_rate_limit", {
    method: "POST",
    body: JSON.stringify({
      p_key: params.key,
      p_scope: params.scope,
      p_limit: params.limit,
      p_window_seconds: params.windowSeconds,
    }),
  });
  if (!response?.ok) return null;
  return (await response.json()) === true;
}

function fallbackAllow() {
  return process.env.NODE_ENV !== "production";
}

export async function checkRateLimit(options: RateLimitOptions): Promise<boolean> {
  const { url, key } = env();
  if (!url || !key) return true;

  try {
    const ip = await requesterIp();
    const identity = [ip, ...(options.identity ?? [])]
      .filter((item) => item !== null && item !== undefined && String(item).trim())
      .join("|")
      .slice(0, 800);
    const rowKey = `${options.scope}:${digest(identity)}`;

    const allowed = await callRateLimitRpc({
      key: rowKey,
      scope: options.scope,
      limit: options.limit,
      windowSeconds: options.windowSeconds,
    });
    return allowed ?? fallbackAllow();
  } catch (error) {
    console.warn("[rate-limit] rpc failed", error);
    return fallbackAllow();
  }
}

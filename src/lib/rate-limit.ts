import { createHash } from "crypto";
import { isIP } from "net";
import { headers } from "next/headers";

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowSeconds: number;
  identity?: Array<string | number | null | undefined>;
  identityLimit?: number;
  globalLimit?: number;
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
  const candidates = [
    h.get("x-vercel-forwarded-for"),
    h.get("x-forwarded-for"),
    h.get("x-real-ip"),
  ];
  for (const value of candidates) {
    const address = value?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
    if (address && isIP(address)) return address;
  }
  return "unknown";
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
  if (!url || !key) return fallbackAllow();

  try {
    const ip = await requesterIp();
    const identity = (options.identity ?? [])
      .filter((item) => item !== null && item !== undefined && String(item).trim())
      .join("|")
      .slice(0, 800);
    const dimensions = [
      { name: "ip", value: ip, limit: options.limit },
      ...(identity
        ? [{ name: "identity", value: identity, limit: options.identityLimit ?? options.limit }]
        : []),
      ...(options.globalLimit
        ? [{ name: "global", value: "all", limit: options.globalLimit }]
        : []),
    ];
    const results = await Promise.all(
      dimensions.map((dimension) =>
        callRateLimitRpc({
          key: `${options.scope}:${dimension.name}:${digest(dimension.value)}`,
          scope: `${options.scope}:${dimension.name}`,
          limit: dimension.limit,
          windowSeconds: options.windowSeconds,
        }),
      ),
    );
    if (results.some((allowed) => allowed === null)) return fallbackAllow();
    return results.every(Boolean);
  } catch (error) {
    console.warn("[rate-limit] rpc failed", error);
    return fallbackAllow();
  }
}

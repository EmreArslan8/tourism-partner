import { createHash } from "crypto";
import { headers } from "next/headers";

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowSeconds: number;
  identity?: Array<string | number | null | undefined>;
};

type RateLimitRow = {
  key: string;
  count: number;
  window_start: string;
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
    const now = Date.now();

    const select = await restFetch(`rate_limits?key=eq.${encodeURIComponent(rowKey)}&select=key,count,window_start&limit=1`, {
      headers: { prefer: "" },
    });
    if (!select?.ok) return true;

    const rows = (await select.json()) as RateLimitRow[];
    const row = rows[0];
    if (!row) {
      await restFetch("rate_limits", {
        method: "POST",
        body: JSON.stringify({ key: rowKey, scope: options.scope, count: 1, window_start: new Date(now).toISOString() }),
      });
      return true;
    }

    const windowStart = Date.parse(row.window_start);
    const expired = !Number.isFinite(windowStart) || now - windowStart >= options.windowSeconds * 1000;
    if (expired) {
      await restFetch(`rate_limits?key=eq.${encodeURIComponent(rowKey)}`, {
        method: "PATCH",
        body: JSON.stringify({ count: 1, window_start: new Date(now).toISOString() }),
      });
      return true;
    }

    if (row.count >= options.limit) return false;
    await restFetch(`rate_limits?key=eq.${encodeURIComponent(rowKey)}`, {
      method: "PATCH",
      body: JSON.stringify({ count: row.count + 1 }),
    });
    return true;
  } catch (error) {
    console.warn("[rate-limit] fail-open", error);
    return true;
  }
}

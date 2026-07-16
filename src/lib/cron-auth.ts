import { timingSafeEqual } from "crypto";

type CronAuthorization =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: "unauthorized" | "cron_secret_unavailable" };

function equalSecret(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function authorizeCronRequest(request: Request): CronAuthorization {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return { ok: false, status: 503, error: "cron_secret_unavailable" };

  const authorization = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!equalSecret(authorization, expected)) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  return { ok: true };
}

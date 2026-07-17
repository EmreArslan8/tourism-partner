import { NextResponse } from "next/server";
import { processDueQuoteEmailDeliveries } from "@/lib/email-delivery";
import { authorizeCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const authorization = authorizeCronRequest(request);
  if (!authorization.ok) {
    return NextResponse.json(
      { ok: false, error: authorization.error },
      { status: authorization.status },
    );
  }
  const email = await processDueQuoteEmailDeliveries();
  return NextResponse.json({ email }, { status: email.ok ? 200 : 503 });
}

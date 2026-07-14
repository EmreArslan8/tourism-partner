import { NextResponse } from "next/server";
import { processDueQuoteEmailDeliveries } from "@/lib/email-delivery";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const result = await processDueQuoteEmailDeliveries();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}

import { NextResponse } from "next/server";
import { processDueQuoteEmailDeliveries } from "@/lib/email-delivery";
import { processDueQuoteWhatsappDeliveries } from "@/lib/whatsapp-delivery";
import { authorizeCronRequest } from "@/lib/cron-auth";

export async function GET(request: Request) {
  const authorization = authorizeCronRequest(request);
  if (!authorization.ok) {
    return NextResponse.json(
      { ok: false, error: authorization.error },
      { status: authorization.status },
    );
  }
  // İki kanal bağımsız: WhatsApp düşse bile e-posta teslimatı etkilenmez.
  const [email, whatsapp] = await Promise.all([
    processDueQuoteEmailDeliveries(),
    processDueQuoteWhatsappDeliveries(),
  ]);
  return NextResponse.json({ email, whatsapp }, { status: email.ok && whatsapp.ok ? 200 : 503 });
}

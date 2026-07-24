"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { sendQuoteOffer } from "@/lib/actions/quote-response";
import type { ActionState } from "@/lib/types";
import { PartnerPanelButton, PartnerPanelTextarea } from "../_ui";

/* Gelen teklife serbest-metin fiyat yanıtı. Aksiyon ActionState döndüğü için
   pending/başarı/hata geri bildirimi burada sarmalanır; başarıda server sayfa
   revalidate edilip yanıt "gönderilenler" listesine düşer. */
export default function QuoteReplyForm({ quoteId }: { quoteId: number }) {
  const t = useTranslations("panel");
  const [state, action, pending] = useActionState<ActionState, FormData>(sendQuoteOffer, { ok: false });

  const errorText =
    state.error === "send_failed" ? t("quoteReplyFailedSend")
    : state.error === "missing" ? t("quoteReplyMissing")
    : state.error === "no_recipient" ? t("quoteReplyNoRecipient")
    : state.error ? t("quoteReplyFailed")
    : null;

  return (
    <form action={action} className="mt-3 grid gap-2">
      <input type="hidden" name="quoteId" value={quoteId} />
      <PartnerPanelTextarea
        name="message"
        required
        maxLength={4000}
        placeholder={t("quoteReplyPlaceholder")}
        disabled={pending}
      />
      <div className="flex flex-wrap items-center gap-3">
        <PartnerPanelButton type="submit" disabled={pending} className="h-9 w-fit px-3.5 disabled:opacity-60">
          {pending ? t("quoteReplySending") : t("quoteReplySend")}
        </PartnerPanelButton>
        {state.ok && <span className="text-[12.5px] font-semibold text-emerald-700">{t("quoteReplySent")}</span>}
        {errorText && <span className="text-[12.5px] font-semibold text-red-600">{errorText}</span>}
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createB2bRequest } from "@/lib/actions/b2b";
import type { ActionState } from "@/lib/types";
import { PartnerPanelButton } from "../_ui";

/* "Yeni talep aç" formu — server-render edilen alanlar children olarak gelir;
   burada sadece form + submit + geri bildirim (pending/başarı/hata) sarmalanır.
   Aksiyon void yerine ActionState döndüğü için sessiz başarısızlık biter. */
export default function CreateRequestForm({ children }: { children: React.ReactNode }) {
  const t = useTranslations("panel");
  const [state, action, pending] = useActionState<ActionState, FormData>(createB2bRequest, { ok: false });

  const errorText =
    state.error === "no_business" ? t("requestsNoBusiness")
    : state.error === "forbidden" ? t("requestsForbidden")
    : state.error ? t("requestsFailed")
    : null;

  return (
    <form action={action} className="grid gap-3">
      {children}
      <div className="flex items-center gap-3">
        <PartnerPanelButton type="submit" disabled={pending} className="h-9 w-fit px-3.5 disabled:opacity-60">
          {pending ? t("requestsPublishing") : t("requestsPublish")}
        </PartnerPanelButton>
        {state.ok && <span className="text-[12.5px] font-semibold text-emerald-700">{t("requestsPublished")}</span>}
        {errorText && <span className="text-[12.5px] font-semibold text-red-600">{errorText} <span className="font-mono text-[11px] text-red-400">[{state.error}]</span></span>}
      </div>
    </form>
  );
}

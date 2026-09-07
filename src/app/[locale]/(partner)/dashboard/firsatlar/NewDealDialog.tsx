"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/common/Dialog";
import { createB2bDeal } from "@/lib/actions/deals";
import type { ActionState } from "@/lib/types";
import { PartnerPanelButton } from "../_ui";
import styles from "../styles";

/* "Fırsat ilanı yayınla" — sayfa liste olarak kalsın diye form modalde açılır.
   Alanlar server'dan children olarak gelir (çeviri/kategori verisi orada hazır);
   burada yalnız modal + submit + geri bildirim sarmalanır. */
export default function NewDealDialog({ children }: { children: React.ReactNode }) {
  const t = useTranslations("panel");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(createB2bDeal, { ok: false });

  // Yayınlanınca modal kapanır; yeni ilan alttaki "İlanlarım" listesinde belirir.
  // Render sırasında state'i uyarlama deseni (React: "adjusting state when props
  // change") — effect kullanmadan, yalnız yeni bir aksiyon sonucu geldiğinde çalışır.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.ok) setOpen(false);
  }

  const errorText =
    state.error === "no_business" ? t("requestsNoBusiness")
    : state.error === "forbidden" ? t("requestsForbidden")
    : state.error ? t("dealsFailed")
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={styles.compactPrimaryButton}>
          <Plus size={15} aria-hidden />
          {t("dealsNew")}
        </button>
      </DialogTrigger>
      <DialogContent
        scope="theme-light"
        title={t("dealsNew")}
        description={t("dealsNewHint")}
        className="max-w-[680px] max-h-[86vh] overflow-y-auto"
      >
        <form action={action} className="mt-4 grid gap-3">
          {children}
          <div className="flex items-center gap-3 border-t border-line/70 pt-3">
            <PartnerPanelButton type="submit" disabled={pending} className="h-9 w-fit px-3.5 disabled:opacity-60">
              {pending ? t("dealsPublishing") : t("dealsPublish")}
            </PartnerPanelButton>
            {errorText && (
              <span className="text-[12.5px] font-semibold text-red-600">
                {errorText} <span className="font-mono text-[11px] text-red-400">[{state.error}]</span>
              </span>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

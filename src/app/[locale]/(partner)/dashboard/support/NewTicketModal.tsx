"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/components/common";
import { createSupportTicket } from "@/lib/actions/support";
import { PartnerPanelButton, PartnerPanelField, PartnerPanelTextarea } from "../_ui";

/* "Yeni destek talebi" — zaten talep varken sayfayı formla doldurmamak için
   buton→modal olarak açılır. Gönderince liste revalidate olur, modal kapanır. */
export default function NewTicketModal() {
  const t = useTranslations("panel");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] bg-brand px-3.5 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
      >
        <Plus size={15} aria-hidden /> {t("supportNew")}
      </button>

      <DialogContent title={t("supportNew")} className="max-w-[520px]">
        <form action={createSupportTicket} onSubmit={() => setOpen(false)} className="mt-4 grid gap-2.5">
          <PartnerPanelField name="subject" required maxLength={200} placeholder={t("supportSubjectPlaceholder")} />
          <PartnerPanelTextarea name="message" required rows={4} maxLength={4000} placeholder={t("supportMessagePlaceholder")} />
          <PartnerPanelButton type="submit" className="h-9 w-fit px-3.5">
            <Send size={15} aria-hidden /> {t("supportSubmit")}
          </PartnerPanelButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogTrigger, DialogClose, DialogContent } from "@/components/common/Dialog";
import { cn } from "@/lib/utils";

/* Yeniden kullanılabilir onay modalı — bir server action'ı, kullanıcı onayladıktan
   sonra çalıştırır. Yıkıcı işlemler (kara liste, silme…) için. */
export default function ConfirmAction({
  action,
  fields,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "İptal",
  danger = false,
  trigger,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields?: Record<string, string>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={title} description={description}>
        <form action={action} onSubmit={() => setOpen(false)} className="mt-5 flex justify-end gap-2">
          {fields &&
            Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <DialogClose asChild>
            <button type="button" className="rounded-lg border border-line px-4 py-2 text-[13px] font-semibold text-muted hover:bg-cream">
              {cancelLabel}
            </button>
          </DialogClose>
          <button
            type="submit"
            className={cn(
              "rounded-lg px-4 py-2 text-[13px] font-semibold text-white",
              danger ? "bg-red-600 hover:bg-red-700" : "bg-[#0057D9] hover:bg-[#0047B8]",
            )}
          >
            {confirmLabel}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

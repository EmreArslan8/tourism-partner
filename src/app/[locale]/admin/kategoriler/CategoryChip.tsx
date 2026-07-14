"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogTrigger, DialogClose, DialogContent, ConfirmAction } from "@/components/common";
import { deleteCategory, renameCategory } from "@/lib/actions/platform";
import { adminUi } from "../_ui";

/* Yönetilebilir kategori çipi — düzenle (Dialog) + sil (ConfirmAction). */
export default function CategoryChip({ id, label, locale }: { id: number; label: string; locale: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream/45 py-1 pl-3 pr-1.5 text-[12px] font-bold text-ink/80">
      {label}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="grid h-5 w-5 place-items-center rounded text-muted/60 hover:bg-cream/70 hover:text-brand" title="Düzenle" aria-label="Düzenle">
            <Pencil size={12} aria-hidden />
          </button>
        </DialogTrigger>
        <DialogContent title="Kategoriyi Düzenle">
          <form action={renameCategory} onSubmit={() => setOpen(false)} className="mt-4 grid gap-3">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="locale" value={locale} />
            <input name="label" defaultValue={label} required className={adminUi.input} />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <button type="button" className={adminUi.ghostButton}>İptal</button>
              </DialogClose>
              <button type="submit" className={adminUi.sapphireButton}>Kaydet</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmAction
        action={deleteCategory}
        fields={{ id: String(id), locale }}
        title="Kategoriyi sil"
        description={`"${label}" alt kategorisi silinecek.`}
        confirmLabel="Sil"
        danger
        trigger={
          <button type="button" className="grid h-5 w-5 place-items-center rounded text-muted/60 hover:bg-red-50 hover:text-red-600" title="Sil" aria-label="Sil">
            ×
          </button>
        }
      />
    </span>
  );
}

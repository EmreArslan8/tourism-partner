"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogTrigger, DialogClose, DialogContent, ConfirmAction } from "@/components/common";
import { deleteCategory, renameCategory } from "@/lib/actions/platform";

const input = "field min-h-[42px] w-full rounded-lg border-[#E2E8F0] bg-white normal-case tracking-normal text-[#0B1C30]";

/* Yönetilebilir kategori çipi — düzenle (Dialog) + sil (ConfirmAction). */
export default function CategoryChip({ id, label, locale }: { id: number; label: string; locale: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-[#FBFCFF] py-1 pl-3 pr-1.5 text-[12px] font-bold text-[#3D4B64]">
      {label}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" className="grid h-5 w-5 place-items-center rounded text-[#94A3B8] hover:bg-[#EEF4FF] hover:text-[#0057D9]" title="Düzenle" aria-label="Düzenle">
            <Pencil size={12} aria-hidden />
          </button>
        </DialogTrigger>
        <DialogContent title="Kategoriyi Düzenle">
          <form action={renameCategory} onSubmit={() => setOpen(false)} className="mt-4 grid gap-3">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="locale" value={locale} />
            <input name="label" defaultValue={label} required className={input} />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <button type="button" className="rounded-lg border border-line px-4 py-2 text-[13px] font-semibold text-muted hover:bg-cream">İptal</button>
              </DialogClose>
              <button type="submit" className="rounded-lg bg-[#0057D9] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0047B8]">Kaydet</button>
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
          <button type="button" className="grid h-5 w-5 place-items-center rounded text-[#94A3B8] hover:bg-red-50 hover:text-red-600" title="Sil" aria-label="Sil">
            ×
          </button>
        }
      />
    </span>
  );
}

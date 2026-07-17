"use client";

import { useState } from "react";
import { Check, Lock, Pencil, X } from "lucide-react";

/* Admin formları için görüntüleme/düzenleme sarmalayıcı.
   Varsayılan: kilitli (tüm alanlar disabled). "Düzenle"ye basınca alanlar
   açılır; Kaydet/İptal formun içinde görünür. Alanların tümü tek bir
   <fieldset disabled> ile kilitlenir (display:contents ile grid bozulmaz).
   Not: name'li tüm inputlar children olarak geçmeli; her zaman gönderilmesi
   gereken hidden alanlar için `persistent` kullan (fieldset dışında kalır). */
export default function EditableForm({
  id,
  action,
  className,
  persistent,
  defaultEditing = false,
  children,
}: {
  id?: string;
  action: (formData: FormData) => void | Promise<void>;
  className?: string;
  persistent?: React.ReactNode;
  /** Yeni kayıt formunda doğrudan düzenleme modunda açmak için. */
  defaultEditing?: boolean;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(defaultEditing);

  return (
    <form id={id} action={action} className={className}>
      {persistent}
      <div className="col-span-full flex items-center justify-between gap-3 rounded-[8px] border border-line bg-cream/35 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
          {editing ? (
            <>
              <Pencil size={15} aria-hidden className="text-sapphire" /> Düzenleme açık
            </>
          ) : (
            <>
              <Lock size={15} aria-hidden className="text-muted" /> Görüntüleme modu
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-line px-3 text-[12.5px] font-bold text-ink hover:bg-cream"
              >
                <X size={15} aria-hidden /> İptal
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-[7px] bg-sapphire px-3 text-[12.5px] font-bold text-white hover:bg-sapphire/90"
              >
                <Check size={15} aria-hidden /> Kaydet
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-line bg-white px-3 text-[12.5px] font-bold text-ink hover:bg-cream"
            >
              <Pencil size={15} aria-hidden /> Düzenle
            </button>
          )}
        </div>
      </div>
      <fieldset disabled={!editing} className="contents">
        {children}
      </fieldset>
    </form>
  );
}

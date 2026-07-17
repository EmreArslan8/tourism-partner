"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { CrmFilters } from "@/lib/admin-crm";
import { adminUi } from "../_ui";

type Column = { key: string; label: string };
const DEFAULT_CHECKED = new Set(["name", "address", "phone", "email"]);

/* Export popover — sağ üstteki butona tıklayınca açılır; kolonları seçip indirilir.
   Form GET ile /api/admin/businesses/export'a gider (mevcut filtreler hidden alanlarda). */
const ExportMenu = ({
  filters,
  columns,
  selectedIds = [],
  onOpen,
}: {
  filters: CrmFilters;
  columns: Column[];
  selectedIds?: number[];
  onOpen?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          onOpen?.();
          setOpen((v) => !v);
        }}
        className={adminUi.ghostButton}
        aria-expanded={open}
      >
        <Download size={15} aria-hidden />
        Export
      </button>

      {open && (
        <>
          {/* dışarı tıkla → kapat */}
          <button type="button" aria-hidden className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-[420px] rounded-[10px] border border-line bg-paper p-4 shadow-card">
            <p className="mb-1 text-[14px] font-semibold text-ink">Dışa aktar</p>
            <p className="mb-3 text-[12.5px] text-muted">
              {hasSelection
                ? `${selectedIds.length} seçili işletme indirilecek.`
                : "İşletme seçmezsen mevcut filtrelerdeki kayıtlar indirilir."}
            </p>
            <form action="/api/admin/businesses/export" method="get">
              <input type="hidden" name="q" value={filters.q} />
              <input type="hidden" name="group" value={filters.group} />
              <input type="hidden" name="city" value={filters.city} />
              <input type="hidden" name="status" value={filters.status} />
              {selectedIds.map((id) => (
                <input key={id} type="hidden" name="ids" value={id} />
              ))}

              <div className="grid grid-cols-2 gap-2 text-[13px] font-medium text-ink/80">
                {columns.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 rounded-[7px] border border-line bg-cream/45 px-2.5 py-2">
                    <input name="columns" value={item.key} type="checkbox" defaultChecked={DEFAULT_CHECKED.has(item.key)} className="accent-sapphire" />
                    {item.label}
                  </label>
                ))}
              </div>

              <div className="mt-3">
                <p className="mb-1.5 text-[12.5px] font-semibold text-ink">Dosya biçimi</p>
                <div className="grid grid-cols-2 gap-2 text-[13px] font-medium text-ink/80">
                  <label className="flex items-center gap-2 rounded-[7px] border border-line bg-cream/45 px-2.5 py-2">
                    <input name="format" value="xlsx" type="radio" defaultChecked className="accent-sapphire" />
                    Excel (.xlsx)
                  </label>
                  <label className="flex items-center gap-2 rounded-[7px] border border-line bg-cream/45 px-2.5 py-2">
                    <input name="format" value="csv" type="radio" className="accent-sapphire" />
                    CSV
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={`mt-3 w-full ${adminUi.sapphireButton}`}
              >
                <Download size={15} aria-hidden />
                İndir
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;

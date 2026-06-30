"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { CrmFilters } from "@/lib/admin-crm";

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
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] border border-[#C9D3E5] bg-white px-4 text-[13px] font-bold text-[#0057D9] shadow-[0_1px_2px_rgba(15,23,42,.04)] transition-colors hover:border-[#A9B8D0] hover:bg-[#F8FAFF]"
        aria-expanded={open}
      >
        <Download size={15} aria-hidden />
        Export
      </button>

      {open && (
        <>
          {/* dışarı tıkla → kapat */}
          <button type="button" aria-hidden className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-[420px] rounded-[10px] border border-[#D4DCEA] bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,.18)]">
            <p className="mb-1 text-[14px] font-semibold text-[#0B1C30]">Dışa aktar</p>
            <p className="mb-3 text-[12.5px] text-[#64748B]">
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

              <div className="grid grid-cols-2 gap-2 text-[13px] font-medium text-[#3D4B64]">
                {columns.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 rounded-[7px] border border-[#D4DCEA] bg-[#F8FAFF] px-2.5 py-2">
                    <input name="columns" value={item.key} type="checkbox" defaultChecked={DEFAULT_CHECKED.has(item.key)} className="accent-[#0057D9]" />
                    {item.label}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[7px] bg-[#0057D9] px-4 text-[13px] font-extrabold text-white hover:bg-[#0047B8]"
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

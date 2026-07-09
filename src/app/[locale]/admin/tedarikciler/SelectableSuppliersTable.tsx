"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, ShieldOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ConfirmAction, DataTable, type Column } from "@/components/common";
import ExportMenu from "./ExportMenu";
import { updateBusinessStatus } from "@/lib/actions/admin";
import {
  businessEmail,
  EXPORT_COLUMNS,
  type CrmFilters,
} from "@/lib/admin-crm";
import type { AdminBusiness, BusinessLifecycleStatus, GroupKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const SelectableSuppliersTable = ({
  businesses,
  total,
  filters,
  locale,
}: {
  businesses: AdminBusiness[];
  total: number;
  filters: CrmFilters;
  locale: string;
}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const visibleIds = useMemo(() => businesses.map((business) => business.id), [businesses]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));

  return (
    <section className="overflow-hidden rounded-2xl border border-line/80 bg-paper shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-5 py-4">
        <div>
          <h3 className="text-[16px] font-semibold text-ink">Kayıtlı İşletmeler</h3>
          <p className="mt-0.5 text-[13px] text-muted">
            {selectionMode ? `${selectedIds.length} işletme seçildi` : `${total} işletme listeleniyor`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectionMode && (
            <button
              type="button"
              onClick={() => {
                setSelectionMode(false);
                setSelectedIds([]);
              }}
              className="h-10 rounded-[8px] border border-line bg-paper px-3 text-[13px] font-semibold text-muted hover:bg-cream/50"
            >
              Seçimi kapat
            </button>
          )}
          <ExportMenu filters={filters} columns={EXPORT_COLUMNS} selectedIds={selectedIds} onOpen={() => setSelectionMode(true)} />
        </div>
      </header>

      <DataTable
        data={businesses}
        getRowKey={(b) => b.id}
        empty={
          <div>
            <p className="font-semibold text-ink">DB verisi görünmüyor.</p>
            <p className="mt-1 text-[13px] text-muted">
              Seed/demo fallback kapalı. Supabase bağlantısı yoksa veya businesses tablosunda kayıt yoksa bu tablo boş kalır.
            </p>
          </div>
        }
        minWidth={760}
        columns={[
          ...(selectionMode ? [{
            key: "select",
            header: (
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={(event) => {
                  setSelectedIds((current) => {
                    const next = new Set(current);
                    if (event.target.checked) visibleIds.forEach((id) => next.add(id));
                    else visibleIds.forEach((id) => next.delete(id));
                    return Array.from(next);
                  });
                }}
                className="h-4 w-4 accent-sapphire"
                aria-label="Görünen işletmeleri seç"
              />
            ),
            cell: (business) => (
              <input
                type="checkbox"
                checked={selectedSet.has(business.id)}
                onChange={(event) => {
                  setSelectedIds((current) =>
                    event.target.checked
                      ? Array.from(new Set([...current, business.id]))
                      : current.filter((id) => id !== business.id),
                  );
                }}
                className="h-4 w-4 accent-sapphire"
                aria-label={`${business.name} seç`}
              />
            ),
            className: "w-10",
            headerClassName: "w-10",
          } satisfies Column<AdminBusiness>] : []),
          {
            key: "firm",
            header: "Firma",
            cell: (business) => (
              <div className="min-w-0">
                <Link
                  href={{ pathname: "/admin/tedarikciler/[id]", params: { id: String(business.id) } }}
                  className="block truncate text-[15px] font-semibold leading-6 text-ink hover:text-brand"
                >
                  {business.name}
                </Link>
                <p className="truncate text-[13px] font-normal leading-5 text-muted">{businessEmail(business)}</p>
              </div>
            ),
          },
          { key: "cat", header: "Kategori", cell: (b) => <CategoryPill group={b.group} label={b.type} /> },
          { key: "city", header: "Şehir", cell: (b) => <span className="font-medium text-ink">{b.city}</span> },
          { key: "status", header: "Durum", cell: (b) => <StatusPill status={b.status} /> },
          {
            key: "action",
            header: "Aksiyon",
            align: "right",
            cell: (business) => (
              <div className="flex justify-end gap-1.5">
                <BusinessStatusButton business={business} locale={locale} status={isActive(business.status) ? "suspended" : "approved"} />
                <ConfirmAction
                  action={updateBusinessStatus}
                  fields={{ id: String(business.id), locale, status: "blacklisted" }}
                  title="Kara listeye al"
                  description={`${business.name} kara listeye alınacak; girişi engellenecek ve aramalardan gizlenecek. Bu işlemi sonradan geri alabilirsin.`}
                  confirmLabel="Kara Listeye Al"
                  danger
                  trigger={
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-[8px] border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                      aria-label={`${business.name} kara listeye al`}
                      title="Kara listeye al"
                    >
                      <ShieldOff size={15} aria-hidden />
                    </button>
                  }
                />
              </div>
            ),
          },
        ] satisfies Column<AdminBusiness>[]}
      />

      <footer className="flex flex-wrap items-center justify-between gap-3 bg-paper px-5 py-4">
        <p className="text-[13px] font-medium text-muted">
          Filtrelenmiş {total} işletme, {businesses.length === 0 ? "0" : `${(filters.page - 1) * filters.limit + 1}-${(filters.page - 1) * filters.limit + businesses.length}`} arası gösteriliyor
        </p>
        <div className="flex items-center gap-1.5">
          <PagerButton icon={<ChevronLeft size={15} aria-hidden />} label="Önceki" disabled />
          <PagerButton label="1" active />
          <PagerButton label="2" />
          <PagerButton label="3" />
          <PagerButton icon={<ChevronRight size={15} aria-hidden />} label="Sonraki" />
        </div>
      </footer>
    </section>
  );
};

const CategoryPill = ({ group, label }: { group: GroupKey; label: string }) => {
  const tone = CATEGORY_TONES[group] ?? "bg-slate-100 text-slate-700";
  return <span className={cn("inline-flex max-w-[150px] truncate rounded-full px-2.5 py-1 text-[12px] font-medium leading-5", tone)}>{label}</span>;
};

const StatusPill = ({ status }: { status: BusinessLifecycleStatus }) => {
  const active = isActive(status);
  const label = active ? "Aktif" : status === "pending" ? "Beklemede" : "Pasif";
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium leading-5", active ? "bg-cream text-brand" : status === "pending" ? "bg-gold/20 text-brand" : "bg-cream/70 text-muted")}>
      {label}
    </span>
  );
};

const PagerButton = ({
  label,
  icon,
  active = false,
  disabled = false,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      "grid h-9 min-w-9 place-items-center rounded-[7px] border px-2 text-[13px] font-semibold transition-colors",
      active
        ? "border-sapphire bg-cream text-brand"
        : "border-line bg-paper text-ink/80 hover:border-line hover:bg-cream/45",
      disabled && "cursor-not-allowed opacity-45 hover:border-line hover:bg-paper",
    )}
    aria-label={label}
  >
    {icon ?? label}
  </button>
);

const BusinessStatusButton = ({
  business,
  locale,
  status,
}: {
  business: AdminBusiness;
  locale: string;
  status: BusinessLifecycleStatus;
}) => {
  const hide = status === "suspended";
  return (
    <form action={updateBusinessStatus}>
      <input type="hidden" name="id" value={business.id} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[13px] font-semibold transition-colors",
          hide
            ? "border-line text-muted hover:bg-cream/50"
            : "border-line text-brand hover:bg-cream/70",
        )}
        aria-label={hide ? `${business.name} pasifleştir` : `${business.name} yayına al`}
      >
        {hide ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
        {hide ? "Pasifleştir" : "Yayına Al"}
      </button>
    </form>
  );
};

const CATEGORY_TONES: Record<GroupKey, string> = {
  konaklama: "bg-cream text-brand",
  acente: "bg-cream/70 text-muted",
  ulasim: "bg-cream text-sapphire",
  rehber: "bg-cream/70 text-group-rehber",
  aktivite: "bg-cream text-group-aktivite",
  saglik: "bg-cream/70 text-muted",
  gastronomi: "bg-cream text-group-gastronomi",
};

const isActive = (status: BusinessLifecycleStatus) => status === "approved" || status === "active";

export default SelectableSuppliersTable;

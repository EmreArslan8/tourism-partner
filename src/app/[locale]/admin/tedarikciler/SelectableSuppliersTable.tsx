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
  membershipEndDate,
  membershipFor,
  type CrmFilters,
} from "@/lib/admin-crm";
import type { AdminBusiness, AdminMembership, BusinessLifecycleStatus, GroupKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const SelectableSuppliersTable = ({
  businesses,
  total,
  memberships,
  filters,
  locale,
}: {
  businesses: AdminBusiness[];
  total: number;
  memberships: AdminMembership[];
  filters: CrmFilters;
  locale: string;
}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const visibleIds = useMemo(() => businesses.map((business) => business.id), [businesses]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));

  return (
    <section className="overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_2px_8px_rgba(15,23,42,.04),0_14px_30px_-20px_rgba(15,23,42,.14)]">
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
              className="h-10 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[13px] font-semibold text-[#475569] hover:bg-[#F8FAFC]"
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
            <p className="font-semibold text-[#162238]">DB verisi görünmüyor.</p>
            <p className="mt-1 text-[13px] text-[#64748B]">
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
                className="h-4 w-4 accent-[#0057D9]"
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
                className="h-4 w-4 accent-[#0057D9]"
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
                  className="block truncate text-[15px] font-semibold leading-6 text-[#162238] hover:text-[#0057D9]"
                >
                  {business.name}
                </Link>
                <p className="truncate text-[13px] font-normal leading-5 text-[#64748B]">{businessEmail(business)}</p>
              </div>
            ),
          },
          { key: "cat", header: "Kategori", cell: (b) => <CategoryPill group={b.group} label={b.type} /> },
          { key: "city", header: "Şehir", cell: (b) => <span className="font-medium text-[#162238]">{b.city}</span> },
          { key: "status", header: "Durum", cell: (b) => <StatusPill status={b.status} /> },
          {
            key: "end",
            header: "Üyelik Bitişi",
            cell: (b) => (
              <span className={daysUntil(membershipFor(b.id, memberships)?.endsAt) <= 3 ? "font-medium text-[#E11D48]" : "font-medium text-[#162238]"}>
                {membershipEndDate(b.id, memberships)}
              </span>
            ),
          },
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

      <footer className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4">
        <p className="text-[13px] font-medium text-[#566178]">
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
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium leading-5", active ? "bg-[#EAF1FF] text-[#0057D9]" : status === "pending" ? "bg-[#FFF3E6] text-[#9A5B00]" : "bg-[#F1F5F9] text-[#475569]")}>
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
        ? "border-[#0057D9] bg-[#E8F0FF] text-[#0057D9]"
        : "border-[#D4DCEA] bg-white text-[#3D4B64] hover:border-[#A9B8D0] hover:bg-[#F8FAFF]",
      disabled && "cursor-not-allowed opacity-45 hover:border-[#D4DCEA] hover:bg-white",
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
            ? "border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]"
            : "border-[#BBD0FF] text-[#0057D9] hover:bg-[#F2F6FF]",
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
  konaklama: "bg-[#DDEBFF] text-[#0057D9]",
  acente: "bg-[#E1E7FA] text-[#4A5C8A]",
  ulasim: "bg-[#EAF1FF] text-[#0F3BB0]",
  rehber: "bg-[#EDE9FE] text-[#6D28D9]",
  aktivite: "bg-[#EAF1FF] text-[#1D4ED8]",
  saglik: "bg-[#F1F5F9] text-[#475569]",
  gastronomi: "bg-[#E3EDFF] text-[#2F6FD6]",
};

const isActive = (status: BusinessLifecycleStatus) => status === "approved" || status === "active";

const daysUntil = (value?: string) => {
  if (!value) return Number.POSITIVE_INFINITY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000);
};

export default SelectableSuppliersTable;

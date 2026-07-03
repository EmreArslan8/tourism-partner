import type { AdminBusiness, AdminMembership, BusinessLifecycleStatus, GroupKey } from "@/lib/types";
import { normalizeTr } from "@/lib/utils";

export type CrmFilters = {
  q: string;
  group: GroupKey | "all";
  city: string;
  status: BusinessLifecycleStatus | "all";
  page: number;
  limit: number;
};

export type ExportColumn =
  | "name"
  | "address"
  | "phone"
  | "email"
  | "category"
  | "membership"
  | "status"
  | "website";

export const EXPORT_COLUMNS: Array<{ key: ExportColumn; label: string }> = [
  { key: "name", label: "İsim" },
  { key: "address", label: "Adres" },
  { key: "phone", label: "Telefon" },
  { key: "email", label: "E-posta" },
  { key: "category", label: "Kategori" },
  { key: "membership", label: "Üyelik Bitişi" },
  { key: "status", label: "Durum" },
  { key: "website", label: "Web Sitesi" },
];

const DEFAULT_COLUMNS: ExportColumn[] = ["name", "address", "phone", "email"];

const STATUS_VALUES: BusinessLifecycleStatus[] = [
  "pending",
  "approved",
  "rejected",
  "active",
  "expired",
  "blacklisted",
  "suspended",
];

const GROUP_VALUES: GroupKey[] = ["konaklama", "acente", "ulasim", "rehber", "aktivite", "saglik"];

export function parseCrmFilters(input: Record<string, string | string[] | undefined>): CrmFilters {
  const group = scalar(input.group);
  const status = scalar(input.status);
  return {
    q: scalar(input.q),
    group: GROUP_VALUES.includes(group as GroupKey) ? (group as GroupKey) : "all",
    city: scalar(input.city),
    status: STATUS_VALUES.includes(status as BusinessLifecycleStatus) ? (status as BusinessLifecycleStatus) : "all",
    page: clampInt(scalar(input.page), 1, 9999, 1),
    limit: clampInt(scalar(input.limit), 1, 100, 10),
  };
}

export function parseExportColumns(input: URLSearchParams): ExportColumn[] {
  const requested = input.getAll("columns").filter((value): value is ExportColumn =>
    EXPORT_COLUMNS.some((column) => column.key === value),
  );
  return requested.length > 0 ? requested : DEFAULT_COLUMNS;
}

export function parseExportIds(input: URLSearchParams): number[] {
  return Array.from(new Set(input.getAll("ids")
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value) && value > 0)));
}

export function filterBusinesses(businesses: AdminBusiness[], filters: CrmFilters): AdminBusiness[] {
  const query = normalizeTr(filters.q);
  return businesses.filter((business) => {
    const haystack = normalizeTr([
      business.id,
      business.name,
      business.type,
      business.group,
      business.city,
      business.district,
      business.country,
      business.phone,
      business.website,
    ].filter(Boolean).join(" "));

    if (query && !haystack.includes(query)) return false;
    if (filters.group !== "all" && business.group !== filters.group) return false;
    if (filters.city && business.city !== filters.city) return false;
    if (filters.status !== "all" && business.status !== filters.status) return false;
    return true;
  });
}

export function membershipFor(businessId: number, memberships: AdminMembership[]): AdminMembership | null {
  return memberships.find((membership) => membership.businessId === businessId) ?? null;
}

export function businessEmail(business: AdminBusiness): string {
  const host = business.website?.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  return host ? `info@${host}` : `info@${normalizeTr(business.name).replaceAll(" ", "")}.com`;
}

export function membershipEndDate(businessId: number, memberships: AdminMembership[]): string {
  const membership = membershipFor(businessId, memberships);
  if (!membership) return "Üyelik yok";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(membership.endsAt));
}

export function businessesToCsv(
  businesses: AdminBusiness[],
  memberships: AdminMembership[],
  columns: ExportColumn[],
): string {
  const header = columns.map((column) => labelForColumn(column));
  const rows = businesses.map((business) =>
    columns.map((column) => valueForColumn(business, memberships, column)),
  );
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function cityOptions(businesses: AdminBusiness[]): string[] {
  return Array.from(new Set(businesses.map((business) => business.city).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "tr"),
  );
}

function valueForColumn(
  business: AdminBusiness,
  memberships: AdminMembership[],
  column: ExportColumn,
): string {
  if (column === "name") return business.name;
  if (column === "address") return `${business.district}, ${business.city}, ${business.country}`;
  if (column === "phone") return business.phone ?? "";
  if (column === "email") return businessEmail(business);
  if (column === "category") return `${business.group} / ${business.type}`;
  if (column === "membership") return membershipEndDate(business.id, memberships);
  if (column === "status") return business.status;
  if (column === "website") return business.website ?? "";
  return "";
}

function labelForColumn(column: ExportColumn): string {
  return EXPORT_COLUMNS.find((item) => item.key === column)?.label ?? column;
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function scalar(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function clampInt(value: string, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

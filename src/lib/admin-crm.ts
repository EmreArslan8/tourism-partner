import type { AdminBusiness, BusinessLifecycleStatus, GroupKey } from "@/lib/types";
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
  | "status"
  | "website";

export const EXPORT_COLUMNS: Array<{ key: ExportColumn; label: string }> = [
  { key: "name", label: "İsim" },
  { key: "address", label: "Adres" },
  { key: "phone", label: "Telefon" },
  { key: "email", label: "E-posta" },
  { key: "category", label: "Kategori" },
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

const GROUP_VALUES: GroupKey[] = ["konaklama", "acente", "ulasim", "rehber", "aktivite", "saglik", "gastronomi"];

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

export function businessEmail(business: AdminBusiness): string {
  const host = business.website?.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  return host ? `info@${host}` : `info@${normalizeTr(business.name).replaceAll(" ", "")}.com`;
}

/* Export için başlık + veri satırlarını üretir. CSV ve XLSX çıktıları bunu
   ortak kullanır; böylece sütun/etiket mantığı tek yerde kalır. */
export function businessesToRows(
  businesses: AdminBusiness[],
  columns: ExportColumn[],
  emails: Record<number, string> = {},
): { headers: string[]; rows: string[][] } {
  return {
    headers: columns.map((column) => labelForColumn(column)),
    rows: businesses.map((business) =>
      columns.map((column) => valueForColumn(business, column, emails)),
    ),
  };
}

export function rowsToCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function businessesToCsv(
  businesses: AdminBusiness[],
  columns: ExportColumn[],
  emails: Record<number, string> = {},
): string {
  const { headers, rows } = businessesToRows(businesses, columns, emails);
  return rowsToCsv(headers, rows);
}

export function cityOptions(businesses: AdminBusiness[]): string[] {
  return Array.from(new Set(businesses.map((business) => business.city).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "tr"),
  );
}

function valueForColumn(
  business: AdminBusiness,
  column: ExportColumn,
  emails: Record<number, string>,
): string {
  if (column === "name") return business.name;
  if (column === "address") return `${business.district}, ${business.city}, ${business.country}`;
  if (column === "phone") return business.phone ?? "";
  if (column === "email") return emails[business.id] ?? businessEmail(business);
  if (column === "category") return `${business.group} / ${business.type}`;
  if (column === "status") return business.status;
  if (column === "website") return business.website ?? "";
  return "";
}

function labelForColumn(column: ExportColumn): string {
  return EXPORT_COLUMNS.find((item) => item.key === column)?.label ?? column;
}

function csvCell(value: string): string {
  // CSV formül injection koruması: işletme adı gibi kullanıcı girdisi "=", "+", "-",
  // "@" veya tab/CR ile başlıyorsa Excel/Sheets hücreyi formül olarak çalıştırır.
  // Başa tek tırnak eklenir — hücre metin olarak kalır, admin makinesi korunur.
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${guarded.replaceAll('"', '""')}"`;
}

function scalar(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function clampInt(value: string, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

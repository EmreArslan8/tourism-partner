import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

/* Config tabanlı veri tablosu — admin tabloları tek bileşenden beslenir.
   Boşluk/hover/başlık stili tek yerde; her sayfada <table> tekrar yazılmaz. */
export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  empty,
  minWidth = 640,
  className,
}: {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string | number;
  empty?: ReactNode;
  minWidth?: number;
  className?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-[14px] text-muted">
        {empty ?? "Kayıt yok."}
      </div>
    );
  }

  const alignCls = (a?: "left" | "right" | "center") =>
    a === "right" ? "text-end" : a === "center" ? "text-center" : "text-start";

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-separate border-spacing-0 text-start" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line bg-[#F8FAFC]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn("px-5 py-3 text-[13px] font-semibold text-muted", alignCls(c.align), c.headerClassName)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={getRowKey(row, i)} className="h-[52px] border-b border-line/70 last:border-0 hover:bg-[#F8FAFC]">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-5 py-2 text-[14px] text-ink", alignCls(c.align), c.className)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

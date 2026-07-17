import { parseCrmFilters, parseExportColumns, parseExportIds } from "@/lib/admin-crm";
import { exportCrmBusinesses, exportCrmBusinessesXlsx } from "@/lib/admin-crm-data";
import { requireAdminContext, writeAdminAudit } from "@/lib/admin-audit";

export async function GET(request: Request) {
  let context;
  try {
    context = await requireAdminContext();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const filters = parseCrmFilters(Object.fromEntries(url.searchParams.entries()));
  const columns = parseExportColumns(url.searchParams);
  const ids = parseExportIds(url.searchParams);
  const format = url.searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  const date = new Date().toISOString().slice(0, 10);

  await writeAdminAudit(context, "business.export", "business", null, {
    filters,
    columns,
    format,
    selected_count: ids.length,
  });

  if (format === "xlsx") {
    const buffer = await exportCrmBusinessesXlsx(filters, columns, ids);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": `attachment; filename="isletmeler-${date}.xlsx"`,
        "cache-control": "no-store, max-age=0",
      },
    });
  }

  const csv = await exportCrmBusinesses(filters, columns, ids);
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="isletmeler-${date}.csv"`,
      "cache-control": "no-store, max-age=0",
    },
  });
}

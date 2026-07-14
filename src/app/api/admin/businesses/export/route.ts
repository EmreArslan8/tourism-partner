import { parseCrmFilters, parseExportColumns, parseExportIds } from "@/lib/admin-crm";
import { exportCrmBusinesses } from "@/lib/admin-crm-data";
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
  const csv = await exportCrmBusinesses(filters, columns, ids);
  await writeAdminAudit(context, "business.export", "business", null, {
    filters,
    columns,
    selected_count: ids.length,
  });

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="isletmeler-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store, max-age=0",
    },
  });
}

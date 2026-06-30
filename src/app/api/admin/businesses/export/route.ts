import { getAdminAccess } from "@/lib/admin-auth";
import { parseCrmFilters, parseExportColumns, parseExportIds } from "@/lib/admin-crm";
import { exportCrmBusinesses } from "@/lib/admin-crm-data";

export async function GET(request: Request) {
  const access = await getAdminAccess();
  if (!access.isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const filters = parseCrmFilters(Object.fromEntries(url.searchParams.entries()));
  const columns = parseExportColumns(url.searchParams);
  const ids = parseExportIds(url.searchParams);
  const csv = await exportCrmBusinesses(filters, columns, ids);

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="isletmeler-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

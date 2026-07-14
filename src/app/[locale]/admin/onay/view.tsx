import { PageHeader } from "../_components";
import ApprovalBoard from "./ApprovalBoard";
import { updateApplicationStatus } from "@/lib/actions/admin";
import type { AdminApplication, AdminBusiness } from "@/lib/types";

interface Props {
  applications: AdminApplication[];
  businesses: AdminBusiness[];
  locale: string;
}

const ApprovalsView = ({ applications, businesses, locale }: Props) => {
  return (
    <>
      <PageHeader
        eyebrow="Onay"
        title="Başvurular (Onay Havuzu)"
        description="Tedarikçi ve acente kayıtlarını evraklarıyla inceleyin; onaylayın veya reddedin."
      />
      <ApplicationsPanel applications={applications} locale={locale} />
      <ApprovalBoard businesses={businesses} locale={locale} />
    </>
  );
};

const ApplicationsPanel = ({ applications, locale }: { applications: AdminApplication[]; locale: string }) => {
  const pending = applications.filter((application) => application.status === "pending");
  const recent = applications.filter((application) => application.status !== "pending").slice(0, 8);
  const rows = [...pending, ...recent];

  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-line bg-paper shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h3 className="text-[16px] font-bold text-ink">Organik Başvurular</h3>
          <p className="mt-0.5 text-[13px] text-muted">
            `applications` tablosundan gelen kayıtlar. Bekleyenler üstte listelenir.
          </p>
        </div>
        <span className="rounded-full bg-cream/70 px-3 py-1 text-[12px] font-extrabold text-brand">
          {pending.length} bekleyen
        </span>
      </header>

      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] font-semibold text-muted/60">Başvuru kaydı yok.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-separate border-spacing-0 text-left text-[13px]">
            <thead className="bg-cream/45 text-[11px] font-extrabold uppercase tracking-[.08em] text-muted">
              <tr>
                <th className="border-b border-line px-4 py-3">Firma</th>
                <th className="border-b border-line px-4 py-3">İletişim</th>
                <th className="border-b border-line px-4 py-3">Kategori</th>
                <th className="border-b border-line px-4 py-3">Durum</th>
                <th className="border-b border-line px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((application) => (
                <tr key={application.id} className="hover:bg-cream/45">
                  <td className="border-b border-line px-4 py-3">
                    <p className="font-extrabold text-ink">{application.name}</p>
                    <p className="mt-0.5 text-[12px] font-semibold text-muted">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(application.createdAt))}
                    </p>
                  </td>
                  <td className="border-b border-line px-4 py-3 text-muted">
                    <p className="font-semibold">{application.email}</p>
                    <p className="mt-0.5 text-[12px]">{application.phone ?? application.contactPerson ?? "-"}</p>
                  </td>
                  <td className="border-b border-line px-4 py-3 text-muted">
                    {application.categoryLabel ?? application.group ?? "-"}
                  </td>
                  <td className="border-b border-line px-4 py-3">
                    <span className="rounded-full bg-cream/70 px-2.5 py-1 text-[12px] font-bold text-muted">
                      {application.status}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {application.status !== "approved" && <ApplicationStatusButton id={application.id} locale={locale} status="approved" label="Onayla" />}
                      {application.status !== "rejected" && <ApplicationStatusButton id={application.id} locale={locale} status="rejected" label="Reddet" danger />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const ApplicationStatusButton = ({
  id,
  locale,
  status,
  label,
  danger = false,
}: {
  id: number;
  locale: string;
  status: "approved" | "rejected";
  label: string;
  danger?: boolean;
}) => (
  <form action={updateApplicationStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="status" value={status} />
    <button
      type="submit"
      className={
        "rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors " +
        (danger
          ? "border-red-300 text-red-700 hover:bg-red-50"
          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50")
      }
    >
      {label}
    </button>
  </form>
);

export default ApprovalsView;

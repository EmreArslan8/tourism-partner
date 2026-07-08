import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BusinessForm, panel } from "../../_components";
import { AdminPageHeader, adminUi } from "../../_ui";
import { renewBusinessMembership, updateBusinessStatus } from "@/lib/actions/admin";
import { getCrmBusinessDetail } from "@/lib/admin-crm-data";
import { businessEmail } from "@/lib/admin-crm";
import type { BusinessLifecycleStatus } from "@/lib/types";

export default async function AdminBusinessDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const data = await getCrmBusinessDetail(Number(id));
  const business = data.business;
  if (!business) notFound();

  const membership = data.membership;

  return (
    <>
      <Link href="/admin/tedarikciler" className="mb-2 inline-flex text-[12px] font-medium text-brand hover:underline">
        İşletmeler CRM
      </Link>
      <AdminPageHeader
        title={business.name}
        description={`${business.type} · ${business.city}, ${business.district} · ${businessEmail(business)}`}
        action={
          <div className="flex flex-wrap gap-2">
            <StatusForm id={business.id} locale={locale} status={business.status === "blacklisted" ? "approved" : "blacklisted"} label={business.status === "blacklisted" ? "Blacklist Kaldır" : "Blacklist"} danger={business.status !== "blacklisted"} />
            <StatusForm id={business.id} locale={locale} status={business.status === "approved" || business.status === "active" ? "suspended" : "approved"} label={business.status === "approved" || business.status === "active" ? "Askıya Al" : "Aktif Et"} />
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className={panel}>
          <h3 className="mb-4 text-[20px] font-medium text-ink">Profil Düzenleme</h3>
          <BusinessForm locale={locale} business={business} />
        </section>

        <aside className="grid content-start gap-6">
          <section className={panel}>
            <h3 className="text-[18px] font-medium text-ink">Üyelik</h3>
            <dl className="mt-4 grid gap-3 text-[13px]">
              <Info label="Plan" value={membership?.plan ?? "Yok"} />
              <Info label="Durum" value={membership?.status ?? "Yok"} />
              <Info label="Bitiş" value={membership ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(membership.endsAt)) : "Üyelik yok"} />
            </dl>
            <form action={renewBusinessMembership} className="mt-4">
              <input type="hidden" name="businessId" value={business.id} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="plan" value={membership?.plan ?? "standard"} />
              <input type="hidden" name="days" value="365" />
              <button type="submit" className={`w-full ${adminUi.sapphireButton}`}>
                1 Yıl Uzat
              </button>
            </form>
          </section>

          <section className={panel}>
            <h3 className="text-[18px] font-medium text-ink">Operasyon Bilgileri</h3>
            <dl className="mt-4 grid gap-3 text-[13px]">
              <Info label="Durum" value={business.status} />
              <Info label="Sponsor" value={business.sponsored ? "Evet" : "Hayır"} />
              <Info label="Doğrulama" value={business.verified ? "Doğrulanmış" : "Doğrulanmamış"} />
              <Info label="Web" value={business.website ?? "-"} />
              <Info label="Telefon" value={business.phone ?? "-"} />
            </dl>
          </section>

          <section className={panel}>
            <h3 className="text-[18px] font-medium text-ink">Yetkili Kişiler</h3>
            <div className="mt-4 grid gap-2">
              {data.contacts.length === 0 ? (
                <p className="text-[13px] font-semibold text-muted">Bu işletme için yetkili kişi kaydı yok.</p>
              ) : (
                data.contacts.map((contact) => (
                  <div key={contact.id} className="rounded-[8px] border border-line bg-cream/45 px-3 py-2">
                    <p className="text-[13px] font-extrabold text-ink">
                      {contact.fullName}
                      {contact.title && <span className="font-semibold text-muted"> · {contact.title}</span>}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-muted">
                      {[contact.phone, contact.email].filter(Boolean).join(" · ") || "İletişim bilgisi yok"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={panel}>
            <h3 className="text-[18px] font-medium text-ink">Son Audit Kayıtları</h3>
            <div className="mt-4 grid gap-2">
              {data.auditLogs.length === 0 ? (
                <p className="text-[13px] font-semibold text-muted">Bu işletme için audit kaydı yok.</p>
              ) : (
                data.auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="rounded-[8px] border border-line bg-cream/45 px-3 py-2">
                    <p className="text-[12px] font-extrabold text-ink">{log.action}</p>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(new Date(log.createdAt))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

const StatusForm = ({
  id,
  locale,
  status,
  label,
  danger = false,
}: {
  id: number;
  locale: string;
  status: BusinessLifecycleStatus;
  label: string;
  danger?: boolean;
}) => (
  <form action={updateBusinessStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="status" value={status} />
    <button
      type="submit"
      className={`h-10 rounded-[8px] px-4 text-[13px] font-medium ${
        danger
          ? "border border-red-200 bg-paper text-red-600 hover:bg-red-50"
          : "border border-line bg-paper text-brand hover:bg-cream"
      }`}
    >
      {label}
    </button>
  </form>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[8px] border border-line bg-cream/45 px-3 py-2">
    <dt className="text-[11px] font-medium uppercase tracking-[.08em] text-muted">{label}</dt>
    <dd className="mt-1 break-words font-medium text-ink">{value}</dd>
  </div>
);

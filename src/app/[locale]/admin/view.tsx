import { Link, type Href } from "@/i18n/navigation";
import { Metric, PageHeader } from "./_components";
import styles from "./styles";
import type { AdminData } from "@/lib/types";

interface Props {
  data: AdminData;
}

const AdminView = ({ data }: Props) => {
  const pendingBusinesses = data.businesses.filter((b) => b.status === "pending");
  const pendingApplications = data.applications.filter((a) => a.status === "pending");
  const newQuotes = data.quotes.filter((q) => q.status === "new");
  const activeBusinesses = data.businesses.filter((b) => b.status === "approved" || b.status === "active");
  const expiringMemberships = data.memberships.filter((membership) => {
    const now = startOfToday();
    const endsAt = new Date(membership.endsAt);
    const limit = new Date(now);
    limit.setDate(limit.getDate() + 14);
    return membership.status !== "expired" && endsAt >= now && endsAt <= limit;
  });
  const expiredMemberships = data.memberships.filter((membership) =>
    membership.status === "expired" || new Date(membership.endsAt) < startOfToday()
  );
  const approvalCount = pendingApplications.length + pendingBusinesses.length;

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Bugünün işleri"
        description="Sadece müdahale gerektiren başlıklar. Detaylar ilgili modül sayfalarında."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/tedarikciler" className="btn btn-solid btn-sm">+ Yeni işletme</Link>
            <Link href="/admin/onay" className="btn btn-outline btn-sm">Onay kuyruğu</Link>
          </div>
        }
      />

      <section className={styles.statsGrid}>
        <Metric title="Aktif firma" value={activeBusinesses.length} hint={`${data.businesses.length} toplam kayıt`} />
        <Metric title="Onay bekleyen" value={approvalCount} hint="başvuru ve firma" />
        <Metric title="Yeni talep" value={newQuotes.length} hint="işlem bekliyor" />
        <Metric title="Üyelik uyarısı" value={expiringMemberships.length + expiredMemberships.length} hint="biten veya yaklaşan" />
      </section>

      <section className={styles.actionGrid}>
        <ActionCard
          href="/admin/onay"
          label="Onay"
          title="Başvuruları incele"
          value={approvalCount}
          detail="Yeni firma ve üyelik başvuruları"
        />
        <ActionCard
          href="/admin/teklifler"
          label="Talepler"
          title="Yeni talepleri yönet"
          value={newQuotes.length}
          detail="Cevap veya durum güncellemesi bekleyenler"
        />
        <ActionCard
          href="/admin/tedarikciler"
          label="Üyelik"
          title="Üyelikleri kontrol et"
          value={expiringMemberships.length + expiredMemberships.length}
          detail="Biten veya 14 gün içinde bitecek firmalar"
        />
      </section>
    </>
  );
};

const ActionCard = ({
  href,
  label,
  title,
  value,
  detail,
}: {
  href: Href;
  label: string;
  title: string;
  value: number;
  detail: string;
}) => (
  <Link href={href} className={styles.actionCard}>
    <span className={styles.actionLabel}>{label}</span>
    <strong>{title}</strong>
    <span>{detail}</span>
    <b>{value}</b>
  </Link>
);

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export default AdminView;

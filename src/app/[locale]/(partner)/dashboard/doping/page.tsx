import { setRequestLocale } from "next-intl/server";
import { Rocket, Crown, Clock, Check } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard, PartnerPanelEmptyState } from "../_ui";

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));

// Date.now() render dışında (modül fonksiyonu) — purity lint'i tetiklemesin (bkz. lib/listing.ts).
const isDopingActive = (until: string | null | undefined) => !!until && new Date(until).getTime() > Date.now();

export default async function DopingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPanelSession();
  if (!session) redirect({ href: "/login", locale });
  const biz = await getPanelBusiness();

  const dopingActive = isDopingActive(biz?.doping_until);
  const premium = !!biz?.sponsored;

  return (
    <>
      <DashboardTopbar title="Doping" />
      <div className={styles.content}>
      <header className="mb-7 max-w-[680px]">
        <p className={styles.pageEyebrow}>Doping</p>
        <h1 className={styles.pageTitle}>Öne çıkarma durumu</h1>
        <p className={styles.pageDesc}>Doping, işletmenizi arama sonuçlarında üst sıralara taşır. Aşağıda mevcut durumunuzu görebilirsiniz.</p>
      </header>

      {!biz ? (
        <PartnerPanelEmptyState
          title="Önce firma profilinizi oluşturun"
          action={<Link href="/dashboard/listings" className={styles.compactPrimaryButton}>İlan yönetimine git</Link>}
        />
      ) : (
        <div className="grid gap-4">
          {/* Mevcut durum */}
          <PartnerPanelCard bodyClassName="p-5" className={dopingActive || premium ? "border-[#BFD2F2] bg-[#F8FBFF]" : ""}>
            <div className="flex items-center gap-2.5">
              <Rocket size={18} className={dopingActive || premium ? "text-[#1557C2]" : "text-[#667085]"} aria-hidden />
              <h2 className="text-[15px] font-medium text-[#172033]">Güncel durum</h2>
            </div>
            {premium ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-[#1557C2]"><Crown size={16} aria-hidden /> Premium Partner — kalıcı öne çıkarma aktif</p>
            ) : dopingActive ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-[#1557C2]">
                <Clock size={16} aria-hidden /> Doping aktif — {fmt(biz.doping_until!)} tarihine kadar
              </p>
            ) : (
              <p className="mt-3 text-[14px] font-semibold text-muted">Şu an aktif doping yok. İşletmeniz organik sırada listeleniyor.</p>
            )}
          </PartnerPanelCard>

          {/* Doping türleri (Brief §9 / El Kitabı §6) */}
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <PartnerPanelCard bodyClassName="p-4">
              <h3 className="inline-flex items-center gap-2 text-[14px] font-medium text-[#172033]"><Crown size={15} className="text-[#1557C2]" aria-hidden /> Premium Partner Dopingi</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">Ücretli, kalıcı öne çıkarma. Arama sonuçlarında sürekli üst sıralarda listelenir ve kurumsal görünürlük sağlar.</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">{premium ? <><Check size={14} className="text-emerald-600" aria-hidden /> Aktif</> : "Talep için destek ile iletişime geçin"}</p>
            </PartnerPanelCard>
            <PartnerPanelCard bodyClassName="p-4">
              <h3 className="inline-flex items-center gap-2 text-[14px] font-medium text-[#172033]"><Rocket size={15} className="text-[#1557C2]" aria-hidden /> Hoş Geldin Dopingi</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">Yeni onaylanan her işletmeye otomatik verilen 24 saatlik öne çıkarma. Ek işlem gerektirmez.</p>
              <p className="mt-2 text-[12.5px] font-semibold text-ink">Onay anında otomatik uygulanır</p>
            </PartnerPanelCard>
          </div>

          <div className="rounded-[10px] border border-dashed border-[#DDE6F2] bg-[#F8FBFF] p-4 text-[13px] text-[#667085]">
            Premium doping satın almak veya süreli paket talep etmek için{" "}
            <Link href="/dashboard/support" className="font-medium text-[#1557C2] hover:underline">destek talebi</Link> oluşturabilirsiniz.
            Ödeme altyapısı ilk fazda panel dışında, ekibimizle iletişim üzerinden yürütülür.
          </div>
        </div>
      )}
      </div>
    </>
  );
}

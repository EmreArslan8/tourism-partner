import { Building2, CalendarClock, CircleX, ShieldCheck } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import { Link } from "@/i18n/navigation";
import { getPublicBusinessInvite } from "@/lib/business-owner-invites";
import BusinessInviteForm from "./BusinessInviteForm";

export default async function BusinessInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const token = Array.isArray(query.token) ? query.token[0] : query.token;
  const invite = token ? await getPublicBusinessInvite(token) : null;

  return (
    <AuthShell>
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center px-5 py-8 sm:px-8 lg:px-12">
        <main className="my-auto w-full max-w-[560px]">
          <div className="mb-7 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-brand text-white shadow-[0_12px_24px_-14px_rgba(15,59,176,.75)]">
              <Building2 size={23} aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-brand/70">Güvenli işletme teslimi</p>
              <h1 className="mt-1 text-[29px] font-extrabold leading-tight tracking-tight text-ink sm:text-[34px]">
                {invite?.businessName ?? "İşletme daveti"}
              </h1>
            </div>
          </div>

          {!invite ? (
            <StateCard icon={<CircleX size={24} aria-hidden />} title="Davet bulunamadı" description="Bağlantı eksik veya geçersiz. İşletme yöneticisinden yeni bir davet bağlantısı isteyin." />
          ) : invite.status === "expired" ? (
            <StateCard icon={<CalendarClock size={24} aria-hidden />} title="Davet süresi doldu" description="Bu güvenli bağlantı artık kullanılamıyor. İşletme yöneticisi admin panelinden yeni bir davet gönderebilir." />
          ) : invite.status === "revoked" ? (
            <StateCard icon={<CircleX size={24} aria-hidden />} title="Davet iptal edildi" description="Bu davet yönetici tarafından iptal edilmiş. Yeni bir davet bağlantısı istemeniz gerekiyor." />
          ) : invite.status === "accepted" ? (
            <div className="grid gap-5 rounded-[14px] border border-emerald-200 bg-emerald-50/75 p-6">
              <ShieldCheck size={30} className="text-emerald-700" aria-hidden />
              <div><h2 className="text-[20px] font-extrabold text-ink">İşletme teslim alındı</h2><p className="mt-2 text-[14px] font-semibold leading-6 text-muted">Bu davet daha önce kullanılmış. İşletme sahibi hesabınızla panele geçebilirsiniz.</p></div>
              <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-[9px] bg-brand px-5 text-[13px] font-extrabold text-white">Panele git</Link>
            </div>
          ) : (
            <section className="rounded-[15px] border border-line bg-paper p-5 shadow-[0_24px_60px_-38px_rgba(23,32,51,.45)] sm:p-7">
              <div className="mb-6 border-b border-line pb-5">
                <p className="text-[15px] font-bold leading-6 text-ink">Bu işletmenin yönetim yetkisi size gönderildi.</p>
                <p className="mt-1.5 text-[13px] font-semibold leading-5 text-muted">Hesabınızla giriş yapın veya yeni hesap oluşturun. İşletme kaydı yeniden oluşturulmadan doğrudan panelinize bağlanacak.</p>
              </div>
              <BusinessInviteForm invite={invite} locale={locale} token={token ?? ""} />
            </section>
          )}
        </main>
        </div>
      </div>
    </AuthShell>
  );
}

function StateCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-[14px] border border-amber-200 bg-amber-50/75 p-6">
      <span className="text-amber-700">{icon}</span>
      <h2 className="mt-4 text-[20px] font-extrabold text-ink">{title}</h2>
      <p className="mt-2 text-[14px] font-semibold leading-6 text-muted">{description}</p>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import { Star, Inbox, PenLine } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPanelSession, getPanelBusiness } from "@/lib/panel-auth";
import { deleteReview } from "@/lib/actions/reviews";
import DashboardTopbar from "../Topbar";
import styles from "../styles";
import { PartnerPanelCard } from "../_ui";

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(v));
const bizName = (r: { name: string } | { name: string }[] | null) => (Array.isArray(r) ? r[0]?.name : r?.name) ?? "—";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={13} className={n <= value ? "fill-star text-star" : "text-line"} aria-hidden />
      ))}
    </span>
  );
}

type Row = { id: number; rating: number; comment: string | null; created_at: string; businesses: { name: string } | { name: string }[] | null };

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPanelSession();
  if (!session) redirect({ href: "/login", locale });
  const biz = await getPanelBusiness();

  const supabase = await createClient();
  const [{ data: receivedRaw }, { data: writtenRaw }] = await Promise.all([
    biz
      ? supabase
          .from("reviews")
          .select("id,rating,comment,created_at,businesses:businesses!reviews_author_business_id_fkey(name)")
          .eq("business_id", biz.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as Row[] }),
    supabase
      .from("reviews")
      .select("id,rating,comment,created_at,businesses:businesses!reviews_business_id_fkey(name)")
      .eq("author_id", session!.userId)
      .order("created_at", { ascending: false }),
  ]);

  const received = (receivedRaw ?? []) as unknown as Row[];
  const written = (writtenRaw ?? []) as unknown as Row[];

  return (
    <>
      <DashboardTopbar title="Değerlendirmeler" />
      <div className={styles.content}>
      <header className="mb-7 max-w-[680px]">
        <p className={styles.pageEyebrow}>Değerlendirmeler</p>
        <h1 className={styles.pageTitle}>Puanlar ve yorumlar</h1>
        <p className={styles.pageDesc}>İşletmeniz hakkında bırakılan değerlendirmeleri görün; iş birliği yaptığınız firmalara yazdığınız yorumları yönetin.</p>
      </header>

      <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
        {/* Hakkımda gelen */}
        <PartnerPanelCard bodyClassName="p-5">
          <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><Inbox size={17} className="text-[#1557C2]" aria-hidden /> İşletmem hakkında ({received.length})</h2>
          {received.length === 0 ? (
            <p className="text-[13px] text-muted">Henüz değerlendirme almadınız.</p>
          ) : (
            <ul className="grid gap-3">
              {received.map((r) => (
                <li key={r.id} className={styles.softPanel}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13.5px] font-bold text-ink">{bizName(r.businesses)}</span>
                    <Stars value={r.rating} />
                  </div>
                  {r.comment && <p className="mt-1.5 text-[13px] leading-5 text-ink/80">{r.comment}</p>}
                  <p className="mt-1 text-[11.5px] font-medium text-muted">{fmt(r.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </PartnerPanelCard>

        {/* Yazdıklarım */}
        <PartnerPanelCard bodyClassName="p-5">
          <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#172033]"><PenLine size={17} className="text-[#1557C2]" aria-hidden /> Yazdığım yorumlar ({written.length})</h2>
          {written.length === 0 ? (
            <p className="text-[13px] text-muted">Henüz yorum yazmadınız. İşletme profillerinden değerlendirme bırakabilirsiniz.</p>
          ) : (
            <ul className="grid gap-3">
              {written.map((r) => (
                <li key={r.id} className={styles.softPanel}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[13.5px] font-bold text-ink">{bizName(r.businesses)}</span>
                      <div className="mt-0.5"><Stars value={r.rating} /></div>
                    </div>
                    <form action={deleteReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-[11.5px] font-semibold text-muted hover:border-red-400 hover:text-red-600">Sil</button>
                    </form>
                  </div>
                  {r.comment && <p className="mt-1.5 text-[13px] leading-5 text-ink/80">{r.comment}</p>}
                  <p className="mt-1 text-[11.5px] font-medium text-muted">{fmt(r.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </PartnerPanelCard>
      </div>
      </div>
    </>
  );
}

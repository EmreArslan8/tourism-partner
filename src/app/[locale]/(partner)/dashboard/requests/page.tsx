import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Megaphone, Inbox, Send, Eye } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";
import { createB2bRequest, submitB2bOffer, closeMyB2bRequest } from "@/lib/actions/b2b";
import B2bViewTracker from "@/components/B2bViewTracker";

const groupLabel = (g: string | null) => CATEGORY_GROUPS.find((c) => c.key === g)?.label ?? null;

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(v));
const bizName = (r: { name: string } | { name: string }[] | null) =>
  (Array.isArray(r) ? r[0]?.name : r?.name) ?? "—";

type Req = { id: number; title: string; description: string | null; region: string | null; status: string; view_count: number; created_at: string };

export default async function RequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/login", locale });

  const { data: biz } = await supabase
    .from("businesses")
    .select("id,name,group,city,country")
    .eq("owner_id", user!.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  const panelHref = locale === "tr" ? "/tr/panel" : "/en/dashboard";

  if (!biz) {
    return (
      <main className="container-px mx-auto w-full max-w-[900px] py-12">
        <div className="rounded-[16px] border border-dashed border-line bg-paper px-6 py-14 text-center">
          <p className="text-[15px] font-bold text-ink">Önce firma profilinizi oluşturun</p>
          <p className="mt-1.5 text-[13.5px] text-muted">Talep açıp teklif verebilmek için önce işletme kaydınızı tamamlayın.</p>
          <a href={panelHref} className="btn btn-solid btn-sm mt-4 inline-flex">Panele git</a>
        </div>
      </main>
    );
  }

  const [{ data: myReqRaw }, { data: openReqRaw }, { data: myOffersRaw }] = await Promise.all([
    supabase.from("b2b_requests").select("id,title,description,region,status,view_count,created_at").eq("business_id", biz.id).order("created_at", { ascending: false }),
    supabase.from("b2b_requests").select("id,title,description,region,target_group,status,view_count,created_at,business_id,businesses(name)").eq("status", "published").neq("business_id", biz.id).order("created_at", { ascending: false }).limit(80),
    supabase.from("b2b_offers").select("request_id").eq("business_id", biz.id),
  ]);

  const myReq = (myReqRaw ?? []) as Req[];
  const myReqIds = myReq.map((r) => r.id);
  const { data: offersRaw } = myReqIds.length
    ? await supabase.from("b2b_offers").select("id,request_id,message,price,created_at,businesses(name)").in("request_id", myReqIds).order("created_at", { ascending: false })
    : { data: [] as unknown[] };

  type Offer = { id: number; request_id: number; message: string; price: string | null; created_at: string; businesses: { name: string } | { name: string }[] | null };
  const offersByReq = new Map<number, Offer[]>();
  for (const o of (offersRaw ?? []) as Offer[]) {
    (offersByReq.get(o.request_id) ?? offersByReq.set(o.request_id, []).get(o.request_id)!).push(o);
  }
  const offered = new Set(((myOffersRaw ?? []) as { request_id: number }[]).map((o) => o.request_id));

  // Açık ilanları tedarikçiye göre filtrele (Brief §7: "ilgili bölgedeki işletmeler"):
  // hedef kategori boş veya benim grubumla eşleşmeli; bölge boş veya şehrim/ülkemle örtüşmeli.
  type OpenReq = Req & { target_group: GroupKey | null; business_id: number; businesses: { name: string } | { name: string }[] | null };
  const myGroup = biz.group as GroupKey;
  const myCity = (biz.city ?? "").toLocaleLowerCase("tr");
  const myCountry = (biz.country ?? "").toLocaleLowerCase("tr");
  const openReq = ((openReqRaw ?? []) as unknown as OpenReq[]).filter((r) => {
    const groupOk = !r.target_group || r.target_group === myGroup;
    const reg = (r.region ?? "").toLocaleLowerCase("tr");
    const regionOk = !reg || (!!myCity && (reg.includes(myCity) || myCity.includes(reg))) || (!!myCountry && reg.includes(myCountry));
    return groupOk && regionOk;
  });

  return (
    <main className="container-px mx-auto w-full max-w-[1080px] py-10 max-[640px]:py-6">
      <a href={panelHref} className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-terra-deep">
        <ArrowLeft size={15} aria-hidden /> Panele dön
      </a>
      <header className="mb-7 max-w-[680px]">
        <p className="eyebrow mb-2 text-terra-deep">Talep &amp; Teklif</p>
        <h1 className="heading-section text-ink">İlan aç, teklif topla</h1>
        <p className="body-muted mt-2">Bölgeniz için talep/ilan oluşturun; ilgili tedarikçiler size teklif sunsun. Açık ilanlara siz de teklif verebilirsiniz.</p>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 max-[900px]:grid-cols-1">
        {/* SOL — Talep oluştur + Taleplerim */}
        <section className="flex flex-col gap-5">
          <div className="rounded-[16px] border border-line bg-paper p-5 shadow-[0_18px_54px_-48px_rgba(7,9,42,.6)]">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-extrabold text-ink"><Megaphone size={17} className="text-terra" aria-hidden /> Yeni talep aç</h2>
            <form action={createB2bRequest} className="grid gap-2.5">
              <input name="title" required maxLength={160} placeholder="Örn. GAP turu için Şanlıurfa 3 gece otel talebi" className="field h-11 w-full" />
              <div className="grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1">
                <input name="region" maxLength={120} placeholder="Bölge (örn. Şanlıurfa)" className="field h-11 w-full" />
                <select name="target_group" defaultValue="" className="field h-11 w-full">
                  <option value="">Tüm kategoriler</option>
                  {CATEGORY_GROUPS.map((g) => (
                    <option key={g.key} value={g.key}>{g.label}</option>
                  ))}
                </select>
              </div>
              <textarea name="description" rows={3} maxLength={2000} placeholder="Detaylar: tarih, kişi sayısı, konsept…" className="field w-full py-2.5" />
              <button type="submit" className="btn btn-solid btn-sm w-fit">Talebi Yayınla →</button>
            </form>
          </div>

          <div className="rounded-[16px] border border-line bg-paper p-5 shadow-[0_18px_54px_-48px_rgba(7,9,42,.6)]">
            <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-extrabold text-ink"><Inbox size={17} className="text-terra" aria-hidden /> Taleplerim ({myReq.length})</h2>
            {myReq.length === 0 ? (
              <p className="text-[13px] text-muted">Henüz talep açmadınız.</p>
            ) : (
              <ul className="grid gap-3">
                {myReq.map((r) => {
                  const offers = offersByReq.get(r.id) ?? [];
                  return (
                    <li key={r.id} className="rounded-[12px] border border-line/80 bg-cream/40 p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-ink">{r.title}</p>
                          <p className="mt-0.5 text-[12px] font-medium text-muted">{r.region ?? "—"} · {fmt(r.created_at)} · <Eye size={11} className="inline" aria-hidden /> {r.view_count}</p>
                        </div>
                        {r.status !== "archived" && (
                          <form action={closeMyB2bRequest}>
                            <input type="hidden" name="id" value={r.id} />
                            <button type="submit" className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-[11.5px] font-semibold text-muted hover:border-terra hover:text-terra-deep">Kapat</button>
                          </form>
                        )}
                      </div>
                      {offers.length > 0 && (
                        <div className="mt-2.5 grid gap-1.5 border-t border-line/70 pt-2.5">
                          <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-terra-deep">{offers.length} teklif geldi</p>
                          {offers.map((o) => (
                            <div key={o.id} className="rounded-[9px] bg-white px-3 py-2 text-[12.5px]">
                              <span className="font-bold text-ink">{bizName(o.businesses)}</span>
                              {o.price && <span className="ml-2 font-semibold text-terra-deep">{o.price}</span>}
                              <p className="mt-0.5 text-muted">{o.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* SAĞ — Açık ilanlar (teklif ver) */}
        <section className="rounded-[16px] border border-line bg-paper p-5 shadow-[0_18px_54px_-48px_rgba(7,9,42,.6)]">
          <h2 className="mb-3 inline-flex items-center gap-2 text-[15px] font-extrabold text-ink"><Send size={17} className="text-terra" aria-hidden /> Size uygun açık ilanlar</h2>
          {openReq.length === 0 ? (
            <p className="text-[13px] text-muted">Bölgeniz/kategorinizde şu an açık ilan yok.</p>
          ) : (
            <ul className="grid gap-3">
              {openReq.map((r) => (
                <li key={r.id} className="relative rounded-[12px] border border-line/80 bg-cream/40 p-3.5">
                  <B2bViewTracker id={r.id} />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-ink">{r.title}</p>
                    {groupLabel(r.target_group) && (
                      <span className="rounded-pill bg-terra/10 px-2 py-0.5 text-[10.5px] font-bold text-terra-deep">{groupLabel(r.target_group)}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] font-medium text-muted">{bizName(r.businesses)} · {r.region ?? "—"} · {fmt(r.created_at)}</p>
                  {r.description && <p className="mt-1.5 text-[13px] leading-5 text-ink/80">{r.description}</p>}
                  {offered.has(r.id) ? (
                    <p className="mt-2.5 text-[12.5px] font-bold text-emerald-700">✓ Teklif verdiniz</p>
                  ) : (
                    <form action={submitB2bOffer} className="mt-2.5 grid gap-2 border-t border-line/70 pt-2.5">
                      <input type="hidden" name="request_id" value={r.id} />
                      <div className="grid grid-cols-[1fr_140px] gap-2 max-[420px]:grid-cols-1">
                        <input name="message" required maxLength={2000} placeholder="Teklifiniz / notunuz…" className="field h-10 w-full" />
                        <input name="price" maxLength={120} placeholder="Fiyat (ops.)" className="field h-10 w-full" />
                      </div>
                      <button type="submit" className="btn btn-outline btn-sm w-fit">Teklif Ver →</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

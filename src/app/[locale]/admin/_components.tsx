import { Link, type Href } from "@/i18n/navigation";
import { saveBusiness, saveContentPage, updateApplicationStatus, updateQuoteStatus } from "@/lib/actions/admin";
import { signOut } from "@/lib/actions/auth";
import type { AdminApplication, AdminBusiness, AdminData, AdminQuote, ContentPage } from "@/lib/types";
import { businessSlug } from "@/lib/businesses";
import { CATEGORY_GROUPS } from "@/lib/categories";

export const panel =
  "rounded-[8px] border border-[#d9ded7] bg-white p-5 shadow-[0_20px_60px_-48px_rgba(16,24,40,.55)]";
export const label = "flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-[.06em] text-[#66746b]";
export const input = "field min-h-[42px] w-full rounded-[8px] border-[#d8ded7] bg-white normal-case tracking-normal text-ink";
export const textarea = `${input} min-h-[110px] py-3`;

const navItems: { href: Href; label: string; hint: string; mark: string }[] = [
  { href: "/admin", label: "Dashboard", hint: "Genel durum", mark: "D" },
  { href: "/admin/tedarikciler", label: "Tedarikçiler", hint: "İçerik, yayın, görsel", mark: "T" },
  { href: "/admin/seo", label: "SEO", hint: "Meta, canonical, OG", mark: "S" },
  { href: "/admin/onay", label: "Onay bekleyenler", hint: "Başvuru ve firma", mark: "O" },
  { href: "/admin/teklifler", label: "Teklifler", hint: "RFQ takibi", mark: "R" },
  { href: "/admin/icerik", label: "İçerik sayfaları", hint: "Landing ve metinler", mark: "I" },
];

export const AdminAccessDenied = () => {
  return (
    <main className="container-px grid min-h-[70vh] place-items-center pb-12 pt-[120px]">
      <section className={`${panel} max-w-[520px] text-center`}>
        <p className="text-[12px] font-bold uppercase tracking-[.08em] text-terra">Admin</p>
        <h1 className="mt-2 text-[32px]">Yetkili giriş gerekli</h1>
        <p className="mt-3 text-[14.5px] text-muted">
          İçerik, SEO, tedarikçi, başvuru ve teklif yönetimi için admin hesabıyla giriş yapmalısın.
        </p>
        <Link href="/login" className="btn btn-solid mt-5">Giriş yap</Link>
      </section>
    </main>
  );
};

export const AdminShell = ({
  data,
  children,
}: {
  data: AdminData;
  children: React.ReactNode;
}) => {
  const pendingBusinesses = data.businesses.filter((b) => b.status === "pending").length;
  const pendingApplications = data.applications.filter((a) => a.status === "pending").length;
  const newQuotes = data.quotes.filter((q) => q.status === "new").length;

  return (
    <main className="min-h-screen w-full bg-[#eef2ed] pb-6 pt-5 max-[560px]:pt-3">
      <div className="grid w-full grid-cols-[272px_minmax(0,1fr)] gap-5 max-[980px]:grid-cols-1">
        <aside className="top-5 h-fit overflow-hidden rounded-r-[8px] border-y border-r border-[#d7ded5] bg-white text-ink shadow-[0_28px_80px_-58px_rgba(16,24,40,.65)] lg:sticky">
          <div className="border-b border-line bg-[#f8faf7] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-terra">Tourism Partner</p>
            <h1 className="mt-1 text-[24px] text-pine">Admin Console</h1>
            <p className="mt-2 truncate text-[12.5px] text-muted">
              {data.mode === "demo" ? "Demo veri modu" : data.userEmail}
            </p>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 rounded-[8px] px-2.5 py-2.5 text-ink transition hover:bg-[#f1f4ef] hover:text-terra"
              >
                <span className="grid h-8 w-8 place-items-center rounded-[7px] border border-[#d8ded7] bg-[#f3f6f2] text-[12px] font-black text-terra group-hover:border-terra group-hover:bg-terra group-hover:text-white">
                  {item.mark}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-bold">{item.label}</span>
                  <span className="block truncate text-[12px] text-muted">{item.hint}</span>
                </span>
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-3 gap-2 border-t border-line p-3">
            <MiniStat label="Onay" value={pendingBusinesses + pendingApplications} />
            <MiniStat label="RFQ" value={newQuotes} />
            <MiniStat label="SEO" value={seoScore(data.businesses)} />
          </div>
          <form action={signOut} className="border-t border-line p-3">
            <button className="btn btn-outline btn-block btn-sm" type="submit">Çıkış</button>
          </form>
        </aside>
        <section className="min-w-0 rounded-l-[8px] border-y border-l border-[#d7ded5] bg-[#f8faf7] p-5 shadow-[0_24px_90px_-68px_rgba(16,24,40,.6)] max-[560px]:p-3">
          {children}
        </section>
      </div>
    </main>
  );
};

export const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[#d8ded7] pb-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.12em] text-terra">{eyebrow}</p>
        <h2 className="mt-1 text-page">{title}</h2>
        <p className="mt-2 max-w-[760px] text-[14px] text-muted">{description}</p>
      </div>
      {action}
    </header>
  );
};

export const Metric = ({ title, value, hint }: { title: string; value: number | string; hint: string }) => {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[#d9ded7] bg-white p-4 shadow-[0_16px_48px_-40px_rgba(16,24,40,.55)]">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-terra" aria-hidden />
      <p className="text-[11px] font-bold uppercase tracking-[.08em] text-[#66746b]">{title}</p>
      <p className="mt-2 text-[30px] font-semibold leading-none text-pine">{value}</p>
      <p className="mt-2 text-[12px] text-muted">{hint}</p>
    </div>
  );
};

const MiniStat = ({ label, value }: { label: string; value: number | string }) => {
  return (
    <div className="rounded-[7px] border border-[#d8ded7] bg-[#f3f6f2] px-2 py-2 text-center">
      <p className="text-[15px] font-bold text-pine">{value}</p>
      <p className="text-[10px] uppercase tracking-[.06em] text-muted">{label}</p>
    </div>
  );
};

export const BusinessTable = ({ businesses }: { businesses: AdminBusiness[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left text-[13px]">
        <thead className="bg-[#f1f4ef] text-[11px] uppercase tracking-[.06em] text-[#66746b]">
          <tr>
            <th className="border-b border-line px-3 py-2">ID</th>
            <th className="border-b border-line px-3 py-2">Firma</th>
            <th className="border-b border-line px-3 py-2">Kategori</th>
            <th className="border-b border-line px-3 py-2">Durum</th>
            <th className="border-b border-line px-3 py-2">SEO</th>
            <th className="border-b border-line px-3 py-2">Konum</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id} className="align-top transition hover:bg-[#fbfcfb]">
              <td className="border-b border-line px-3 py-3 font-bold text-pine">#{business.id}</td>
              <td className="border-b border-line px-3 py-3">
                <Link 
                  href={{ pathname: "/supplier/[id]", params: { id: businessSlug(business) } }} 
                  className="font-bold text-ink hover:text-terra"
                >
                  {business.name}
                </Link>
                <div className="mt-1 text-[12px] text-muted">
                  {business.verified ? "Doğrulanmış" : "Doğrulanmamış"} · {business.sponsored ? "Sponsor" : "Organik"}
                </div>
              </td>
              <td className="border-b border-line px-3 py-3">{business.group} · {business.type}</td>
              <td className="border-b border-line px-3 py-3"><StatusPill value={business.status} /></td>
              <td className="border-b border-line px-3 py-3">{business.seoTitle && business.seoDescription ? "Tam" : "Eksik"}</td>
              <td className="border-b border-line px-3 py-3">{business.city}, {business.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const BusinessForm = ({ locale, business }: { locale: string; business?: AdminBusiness }) => {
  return (
    <form action={saveBusiness} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)] gap-3 max-[720px]:grid-cols-1">
        <label className={label}>ID<input name="id" defaultValue={business?.id ?? ""} placeholder="Yeni için boş" className={input} /></label>
        <label className={label}>Firma adı<input name="name" required defaultValue={business?.name ?? ""} className={input} /></label>
        <label className={label}>Tür<input name="type" required defaultValue={business?.type ?? ""} className={input} /></label>
      </div>
      <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <label className={label}>Grup<select name="group" defaultValue={business?.group ?? "konaklama"} className={input}>{CATEGORY_GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select></label>
        <label className={label}>Durum<select name="status" defaultValue={business?.status ?? "pending"} className={input}><option value="pending">Beklemede</option><option value="approved">Yayında</option><option value="rejected">Reddedildi</option></select></label>
        <label className={label}>Ülke<input name="country" required defaultValue={business?.country ?? "Türkiye"} className={input} /></label>
        <label className={label}>Şehir<input name="city" required defaultValue={business?.city ?? ""} className={input} /></label>
      </div>
      <div className="grid grid-cols-5 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <label className={label}>İlçe<input name="district" required defaultValue={business?.district ?? ""} className={input} /></label>
        <label className={label}>Lat<input name="lat" defaultValue={business?.coords[0] ?? 0} className={input} /></label>
        <label className={label}>Lng<input name="lng" defaultValue={business?.coords[1] ?? 0} className={input} /></label>
        <label className={label}>Puan<input name="rating" defaultValue={business?.rating ?? 0} className={input} /></label>
        <label className={label}>Yorum<input name="reviews" defaultValue={business?.reviews ?? 0} className={input} /></label>
      </div>
      <label className={label}>Açıklama<textarea name="description" defaultValue={business?.desc ?? ""} className={textarea} /></label>
      <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
        <label className={label}>Kapak görseli<input name="image" defaultValue={business?.image ?? ""} placeholder="/assets/cards/hotel-1.webp" className={input} /></label>
        <label className={label}>Etiket<input name="tag" defaultValue={business?.tag ?? ""} className={input} /></label>
      </div>
      <label className={label}>Filtre özellikleri<input name="attributes" defaultValue={(business?.attributes ?? []).join(", ")} placeholder="komisyonlu, dil-en, para-eur" className={input} /></label>
      <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
        <label className="flex items-center gap-2 text-[13px] font-bold"><input type="checkbox" name="verified" defaultChecked={business?.verified ?? false} /> Doğrulanmış</label>
        <label className="flex items-center gap-2 text-[13px] font-bold"><input type="checkbox" name="sponsored" defaultChecked={business?.sponsored ?? false} /> Sponsor</label>
      </div>
      <div className="rounded-[8px] border border-[#d8ded7] bg-[#f3f6f2] p-4">
        <h3 className="mb-3 text-[18px]">SEO metadata</h3>
        <div className="grid gap-3">
          <label className={label}>SEO başlık<input name="seoTitle" defaultValue={business?.seoTitle ?? ""} className={input} /></label>
          <label className={label}>SEO açıklama<textarea name="seoDescription" defaultValue={business?.seoDescription ?? ""} className={`${textarea} min-h-[80px]`} /></label>
          <label className={label}>Anahtar kelimeler<input name="seoKeywords" defaultValue={(business?.seoKeywords ?? []).join(", ")} className={input} /></label>
          <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
            <label className={label}>Canonical path<input name="canonicalPath" defaultValue={business?.canonicalPath ?? ""} placeholder="/supplier/kaya-palas-hotel" className={input} /></label>
            <label className={label}>OG görsel<input name="ogImage" defaultValue={business?.ogImage ?? business?.image ?? ""} className={input} /></label>
          </div>
        </div>
      </div>
      <button className="btn btn-solid justify-self-start" type="submit">Tedarikçiyi kaydet</button>
    </form>
  );
};

export const ContentForm = ({ locale, page }: { locale: string; page?: ContentPage }) => {
  return (
    <form action={saveContentPage} className="grid gap-3">
      <input type="hidden" name="locale" value={locale} />
      <label className={label}>Slug<input name="slug" required defaultValue={page?.slug ?? "homepage"} className={input} /></label>
      <label className={label}>Durum<select name="status" defaultValue={page?.status ?? "draft"} className={input}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select></label>
      <label className={label}>Başlık<input name="title" required defaultValue={page?.title ?? ""} className={input} /></label>
      <label className={label}>Özet<textarea name="excerpt" defaultValue={page?.excerpt ?? ""} className={`${textarea} min-h-[78px]`} /></label>
      <label className={label}>İçerik<textarea name="body" defaultValue={page?.body ?? ""} className={`${textarea} min-h-[180px]`} /></label>
      <label className={label}>SEO başlık<input name="seoTitle" defaultValue={page?.seoTitle ?? ""} className={input} /></label>
      <label className={label}>SEO açıklama<textarea name="seoDescription" defaultValue={page?.seoDescription ?? ""} className={`${textarea} min-h-[78px]`} /></label>
      <label className={label}>Anahtar kelimeler<input name="seoKeywords" defaultValue={(page?.seoKeywords ?? []).join(", ")} className={input} /></label>
      <label className={label}>Canonical<input name="canonicalPath" defaultValue={page?.canonicalPath ?? ""} className={input} /></label>
      <label className={label}>OG görsel<input name="ogImage" defaultValue={page?.ogImage ?? ""} className={input} /></label>
      <button className="btn btn-solid justify-self-start" type="submit">İçeriği kaydet</button>
    </form>
  );
};

export const ContentTable = ({ pages }: { pages: ContentPage[] }) => {
  if (pages.length === 0) return <Empty text="Henüz içerik sayfası yok." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-[13px]">
        <thead className="bg-[#f1f4ef] text-[11px] uppercase tracking-[.06em] text-[#66746b]">
          <tr>
            <th className="border-b border-line px-3 py-2">Slug</th>
            <th className="border-b border-line px-3 py-2">Başlık</th>
            <th className="border-b border-line px-3 py-2">Dil</th>
            <th className="border-b border-line px-3 py-2">Durum</th>
            <th className="border-b border-line px-3 py-2">SEO</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id} className="transition hover:bg-[#fbfcfb]">
              <td className="border-b border-line px-3 py-3 font-bold">{page.slug}</td>
              <td className="border-b border-line px-3 py-3">{page.title}</td>
              <td className="border-b border-line px-3 py-3">{page.locale}</td>
              <td className="border-b border-line px-3 py-3"><StatusPill value={page.status} /></td>
              <td className="border-b border-line px-3 py-3">{page.seoTitle && page.seoDescription ? "Tam" : "Eksik"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ApplicationList = ({ applications, locale }: { applications: AdminApplication[]; locale: string }) => {
  if (applications.length === 0) return <Empty text="Henüz başvuru yok." />;
  return (
    <div className="grid gap-3">
      {applications.map((application) => (
        <form key={application.id} action={updateApplicationStatus} className="rounded-[8px] border border-[#d8ded7] bg-[#f3f6f2] p-4">
          <input type="hidden" name="id" value={application.id} />
          <input type="hidden" name="locale" value={locale} />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[17px]">{application.name}</h3>
              <p className="text-[13px] text-muted">{application.email} · {application.categoryLabel ?? application.group}</p>
              <p className="mt-1 text-[12px] text-muted">{formatDate(application.createdAt)}</p>
            </div>
            <StatusPill value={application.status} />
          </div>
          <div className="mt-3 flex gap-2">
            <select name="status" defaultValue={application.status} className={`${input} max-w-[180px]`}>
              <option value="pending">Beklemede</option>
              <option value="approved">Onaylandı</option>
              <option value="rejected">Reddedildi</option>
            </select>
            <button className="btn btn-pine btn-sm" type="submit">Güncelle</button>
          </div>
        </form>
      ))}
    </div>
  );
};

export const QuoteList = ({ quotes, locale }: { quotes: AdminQuote[]; locale: string }) => {
  if (quotes.length === 0) return <Empty text="Henüz teklif talebi yok." />;
  return (
    <div className="grid gap-3">
      {quotes.map((quote) => (
        <form key={quote.id} action={updateQuoteStatus} className="rounded-[8px] border border-[#d8ded7] bg-[#f3f6f2] p-4">
          <input type="hidden" name="id" value={quote.id} />
          <input type="hidden" name="locale" value={locale} />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[17px]">{quote.name}</h3>
              <p className="text-[13px] text-muted">{quote.email} · {quote.company ?? "Şirket yok"} · {quote.service ?? "Genel talep"}</p>
              <p className="mt-1 text-[12px] text-muted">
                {quote.businessId ? `Tedarikçi #${quote.businessId}` : "Genel"} · {quote.people ?? 0} kişi · {formatDate(quote.createdAt)}
              </p>
              {quote.message && <p className="mt-2 text-[13px] text-muted">{quote.message}</p>}
            </div>
            <span className="rounded-pill bg-white px-3 py-1 text-[12px] font-bold text-muted">{quote.status}</span>
          </div>
          <div className="mt-3 grid grid-cols-[160px_minmax(0,1fr)_auto] gap-2 max-[640px]:grid-cols-1">
            <select name="status" defaultValue={quote.status} className={input}>
              <option value="new">Yeni</option>
              <option value="contacted">İletişime geçildi</option>
              <option value="won">Kazanıldı</option>
              <option value="lost">Kaybedildi</option>
            </select>
            <input name="internalNote" defaultValue={quote.internalNote ?? ""} placeholder="İç not" className={input} />
            <button className="btn btn-pine btn-sm" type="submit">Kaydet</button>
          </div>
        </form>
      ))}
    </div>
  );
};

export const StatusPill = ({ value }: { value: string }) => {
  const tone =
    value === "approved" || value === "published"
      ? "bg-group-acente/10 text-group-acente"
      : value === "rejected" || value === "archived" || value === "lost"
        ? "bg-red-50 text-red-700"
        : "bg-gold/20 text-pine";
  return <span className={`rounded-[999px] px-3 py-1 text-[12px] font-bold ${tone}`}>{value}</span>;
};

export const Empty = ({ text }: { text: string }) => {
  return <p className="rounded-[8px] border border-dashed border-[#d8ded7] bg-[#f3f6f2] p-4 text-[13.5px] text-muted">{text}</p>;
};

export const seoScore = (businesses: AdminBusiness[]): string => {
  if (businesses.length === 0) return "0%";
  const complete = businesses.filter((b) => b.seoTitle && b.seoDescription).length;
  return `${Math.round((complete / businesses.length) * 100)}%`;
};

export const formatDate = (value: string | undefined): string => {
  if (!value) return "Tarih yok";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
};

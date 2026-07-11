import { Link } from "@/i18n/navigation";
import { saveBusiness, saveContentPage, updateApplicationStatus, updateQuoteStatus } from "@/lib/actions/admin";
import { signOut } from "@/lib/actions/auth";
import type { AdminAccess } from "@/lib/admin-auth";
import type { AdminApplication, AdminBusiness, AdminQuote, ContentPage } from "@/lib/types";
import { businessSlug } from "@/lib/businesses";
import { cn } from "@/lib/utils";
import AdminNav from "./AdminNav";
import AdminSearch from "./AdminSearch";
import Logo from "@/components/Logo";
import { CardIcon as UICardIcon } from "@/components/common/Card";
import DataTable, { type Column } from "@/components/common/DataTable";
import Field from "@/components/common/Field";
import { Bell, CircleHelp, LogOut, Mail, Plus } from "lucide-react";
import { AdminMetric, AdminPageHeader, adminUi } from "./_ui";
import BusinessCategoryFields from "./BusinessCategoryFields";

/* ============================================================
   Admin kart bileşenleri — tek kaynak olarak ortak common/Card'a delege eder.
   (Admin'in props-API CardHeader'ı korunur; altyapı common kit'ten gelir.)
   ============================================================ */
export type ChipTone = "blue" | "amber" | "emerald" | "red" | "violet";
const toIconTone = (t?: ChipTone): "blue" | "amber" | "emerald" | "red" =>
  t === "amber" || t === "emerald" || t === "red" ? t : "blue";

export const IconChip = ({ tone = "blue", children }: { tone?: ChipTone; children: React.ReactNode }) => (
  <UICardIcon tone={toIconTone(tone)}>{children}</UICardIcon>
);

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <section className={`overflow-hidden ${adminUi.panel} ${className ?? ""}`}>
    {children}
  </section>
);

export const CardHeader = ({
  icon,
  tone,
  title,
  action,
}: {
  icon?: React.ReactNode;
  tone?: ChipTone;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-line/80 px-5 py-4">
    <div className="flex min-w-0 items-center gap-3">
      {icon && <UICardIcon tone={toIconTone(tone)}>{icon}</UICardIcon>}
      <h3 className="truncate text-[15px] font-medium tracking-[0] text-ink">{title}</h3>
    </div>
    {action}
  </div>
);

export const panel = `${adminUi.panel} p-5`;
export const label = "flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted";
export const input = adminUi.input;
export const textarea = `${input} min-h-[110px] py-3`;

export const AdminAccessDenied = () => {
  return (
    <main className="container-px grid min-h-[70vh] place-items-center pb-12 pt-[120px]">
      <section className={`${panel} max-w-[520px] text-center`}>
        <p className="text-[12px] font-bold uppercase tracking-[.08em] text-terra">Admin</p>
        <h1 className="mt-2 text-[32px]">Yetkili giriş gerekli</h1>
        <p className="mt-3 text-[14.5px] text-muted">
          İçerik, SEO, tedarikçi, başvuru ve teklif yönetimi için admin hesabıyla giriş yapmalısın.
        </p>
        <Link href="/login" className={`mt-5 ${adminUi.sapphireButton}`}>Giriş yap</Link>
      </section>
    </main>
  );
};

export const AdminShell = ({
  data,
  children,
}: {
  data: AdminAccess;
  children: React.ReactNode;
}) => {
  const who = data.mode === "demo" ? "Demo veri modu" : data.userEmail ?? "Admin";
  const initial = (data.userEmail ?? "A").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen w-full bg-panel-bg text-ink">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-line bg-paper/90 md:flex">
        <div className="flex h-[92px] items-center px-6">
          <Logo href="/admin" height={42} priority className="max-w-[165px]" />
        </div>

        <AdminNav />

        <div className="mt-auto border-t border-line/80 px-5 pb-6 pt-4">
          <Link
            href="/admin/tedarikciler"
            className="mb-4 flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-sapphire text-[13px] font-medium text-paper shadow-card transition-colors hover:bg-sapphire-deep"
          >
            <Plus size={16} strokeWidth={2.4} aria-hidden />
            Yeni İşletme Kaydı
          </Link>
          <Link
            href="/admin/destek"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-cream hover:text-brand"
          >
            <CircleHelp size={17} aria-hidden />
            Destek
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-cream hover:text-brand"
            >
              <LogOut size={17} aria-hidden />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* İnce, şeffaf üst şerit — yalnızca sağda ikonlar. Sayfa başlığı en üstte kalsın diye
            arka plan/çizgi yok ve içerik üstüne binmeyecek şekilde akışta durur. */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center gap-3 border-b border-line/80 bg-panel-bg/90 px-5 backdrop-blur md:px-8">
          <span className="shrink-0 text-[15px] font-semibold text-brand md:hidden">B2B</span>

          {/* Geniş arama — satırın büyük kısmını kaplar */}
          <AdminSearch />

          {/* Yeni İşletme Kaydı */}
          <Link
            href="/admin/tedarikciler"
            className="hidden h-10 shrink-0 items-center gap-2 rounded-[8px] bg-sapphire px-4 text-[13px] font-medium text-paper shadow-card transition-colors hover:bg-sapphire-deep sm:inline-flex"
          >
            <Plus size={16} strokeWidth={2.4} aria-hidden />
            Yeni İşletme Kaydı
          </Link>

          <button type="button" className="relative grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-line bg-paper text-muted transition-colors hover:bg-cream hover:text-brand" aria-label="Bildirimler">
            <Bell size={18} aria-hidden />
            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-red-600 ring-2 ring-paper" />
          </button>
          <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-line bg-paper text-muted transition-colors hover:bg-cream hover:text-brand" aria-label="Mesajlar">
            <Mail size={18} aria-hidden />
          </button>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-cream text-[13px] font-semibold text-brand" title={who}>
            {initial}
          </div>
        </header>

        <div className="flex-1 px-5 pb-8 pt-5 md:px-8">{children}</div>
      </main>
    </div>
  );
};

export const PageHeader = ({
  title,
  description,
  action,
}: {
  /** @deprecated Artık gösterilmiyor; çağrı yerleri geriye uyum için hâlâ geçebilir. */
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => {
  return (
    <AdminPageHeader title={title} description={description} action={action} />
  );
};

export const Metric = ({ title, value, hint }: { title: string; value: number | string; hint: string }) => {
  return (
    <AdminMetric label={title} value={value} hint={hint} />
  );
};

export const BusinessTable = ({ businesses }: { businesses: AdminBusiness[] }) => (
  <DataTable
    data={businesses}
    getRowKey={(b) => b.id}
    empty="Kayıt yok."
    minWidth={900}
    columns={[
      { key: "id", header: "ID", cell: (b) => <span className="font-bold text-pine">#{b.id}</span> },
      {
        key: "firm",
        header: "Firma",
        cell: (b) => (
          <div>
            <Link href={{ pathname: "/supplier/[id]", params: { id: businessSlug(b) } }} className="font-bold text-ink hover:text-terra">
              {b.name}
            </Link>
            <div className="mt-1 text-[12px] text-muted">
              {b.verified ? "Doğrulanmış" : "Doğrulanmamış"} · {b.sponsored ? "Sponsor" : "Organik"}{b.founderPartner ? " · Kurucu Partner" : ""}
            </div>
          </div>
        ),
      },
      { key: "cat", header: "Kategori", cell: (b) => `${b.group} · ${b.type}` },
      { key: "status", header: "Durum", cell: (b) => <StatusPill value={b.status} /> },
      { key: "seo", header: "SEO", cell: (b) => (b.seoTitle && b.seoDescription ? "Tam" : "Eksik") },
      { key: "loc", header: "Konum", cell: (b) => `${b.city}, ${b.country}` },
    ] satisfies Column<AdminBusiness>[]}
  />
);

export const BusinessForm = ({ locale, business }: { locale: string; business?: AdminBusiness }) => {
  const compactInput = `${input} h-11 px-3 text-[14px]`;
  const compactTextarea = `${input} min-h-[104px] px-3 py-2.5 text-[14px] leading-6`;

  return (
    <form id="admin-business-profile-form" action={saveBusiness} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <input type="hidden" name="locale" value={locale} />
      {business && <input type="hidden" name="id" value={business.id} />}
      <div className="grid gap-5">
        <AdminFormSection title="Temel Bilgiler">
          <div>
            <Field label="Firma adı" required><input name="name" required defaultValue={business?.name ?? ""} className={compactInput} /></Field>
          </div>
          <BusinessCategoryFields initialGroup={business?.group ?? "konaklama"} initialType={business?.type ?? "Otel"} inputClassName={compactInput} />
        </AdminFormSection>

        <AdminFormSection title="İçerik Detayları">
          <Field label="Açıklama"><textarea name="description" defaultValue={business?.desc ?? ""} className={compactTextarea} /></Field>
          <div className="grid grid-cols-[minmax(180px,.35fr)_minmax(0,.65fr)] gap-3 max-[820px]:grid-cols-1">
            <Field label="Etiket"><input name="tag" defaultValue={business?.tag ?? ""} className={compactInput} /></Field>
            <Field label="Filtre özellikleri" hint="virgülle ayır"><input name="attributes" defaultValue={(business?.attributes ?? []).join(", ")} placeholder="komisyonlu, dil-en, para-eur" className={compactInput} /></Field>
          </div>
        </AdminFormSection>

      </div>

      <div className="grid content-start gap-5">
        <AdminFormSection title="Operasyon">
          <Field label="Sistem Durumu"><select name="status" defaultValue={business?.status ?? "pending"} className={compactInput}><option value="draft">Taslak</option><option value="pending">Beklemede</option><option value="approved">Yayında</option><option value="active">Aktif</option><option value="rejected">Reddedildi</option><option value="expired">Süresi Bitti</option><option value="blacklisted">Blacklist</option><option value="suspended">Askıda</option></select></Field>
          <ToggleRow name="verified" label="Doğrulanmış İşletme" description="Belgeleri onaylanmış tesis" checked={business?.verified ?? false} />
          <ToggleRow name="sponsored" label="Sponsor / Premium" description="Arama sonuçlarında öne çıkar" checked={business?.sponsored ?? false} />
          <ToggleRow name="founderPartner" label="Kurucu Partner Rozeti" description="Firma kartında kurucu partner mührünü göster" checked={business?.founderPartner ?? false} />
        </AdminFormSection>

        <AdminFormSection title="Konum">
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <Field label="Ülke" required><input name="country" required defaultValue={business?.country ?? "Türkiye"} className={compactInput} /></Field>
            <Field label="Şehir" required><input name="city" required defaultValue={business?.city ?? ""} className={compactInput} /></Field>
          </div>
          <Field label="İlçe / Bölge" required><input name="district" required defaultValue={business?.district ?? ""} className={compactInput} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lat"><input name="lat" defaultValue={business?.coords[0] ?? 0} className={compactInput} /></Field>
            <Field label="Lng"><input name="lng" defaultValue={business?.coords[1] ?? 0} className={compactInput} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Puan"><input name="rating" defaultValue={business?.rating ?? 0} className={compactInput} /></Field>
            <Field label="Yorum"><input name="reviews" defaultValue={business?.reviews ?? 0} className={compactInput} /></Field>
          </div>
        </AdminFormSection>
      </div>
    </form>
  );
};

const AdminFormSection = ({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) => (
  <section className={cn("overflow-hidden rounded-[8px] border border-line bg-paper shadow-card", className)}>
    <div className="flex min-h-11 items-center border-b border-line bg-cream/35 px-4">
      <h3 className="text-[15px] font-extrabold text-ink">{title}</h3>
    </div>
    <div className="grid gap-3 p-4">{children}</div>
  </section>
);

const ToggleRow = ({ name, label, description, checked }: { name: string; label: string; description: string; checked: boolean }) => (
  <label className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0">
    <span>
      <span className="block text-[13px] font-extrabold text-ink">{label}</span>
      <span className="mt-0.5 block text-[12px] font-medium text-muted">{description}</span>
    </span>
    <input type="checkbox" name={name} defaultChecked={checked} className="h-5 w-5 shrink-0 accent-sapphire" />
  </label>
);

export const ContentForm = ({ locale, page }: { locale: string; page?: ContentPage }) => {
  return (
    <form action={saveContentPage} className="grid gap-3">
      <input type="hidden" name="locale" value={locale} />
      <Field label="Slug" required><input name="slug" required defaultValue={page?.slug ?? "homepage"} className={input} /></Field>
      <Field label="Durum"><select name="status" defaultValue={page?.status ?? "draft"} className={input}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select></Field>
      <Field label="Başlık" required><input name="title" required defaultValue={page?.title ?? ""} className={input} /></Field>
      <Field label="Özet"><textarea name="excerpt" defaultValue={page?.excerpt ?? ""} className={`${textarea} min-h-[78px]`} /></Field>
      <Field label="İçerik"><textarea name="body" defaultValue={page?.body ?? ""} className={`${textarea} min-h-[180px]`} /></Field>
      <Field label="SEO başlık"><input name="seoTitle" defaultValue={page?.seoTitle ?? ""} className={input} /></Field>
      <Field label="SEO açıklama"><textarea name="seoDescription" defaultValue={page?.seoDescription ?? ""} className={`${textarea} min-h-[78px]`} /></Field>
      <Field label="Anahtar kelimeler"><input name="seoKeywords" defaultValue={(page?.seoKeywords ?? []).join(", ")} className={input} /></Field>
      <Field label="Canonical"><input name="canonicalPath" defaultValue={page?.canonicalPath ?? ""} className={input} /></Field>
      <Field label="OG görsel"><input name="ogImage" defaultValue={page?.ogImage ?? ""} className={input} /></Field>
      <button className={`${adminUi.sapphireButton} justify-self-start`} type="submit">İçeriği kaydet</button>
    </form>
  );
};

export const ContentTable = ({ pages }: { pages: ContentPage[] }) => (
  <DataTable
    data={pages}
    getRowKey={(p) => p.id}
    empty="Henüz içerik sayfası yok."
    minWidth={720}
    columns={[
      { key: "slug", header: "Slug", cell: (p) => <span className="font-bold">{p.slug}</span> },
      { key: "title", header: "Başlık", cell: (p) => p.title },
      { key: "locale", header: "Dil", cell: (p) => p.locale },
      { key: "status", header: "Durum", cell: (p) => <StatusPill value={p.status} /> },
      { key: "seo", header: "SEO", cell: (p) => (p.seoTitle && p.seoDescription ? "Tam" : "Eksik") },
    ] satisfies Column<ContentPage>[]}
  />
);

export const ApplicationList = ({ applications, locale }: { applications: AdminApplication[]; locale: string }) => {
  if (applications.length === 0) return <Empty text="Henüz başvuru yok." />;
  return (
    <div className="grid gap-3">
      {applications.map((application) => (
        <form key={application.id} action={updateApplicationStatus} className="rounded-[8px] border border-line bg-cream/45 p-4">
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
            <button className={adminUi.sapphireButton} type="submit">Güncelle</button>
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
        <form key={quote.id} action={updateQuoteStatus} className="rounded-[8px] border border-line bg-cream/45 p-4">
          <input type="hidden" name="id" value={quote.id} />
          <input type="hidden" name="locale" value={locale} />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[17px]">{quote.name}</h3>
              <p className="text-[13px] text-muted">{quote.email} · {quote.phone ?? "Telefon yok"} · {quote.company ?? "Şirket yok"} · {quote.service ?? "Genel talep"}</p>
              <p className="mt-1 text-[12px] text-muted">
                {quote.businessId ? `Tedarikçi #${quote.businessId}` : "Genel"} · {quote.people ?? 0} kişi · {formatDate(quote.createdAt)}
              </p>
              <p className="mt-1 text-[12px] text-muted">
                {[quote.categoryType, quote.country, quote.city, quote.district].filter(Boolean).join(" · ") || "Filtre yok"}
              </p>
              {quote.validUntil && <p className="mt-1 text-[12px] font-semibold text-amber-700">Teklif son tarihi: {formatDate(quote.validUntil)}</p>}
              {quote.message && <p className="mt-2 text-[13px] text-muted">{quote.message}</p>}
            </div>
            <span className="rounded-pill bg-paper px-3 py-1 text-[12px] font-bold text-muted">{quote.status}</span>
          </div>
          <div className="mt-3 grid grid-cols-[160px_minmax(0,1fr)_auto] gap-2 max-[640px]:grid-cols-1">
            <select name="status" defaultValue={quote.status} className={input}>
              <option value="new">Yeni</option>
              <option value="contacted">İletişime geçildi</option>
              <option value="won">Kazanıldı</option>
              <option value="lost">Kaybedildi</option>
            </select>
            <input name="internalNote" defaultValue={quote.internalNote ?? ""} placeholder="İç not" className={input} />
            <button className={adminUi.sapphireButton} type="submit">Kaydet</button>
          </div>
        </form>
      ))}
    </div>
  );
};

export const StatusPill = ({ value }: { value: string }) => {
  const tone =
    value === "approved" || value === "published" || value === "active" || value === "won"
      ? "bg-emerald-100 text-emerald-800"
      : value === "rejected" || value === "archived" || value === "lost" || value === "blacklisted"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-800";
  return <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${tone}`}>{value}</span>;
};

export const ComingSoon = ({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) => (
  <>
    <PageHeader eyebrow={eyebrow} title={title} description={note ?? "Bu modül yakında eklenecek."} />
    <div className="grid place-items-center rounded-xl border border-dashed border-line bg-paper px-6 py-24 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-cream text-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      </div>
      <h3 className="mt-4 text-[20px] font-bold text-ink">Yakında</h3>
      <p className="mt-1.5 max-w-[420px] text-[14px] text-muted">
        Bu sekmenin tasarımı hazırlandıkça eklenecek. Menüde yerini şimdiden aldı.
      </p>
    </div>
  </>
);

export const Empty = ({ text }: { text: string }) => {
  return <p className="rounded-[8px] border border-dashed border-line bg-cream/45 p-4 text-[13.5px] text-muted">{text}</p>;
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

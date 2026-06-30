import { Link } from "@/i18n/navigation";
import { saveBusiness, saveContentPage, updateApplicationStatus, updateQuoteStatus } from "@/lib/actions/admin";
import { signOut } from "@/lib/actions/auth";
import type { AdminAccess } from "@/lib/admin-auth";
import type { AdminApplication, AdminBusiness, AdminQuote, ContentPage } from "@/lib/types";
import { businessSlug } from "@/lib/businesses";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import AdminNav from "./AdminNav";
import AdminSearch from "./AdminSearch";
import {
  Card as UICard,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
  CardIcon as UICardIcon,
} from "@/components/common/Card";
import DataTable, { type Column } from "@/components/common/DataTable";
import Field from "@/components/common/Field";
import { Bell, CircleHelp, LogOut, Mail, Plus } from "lucide-react";

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
  <UICard variant="default" interactive className={className}>
    {children}
  </UICard>
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
  <UICardHeader>
    <div className="flex min-w-0 items-center gap-3">
      {icon && <UICardIcon tone={toIconTone(tone)}>{icon}</UICardIcon>}
      <UICardTitle>{title}</UICardTitle>
    </div>
    {action}
  </UICardHeader>
);

export const panel =
  "rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,.05)]";
export const label = "flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-[.06em] text-[#64748B]";
export const input = "field min-h-[42px] w-full rounded-lg border-[#E2E8F0] bg-white normal-case tracking-normal text-[#0B1C30]";
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
        <Link href="/login" className="btn btn-solid mt-5">Giriş yap</Link>
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
    <div className="flex min-h-screen w-full bg-[#F5F8FC] text-[#0B1C30]">
      <aside className="sticky top-0 hidden h-screen w-[256px] shrink-0 flex-col border-r border-[#D9E1EF] bg-[#F7F9FF] md:flex">
        <div className="flex h-[100px] items-start gap-2.5 px-7 pt-6">
          <div className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#0057D9] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-extrabold leading-[1.05] text-[#0057D9]">B2B Turizm</h1>
            <p className="mt-2 text-[12px] font-medium leading-none text-[#1F2A44]">Yönetim Paneli</p>
          </div>
        </div>

        <AdminNav />

        <div className="mt-auto border-t border-[#D9E1EF] px-6 pb-6 pt-4">
          <Link
            href="/admin/tedarikciler"
            className="mb-5 flex h-9 w-full items-center justify-center gap-2 rounded-[6px] bg-[#0057D9] text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(0,87,217,.16)] transition-colors hover:bg-[#0047B8]"
          >
            <Plus size={16} strokeWidth={2.4} aria-hidden />
            Yeni İşletme Kaydı
          </Link>
          <Link
            href="/admin/destek"
            className="flex items-center gap-3 rounded-[7px] px-3 py-2.5 text-[13px] font-semibold text-[#566178] transition-colors hover:bg-[#EFF4FF] hover:text-[#0057D9]"
          >
            <CircleHelp size={17} aria-hidden />
            Destek
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2.5 text-[13px] font-semibold text-[#566178] transition-colors hover:bg-[#EFF4FF] hover:text-[#0057D9]"
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
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#E6ECF5] bg-[#F8FAFF]/90 px-5 backdrop-blur md:px-8">
          <span className="shrink-0 text-[15px] font-extrabold text-[#0057D9] md:hidden">B2B</span>

          {/* Geniş arama — satırın büyük kısmını kaplar */}
          <AdminSearch />

          {/* Yeni İşletme Kaydı */}
          <Link
            href="/admin/tedarikciler"
            className="hidden h-9 shrink-0 items-center gap-2 rounded-lg bg-[#0057D9] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0047B8] sm:inline-flex"
          >
            <Plus size={16} strokeWidth={2.4} aria-hidden />
            Yeni İşletme Kaydı
          </Link>

          <button type="button" className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#64748B] transition-colors hover:bg-[#EFF4FF] hover:text-[#2563EB]" aria-label="Bildirimler">
            <Bell size={18} aria-hidden />
            <span className="absolute right-[9px] top-[7px] h-2 w-2 rounded-full bg-[#D01B1B] ring-2 ring-[#F8FAFF]" />
          </button>
          <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#64748B] transition-colors hover:bg-[#EFF4FF] hover:text-[#2563EB]" aria-label="Mesajlar">
            <Mail size={18} aria-hidden />
          </button>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#BFD8D4] text-[13px] font-extrabold text-[#1F4B45]" title={who}>
            {initial}
          </div>
        </header>

        <div className="flex-1 px-5 pb-7 pt-1 md:px-8">{children}</div>
      </main>
    </div>
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
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#2563EB]">{eyebrow}</p>
        <h2 className="mt-1 text-[30px] font-bold leading-tight text-[#0B1C30]">{title}</h2>
        <p className="mt-1.5 max-w-[760px] text-[14px] text-[#64748B]">{description}</p>
      </div>
      {action}
    </header>
  );
};

export const Metric = ({ title, value, hint }: { title: string; value: number | string; hint: string }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,.05)]">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#2563EB]" aria-hidden />
      <p className="text-[11px] font-bold uppercase tracking-[.08em] text-[#64748B]">{title}</p>
      <p className="mt-2 text-[30px] font-semibold leading-none text-[#0B1C30]">{value}</p>
      <p className="mt-2 text-[12px] text-[#64748B]">{hint}</p>
    </div>
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
              {b.verified ? "Doğrulanmış" : "Doğrulanmamış"} · {b.sponsored ? "Sponsor" : "Organik"}
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
  return (
    <form action={saveBusiness} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)] gap-3 max-[720px]:grid-cols-1">
        <Field label="ID"><input name="id" defaultValue={business?.id ?? ""} placeholder="Yeni için boş" className={input} /></Field>
        <Field label="Firma adı" required><input name="name" required defaultValue={business?.name ?? ""} className={input} /></Field>
        <Field label="Tür" required><input name="type" required defaultValue={business?.type ?? ""} className={input} /></Field>
      </div>
      <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <Field label="Grup"><select name="group" defaultValue={business?.group ?? "konaklama"} className={input}>{CATEGORY_GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}</select></Field>
        <Field label="Durum"><select name="status" defaultValue={business?.status ?? "pending"} className={input}><option value="pending">Beklemede</option><option value="approved">Yayında</option><option value="rejected">Reddedildi</option></select></Field>
        <Field label="Ülke" required><input name="country" required defaultValue={business?.country ?? "Türkiye"} className={input} /></Field>
        <Field label="Şehir" required><input name="city" required defaultValue={business?.city ?? ""} className={input} /></Field>
      </div>
      <div className="grid grid-cols-5 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <Field label="İlçe" required><input name="district" required defaultValue={business?.district ?? ""} className={input} /></Field>
        <Field label="Lat"><input name="lat" defaultValue={business?.coords[0] ?? 0} className={input} /></Field>
        <Field label="Lng"><input name="lng" defaultValue={business?.coords[1] ?? 0} className={input} /></Field>
        <Field label="Puan"><input name="rating" defaultValue={business?.rating ?? 0} className={input} /></Field>
        <Field label="Yorum"><input name="reviews" defaultValue={business?.reviews ?? 0} className={input} /></Field>
      </div>
      <Field label="Açıklama"><textarea name="description" defaultValue={business?.desc ?? ""} className={textarea} /></Field>
      <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
        <Field label="Kapak görseli"><input name="image" defaultValue={business?.image ?? ""} placeholder="/assets/cards/hotel-1.webp" className={input} /></Field>
        <Field label="Etiket"><input name="tag" defaultValue={business?.tag ?? ""} className={input} /></Field>
      </div>
      <Field label="Filtre özellikleri" hint="virgülle ayır"><input name="attributes" defaultValue={(business?.attributes ?? []).join(", ")} placeholder="komisyonlu, dil-en, para-eur" className={input} /></Field>
      <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
        <label className="flex items-center gap-2 text-[13px] font-bold"><input type="checkbox" name="verified" defaultChecked={business?.verified ?? false} /> Doğrulanmış</label>
        <label className="flex items-center gap-2 text-[13px] font-bold"><input type="checkbox" name="sponsored" defaultChecked={business?.sponsored ?? false} /> Sponsor</label>
      </div>
      <div className="rounded-[8px] border border-[#d8ded7] bg-[#f3f6f2] p-4">
        <h3 className="mb-3 text-[18px]">SEO metadata</h3>
        <div className="grid gap-3">
          <Field label="SEO başlık"><input name="seoTitle" defaultValue={business?.seoTitle ?? ""} className={input} /></Field>
          <Field label="SEO açıklama"><textarea name="seoDescription" defaultValue={business?.seoDescription ?? ""} className={`${textarea} min-h-[80px]`} /></Field>
          <Field label="Anahtar kelimeler"><input name="seoKeywords" defaultValue={(business?.seoKeywords ?? []).join(", ")} className={input} /></Field>
          <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
            <Field label="Canonical path"><input name="canonicalPath" defaultValue={business?.canonicalPath ?? ""} placeholder="/supplier/kaya-palas-hotel" className={input} /></Field>
            <Field label="OG görsel"><input name="ogImage" defaultValue={business?.ogImage ?? business?.image ?? ""} className={input} /></Field>
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
      <button className="btn btn-solid justify-self-start" type="submit">İçeriği kaydet</button>
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
    <div className="grid place-items-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-6 py-24 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[#EFF4FF] text-[#2563EB]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      </div>
      <h3 className="mt-4 text-[20px] font-bold text-[#0B1C30]">Yakında</h3>
      <p className="mt-1.5 max-w-[420px] text-[14px] text-[#64748B]">
        Bu sekmenin tasarımı hazırlandıkça eklenecek. Menüde yerini şimdiden aldı.
      </p>
    </div>
  </>
);

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

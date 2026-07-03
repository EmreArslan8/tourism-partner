"use client";

import { useState } from "react";
import { updateBusinessStatus } from "@/lib/actions/admin";
import { docsForGroup, COMPANY_FIELDS, GUIDE_FIELDS } from "@/lib/business-fields";
import { Tabs, TabList, Tab, TabPanel } from "@/components/common/Tabs";
import { Dialog, DialogTrigger, DialogClose, DialogContent } from "@/components/common/Dialog";
import type { AdminBusiness } from "@/lib/types";

type TabKey = "pending" | "rejected" | "approved";

/* İşletmenin lifecycle status'unu 3 onay kovasına eşler. */
function bucket(status: AdminBusiness["status"]): TabKey {
  if (status === "pending") return "pending";
  if (status === "approved" || status === "active") return "approved";
  return "rejected"; // rejected, blacklisted, suspended, expired
}

const ICONS: Record<TabKey, React.ReactNode> = {
  pending: <path d="M9 11l3 3 8-8M3 12a9 9 0 1 0 9-9" />,
  rejected: <><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></>,
  approved: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
};

const Svg = ({ children, size = 18 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

const ApprovalBoard = ({ businesses, locale }: { businesses: AdminBusiness[]; locale: string }) => {
  const lang: "tr" | "en" = locale === "en" ? "en" : "tr";
  const counts: Record<TabKey, number> = { pending: 0, rejected: 0, approved: 0 };
  businesses.forEach((b) => { counts[bucket(b.status)]++; });

  const renderList = (key: TabKey) => {
    const list = businesses.filter((b) => bucket(b.status) === key);
    if (list.length === 0) {
      return (
        <p className="rounded-xl border border-dashed border-[#E2E8F0] bg-white px-6 py-12 text-center text-[14px] text-[#94A3B8]">
          Bu sekmede kayıt yok.
        </p>
      );
    }
    return <div className="space-y-4">{list.map((b) => <Card key={b.id} b={b} locale={locale} lang={lang} />)}</div>;
  };

  return (
    <Tabs defaultValue="pending" tone="blue">
      <TabList>
        <Tab value="pending" count={counts.pending}><Svg>{ICONS.pending}</Svg>Bekleyen</Tab>
        <Tab value="rejected" count={counts.rejected}><Svg>{ICONS.rejected}</Svg>Reddedilen</Tab>
        <Tab value="approved" count={counts.approved}><Svg>{ICONS.approved}</Svg>Onaylanan</Tab>
      </TabList>
      <TabPanel value="pending">{renderList("pending")}</TabPanel>
      <TabPanel value="rejected">{renderList("rejected")}</TabPanel>
      <TabPanel value="approved">{renderList("approved")}</TabPanel>
    </Tabs>
  );
};

const Card = ({ b, locale, lang }: { b: AdminBusiness; locale: string; lang: "tr" | "en" }) => {
  const reqDocs = docsForGroup(b.group);
  const uploaded = new Map((b.documents ?? []).map((d) => [d.kind, d]));
  const hasMissingRequired = reqDocs.some((d) => d.required && !uploaded.has(d.kind));

  // Gösterilecek evrak listesi: zorunlu/opsiyonel tanımlılar + ekstra yüklenenler.
  const docRows = [
    ...reqDocs.map((d) => ({ label: d.label[lang], required: d.required, doc: uploaded.get(d.kind) })),
    ...(b.documents ?? [])
      .filter((d) => !reqDocs.some((r) => r.kind === d.kind))
      .map((d) => ({ label: d.name, required: false, doc: d })),
  ];

  // Şirket/dinamik alanlardan birkaç özet (vergi no, ünvan…).
  const fieldDefs = b.group === "rehber" ? GUIDE_FIELDS : COMPANY_FIELDS;
  const detailRows = fieldDefs
    .map((f) => ({ label: f.label[lang], value: b.details?.[f.key] }))
    .filter((r) => r.value);

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,.05)] lg:flex-row">
      {/* Kimlik + iletişim + detaylar */}
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#EFF4FF] text-[#2563EB]">
          <Svg size={24}><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1m4 0h1M9 12h1m4 0h1" /></Svg>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[16px] font-bold leading-tight text-[#0B1C30]">{b.name}</h3>
            <span className="rounded-full bg-[#DAE2FD] px-2.5 py-0.5 text-[12px] font-semibold text-[#1E3A8A]">{b.type}</span>
          </div>
          <div className="mt-2 space-y-1 text-[13px] text-[#64748B]">
            <p className="flex items-center gap-1.5">
              <Svg size={14}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.4" /></Svg>
              {[b.district, b.city, b.country].filter(Boolean).join(", ")}
            </p>
            {b.phone && (
              <p className="flex items-center gap-1.5"><Svg size={14}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.4 2.6 1.2 3 .2 4.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2Z" /></Svg> {b.phone}</p>
            )}
            {detailRows.map((d) => (
              <p key={d.label}><span className="font-semibold text-[#475569]">{d.label}:</span> {d.value}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Evraklar */}
      <div className="lg:w-[280px] lg:shrink-0 lg:border-l lg:border-[#E2E8F0] lg:pl-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.06em] text-[#94A3B8]">Yüklenen Evraklar</p>
        {docRows.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">Tanımlı evrak yok.</p>
        ) : (
          <div className="space-y-2">
            {docRows.map((d, i) =>
              d.doc ? (
                <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px] text-[#0B1C30]">
                  <span className="flex min-w-0 items-center gap-2">
                    <Svg size={16}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6" /></Svg>
                    <span className="truncate">{d.label}</span>
                  </span>
                  {d.doc.url && (
                    <a href={d.doc.url} target="_blank" rel="noreferrer" className="text-[#64748B] hover:text-[#2563EB]" aria-label="Görüntüle">
                      <Svg size={16}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Svg>
                    </a>
                  )}
                </div>
              ) : (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600">
                  <Svg size={16}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></Svg>
                  {d.label} {d.required ? "(Eksik · zorunlu)" : "(Eksik)"}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Aksiyonlar */}
      <div className="flex shrink-0 flex-col gap-2 lg:w-[140px]">
        <form action={updateBusinessStatus}>
          <input type="hidden" name="id" value={b.id} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="status" value="approved" />
          <button
            type="submit"
            disabled={hasMissingRequired}
            title={hasMissingRequired ? "Zorunlu evrak eksik" : undefined}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <Svg size={16}><path d="M20 6 9 17l-5-5" /></Svg> Onayla
          </button>
        </form>
        <RejectButton id={b.id} name={b.name} locale={locale} />
      </div>
    </div>
  );
};

const RejectButton = ({ id, name, locale }: { id: number; name: string; locale: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-300 px-4 py-2.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50">
          <Svg size={16}><path d="M18 6 6 18M6 6l12 12" /></Svg> Reddet
        </button>
      </DialogTrigger>
      <DialogContent title={`Reddet — ${name}`} description="Dilersen gerekçe ekle; işletmeye iletilmek üzere kaydedilir.">
        <form action={updateBusinessStatus} onSubmit={() => setOpen(false)} className="mt-4 grid gap-3">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="status" value="rejected" />
          <textarea name="reason" rows={3} maxLength={500} placeholder="Reddetme gerekçesi (opsiyonel)" className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink outline-none focus:border-red-400" />
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <button type="button" className="rounded-lg border border-line px-4 py-2 text-[13px] font-semibold text-muted hover:bg-cream">İptal</button>
            </DialogClose>
            <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700">Reddet</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalBoard;

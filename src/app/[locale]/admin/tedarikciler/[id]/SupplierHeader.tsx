"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { updateBusinessStatus } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

type StatusTone = "live" | "pending" | "suspended" | "danger" | "muted";

const STATUS_META: Record<string, { label: string; tone: StatusTone }> = {
  approved: { label: "Yayında", tone: "live" },
  active: { label: "Yayında", tone: "live" },
  pending: { label: "Beklemede", tone: "pending" },
  suspended: { label: "Askıda", tone: "suspended" },
  blacklisted: { label: "Blacklist", tone: "danger" },
  rejected: { label: "Reddedildi", tone: "danger" },
  expired: { label: "Pasif", tone: "muted" },
};

const TONE_PILL: Record<StatusTone, string> = {
  live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  suspended: "bg-orange-50 text-orange-700 ring-orange-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  muted: "bg-cream text-muted ring-line",
};

const TONE_DOT: Record<StatusTone, string> = {
  live: "bg-emerald-500",
  pending: "bg-amber-500",
  suspended: "bg-orange-500",
  danger: "bg-red-500",
  muted: "bg-slate-400",
};

export type SupplierHeaderProps = {
  id: number;
  name: string;
  type: string;
  city: string;
  country: string;
  cover: string | null;
  joined: string;
  status: string;
  founderPartner: boolean;
  sponsored: boolean;
  locale: string;
  publicHref: { pathname: "/supplier/[id]"; params: { id: string } };
};

export default function SupplierHeader({
  id,
  name,
  type,
  city,
  country,
  cover,
  joined,
  status,
  founderPartner,
  sponsored,
  locale,
  publicHref,
}: SupplierHeaderProps) {
  const meta = STATUS_META[status] ?? { label: "Taslak", tone: "muted" as StatusTone };

  return (
    <header className="mb-5 border-b border-[#D8DFEA] pb-5">
      {/* Geri linki — navigasyon, aksiyonlardan ayrı */}
      <div className="mb-2">
        <Link href="/admin/tedarikciler" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted hover:text-brand">
          <ArrowLeft size={14} aria-hidden />
          İşletmeler CRM
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        {/* Kimlik */}
        <div className="flex min-w-0 items-stretch gap-3.5">
          <div className="min-h-[92px] w-[104px] shrink-0 self-stretch overflow-hidden rounded-[10px] border border-[#D8DFEA] bg-cream">
            {cover ? (
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-[13px] font-bold uppercase tracking-[.08em] text-muted">
                {name.slice(0, 2).toUpperCase() || "TP"}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-[5px] border border-[#D8DFEA] bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[.08em] text-muted">
                {type}
              </span>
              <span className="text-[12px] font-semibold text-muted">ID #{id}</span>
              {founderPartner && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0e2745] px-2 py-0.5 text-[11px] font-bold text-[#ffb957] ring-1 ring-inset ring-[#ffb957]/40">
                  <FounderMedal className="h-3 w-3" />
                  Kurucu Üye
                </span>
              )}
              {sponsored && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/25">
                  <Sparkles size={12} aria-hidden />
                  Sponsor
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <h1 className="truncate text-[26px] font-extrabold leading-tight text-ink">{name}</h1>
              {founderPartner && <FounderMedal className="h-7 w-7 shrink-0" title="Kurucu Üye" />}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] font-semibold text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} aria-hidden />
                {city}, {country}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} aria-hidden />
                Kayıt {joined}
              </span>
              <Link href={publicHref} className="inline-flex items-center gap-1.5 text-ink hover:text-brand">
                <ExternalLink size={14} aria-hidden />
                Public profili gör
              </Link>
            </div>
          </div>
        </div>

        {/* Durum + aksiyonlar */}
        <div className="flex flex-wrap items-center gap-3 self-start xl:self-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ring-inset",
              TONE_PILL[meta.tone],
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[meta.tone])} aria-hidden />
            {meta.label}
          </span>

          <div className="flex items-center gap-2 rounded-[10px] border border-[#D8DFEA] bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            {status === "suspended" ? (
              <StatusButton
                id={id}
                locale={locale}
                status="approved"
                variant="success"
                icon={<PlayCircle size={16} aria-hidden />}
                label="Yayına Al"
              />
            ) : status === "approved" || status === "active" ? (
              <StatusButton
                id={id}
                locale={locale}
                status="suspended"
                variant="warn"
                icon={<PauseCircle size={16} aria-hidden />}
                label="Askıya Al"
              />
            ) : (
              <StatusButton
                id={id}
                locale={locale}
                status="approved"
                variant="success"
                icon={<CheckCircle2 size={16} aria-hidden />}
                label="Onayla"
              />
            )}
            <DangerMenu id={id} locale={locale} active={status === "blacklisted"} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* Kartlarda (SupplierCard) kullanılan kurucu üye mührü — aynı görsel. */
const FounderMedal = ({ className, title }: { className?: string; title?: string }) => (
  <svg viewBox="0 0 48 54" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    {title && <title>{title}</title>}
    <path d="M13 30v18l11-5 11 5V30Z" fill="#ffb957" />
    <path d="M17.5 32.5v8.7l6.5-3 6.5 3v-8.7Z" fill="#0e2745" />
    <circle cx="24" cy="20" r="16" fill="#0e2745" stroke="#ffb957" strokeWidth="5" />
    <path d="m24 9 3.2 6.5 7.2 1-5.2 5 1.2 7.1-6.4-3.4-6.4 3.4 1.2-7.1-5.2-5 7.2-1Z" fill="#ffb957" />
  </svg>
);

type ButtonVariant = "success" | "warn";

const VARIANT: Record<ButtonVariant, string> = {
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  warn: "bg-amber-400 text-amber-950 hover:bg-amber-500",
};

const StatusButton = ({
  id,
  locale,
  status,
  variant,
  icon,
  label,
}: {
  id: number;
  locale: string;
  status: string;
  variant: ButtonVariant;
  icon: React.ReactNode;
  label: string;
}) => (
  <form action={updateBusinessStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="status" value={status} />
    <button
      type="submit"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-[7px] px-3 text-[12.5px] font-bold transition-colors",
        VARIANT[variant],
      )}
    >
      {icon}
      {label}
    </button>
  </form>
);

const DangerMenu = ({ id, locale, active }: { id: number; locale: string; active: boolean }) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Diğer işlemler"
        aria-expanded={open}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-[7px] transition-colors",
          active ? "bg-red-600 text-white hover:bg-red-700" : "text-muted hover:bg-cream hover:text-ink",
        )}
      >
        <MoreHorizontal size={18} aria-hidden />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-[248px] rounded-[10px] border border-line bg-paper p-2 shadow-card">
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex w-full items-center gap-2 rounded-[7px] px-3 py-2 text-left text-[13px] font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={16} aria-hidden />
              {active ? "Kara listede" : "Yayından Kaldır"}
            </button>
          ) : (
            <div className="px-2 py-1">
              <p className="text-[12.5px] font-semibold text-ink">İşletme yayından kaldırılsın mı?</p>
              <p className="mt-1 text-[12px] text-muted">Public profil erişime kapanır ve kara listeye alınır.</p>
              <div className="mt-3 flex gap-2">
                <form action={updateBusinessStatus} className="flex-1">
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="status" value="blacklisted" />
                  <button
                    type="submit"
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[7px] bg-red-600 px-3 text-[12.5px] font-bold text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 size={15} aria-hidden />
                    Evet, kaldır
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    setOpen(false);
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-[7px] border border-line px-3 text-[12.5px] font-bold text-ink transition-colors hover:bg-cream"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

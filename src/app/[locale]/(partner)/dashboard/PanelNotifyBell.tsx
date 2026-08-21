"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, type Href } from "@/i18n/navigation";
import styles from "./styles";

/* Panel bildirim zili — tıklayınca sayfaya GİTMEZ, küçük bir not açar.
   Şimdilik gelen partner istekleri gösterilir; nottaki satıra tıklanınca
   ilanın partner sekmesine gidilir. */
export default function PanelNotifyBell({
  requests,
  href,
}: {
  requests: { id: number; name: string; meta: string }[];
  href: Href;
}) {
  const t = useTranslations("panel");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const has = requests.length > 0;

  return (
    <div ref={ref} className={styles.notifWrap}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.dashboardTopIcon}
        aria-label={t("notifications")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell size={18} aria-hidden />
        {has && <i />}
      </button>

      {open && (
        <div role="menu" className={styles.notifMenu}>
          <div className={styles.notifHead}>{t("notifications")}</div>
          {has ? (
            <div className={styles.notifList}>
              <Link href={href} role="menuitem" onClick={() => setOpen(false)} className={styles.notifRow}>
                <span className={styles.notifIcon}><Bell size={15} aria-hidden /></span>
                <span className="min-w-0">
                  <strong>{t("notifNewRequests", { count: requests.length })}</strong>
                  <small>{t("notifRequestHint")}</small>
                </span>
              </Link>
              {requests.map((r) => (
                <Link key={r.id} href={href} role="menuitem" onClick={() => setOpen(false)} className={styles.notifRow}>
                  <span className={styles.notifDot} />
                  <span className="min-w-0">
                    <strong>{r.name}</strong>
                    <small>{r.meta}</small>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.notifEmpty}>{t("notifEmpty")}</div>
          )}
        </div>
      )}
    </div>
  );
}

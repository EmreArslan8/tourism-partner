import { Link } from "@/i18n/navigation";
import SupplierGallery from "@/components/SupplierGallery";
import Button from "@/components/common/Button";
import RecordView from "@/components/RecordView";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewsSection from "@/components/ReviewsSection";
import type { Business } from "@/lib/types";
import styles from "./styles";

type TranslationFn = (key: string) => string;

interface Props {
  b: Business;
  t: TranslationFn;
  tc: TranslationFn;
  tCommon: TranslationFn;
  services: string[];
  gallery: string[];
}

const SupplierDetailView = ({ b, t, tc, tCommon, services, gallery }: Props) => {
  return (
    <main className={styles.main}>
      <RecordView type="business" id={b.id} />
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>{t("home")}</Link><span>›</span>
        <Link href={{ pathname: "/explore" }} className={styles.navLink}>{t("explore")}</Link><span>›</span>
        <Link href={{ pathname: "/explore", query: { cat: b.group } }} className={styles.navLink}>{tc(b.group)}</Link>
      </nav>

      <header className={styles.heroHead}>
        <div>
          <h1 className={styles.title}>{b.name}</h1>
          <p className={styles.meta}>
            {[b.type, b.district, b.city].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

      <SupplierGallery
        images={gallery}
        title={b.name}
        eyebrow={`${tc(b.group)} · ${b.type}`}
        adLabel={tCommon("ad")}
        sponsored={b.sponsored}
      />

      <div className={styles.grid}>
        <article>
          <h2 className={cn(styles.h2, "!mt-0")}>{t("about")}</h2>
          <p className={styles.desc}>{b.desc}</p>

          <h2 className={styles.h2}>{t("services")}</h2>
          <div className={styles.svcWrap}>
            {services.map((sv, idx) => (
              <span key={`${sv}-${idx}`} className={styles.svcTag}>{sv}</span>
            ))}
          </div>

          <div className={styles.gated}>
            {t("gated")} <Link href={{ pathname: "/login" }} className={styles.gatedLink}>{t("loginCta")}</Link>.
          </div>

          <ReviewsSection businessId={b.id} />
        </article>

        <aside className={styles.aside}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t("quoteTitle")}</h3>
            <p className={styles.cardSub}>{t("quoteSub")}</p>
            <Button
              href={{ pathname: "/quote", query: { s: b.id.toString() } }}
              block
              className="mt-4"
            >
              {t("requestQuote")}
            </Button>
            <FavoriteButton businessId={b.id} />
          </div>
          {/* Kurum iletişim — herkese açık (yetkili kişi bilgisi BURADA gösterilmez) */}
          {(b.phone || b.website) && (
            <div className={styles.card}>
              <h3 className={cn(styles.cardTitle, "mb-3")}>{t("contactTitle")}</h3>
              {b.phone && (
                <Row k={t("phone")} v={b.phone} href={`tel:${b.phone.replace(/\s+/g, "")}`} />
              )}
              {b.website && (
                <Row
                  k={t("website")}
                  v={b.website.replace(/^https?:\/\//, "")}
                  href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                />
              )}
              <Row k={t("addressLabel")} v={`${b.district}, ${b.city} · ${b.country}`} />
            </div>
          )}

          <div className={styles.card}>
            <h3 className={cn(styles.cardTitle, "mb-3")}>{t("quickInfo")}</h3>
            <Row k={t("category")} v={`${tc(b.group)} · ${b.type}`} />
            <Row k={t("location")} v={`${b.city}, ${b.country}`} />
            <Row k={t("rating")} v={`★ ${b.rating.toFixed(1)} (${b.reviews})`} />
          </div>
        </aside>
      </div>
    </main>
  );
};

const Row = ({ k, v, href }: { k: string; v: string; href?: string }) => (
  <div className={styles.row}>
    <span className={styles.rowKey}>{k}</span>
    {href ? (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={cn(styles.rowVal, "text-terra hover:underline")}
      >
        {v}
      </a>
    ) : (
      <span className={styles.rowVal}>{v}</span>
    )}
  </div>
);

import { cn } from "@/lib/utils";

export default SupplierDetailView;

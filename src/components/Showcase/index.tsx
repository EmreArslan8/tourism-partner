import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Business } from "@/lib/types";
import SupplierCard from "@/components/SupplierCard";
import { styles } from "./styles";


/* Landing vitrini — yalnızca bizim seçtiğimiz (sponsored) işletmeler reklam olarak. */
export default function Showcase({ businesses }: { businesses: Business[] }) {
  const t = useTranslations("showcase");
  const tc = useTranslations("common");
  const sponsored = businesses.filter((b) => b.sponsored);
  return (
    <section id="vitrin">
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.sub}>{t("sub")}</p>
        </div>
        <Link href="/kesfet" className={styles.more}>{tc("viewAll")}</Link>
      </div>

      <div className={styles.rail}>
        {sponsored.slice(0, 4).map((b) => (
          <SupplierCard key={b.id} business={b} flag={tc("ad")}>
            <span className="mr-auto text-[14px] font-bold text-gold">
              ★ {b.rating.toFixed(1)} <small className="font-medium text-muted">({b.reviews})</small>
            </span>
            <Link href="/giris" className="btn btn-outline btn-sm">{tc("detailLogin")}</Link>
          </SupplierCard>
        ))}
      </div>
    </section>
  );
}

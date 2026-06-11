import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SPONSORED } from "@/lib/data";
import SupplierCard from "@/components/SupplierCard";
import { s } from "./styles";

/* Landing vitrini — yalnızca bizim seçtiğimiz (sponsored) işletmeler reklam olarak. */
export default function Showcase() {
  const t = useTranslations("showcase");
  const tc = useTranslations("common");
  return (
    <section id="vitrin">
      <div className={s.head}>
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className={s.title}>{t("title")}</h2>
          <p className={s.sub}>{t("sub")}</p>
        </div>
        <Link href="/listeleme" className={s.more}>{tc("viewAll")}</Link>
      </div>

      <div className={s.rail}>
        {SPONSORED.slice(0, 4).map((b) => (
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

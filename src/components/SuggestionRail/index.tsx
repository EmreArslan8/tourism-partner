"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { businessSlug } from "@/lib/business-slug";
import { dopingRank } from "@/lib/listing";
import type { Business } from "@/lib/types";
import SupplierCard from "@/components/SupplierCard";

/* Çapraz kategori öneri rayı. Aranan kategori dışındaki, aynı bölgedeki işletmeleri
   gösterir. Kartlara impressionId verilir; gösterildikçe görüntülenme sayısı artar ve
   bir sonraki seçimde daha az öne çıkar (impression balancing geri beslemesi). */
export default function SuggestionRail({ items }: { items: Business[] }) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");

  if (items.length === 0) return null;

  return (
    <section className="mt-10 border-t border-line/70 pt-7">
      <div className="mb-4">
        <h2 className="heading-section text-[22px] text-ink">{t("suggestTitle")}</h2>
        <p className="body-muted mt-1 text-[14px]">{t("suggestSub")}</p>
      </div>
      <div className="grid grid-cols-3 gap-5 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1">
        {items.map((b) => (
          <SupplierCard
            key={b.id}
            business={b}
            impressionId={b.id}
            href={{ pathname: "/supplier/[id]", params: { id: businessSlug(b) } }}
            flag={dopingRank(b) === 2 ? tCommon("ad") : dopingRank(b) === 1 ? tCommon("featured") : null}
            showStars
          >
            <Link
              href={{ pathname: "/supplier/[id]", params: { id: businessSlug(b) } }}
              className="btn btn-outline btn-sm !px-3.5 !py-2 !text-[12.5px]"
            >
              {tCommon("detail")}
            </Link>
            <Link
              href={{ pathname: "/quote", query: { s: b.id.toString() } }}
              className="btn btn-solid btn-sm !px-3.5 !py-2 !text-[12.5px]"
            >
              {tCommon("requestQuote")}
            </Link>
          </SupplierCard>
        ))}
      </div>
    </section>
  );
}

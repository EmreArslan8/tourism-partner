"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Award,
  Banknote,
  BadgeCheck,
  Car,
  Check,
  ClipboardCheck,
  CreditCard,
  FileCheck,
  Globe,
  Handshake,
  Languages,
  Layers,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { FeaturedFacetTag } from "@/lib/facets";

/* Hizmetler — Airbnb "Bu mekân size neler sunuyor?" düzeni:
   ikonlu iki kolonlu liste + fazlası için "tümünü göster" butonu. */

const COLLAPSED_COUNT = 10;

/* Facet grubuna göre satır ikonu. */
const FACET_ICONS: Record<string, LucideIcon> = {
  vade: CreditCard,
  kontenjan: Layers,
  calisma: Handshake,
  para: Banknote,
  yildiz: Star,
  konsept: Sparkles,
  olanak: Wifi,
  belge: FileCheck,
  pazar: Globe,
  "uzmanlik-acente": Award,
  "uzmanlik-rehber": Award,
  "rehber-hizmet": Users,
  "tasima-belge": ClipboardCheck,
  "arac-tipi": Car,
  lisans: ShieldCheck,
  "aktivite-satis": Ticket,
  akreditasyon: BadgeCheck,
  paket: Package,
  dil: Languages,
};

const ServicesList = ({ tags }: { tags: FeaturedFacetTag[] }) => {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("supplier");

  const visible = expanded ? tags : tags.slice(0, COLLAPSED_COUNT);
  const hasMore = tags.length > COLLAPSED_COUNT;

  return (
    <div>
      <ul className="grid grid-cols-2 gap-x-8 gap-y-4 min-[1100px]:grid-cols-3 max-[640px]:grid-cols-1">
        {visible.map((tag) => {
          const Icon = FACET_ICONS[tag.facetKey] ?? Check;
          return (
            <li key={tag.slug} className="flex items-center gap-3.5">
              <Icon size={22} strokeWidth={1.7} className="shrink-0 text-ink/75" aria-hidden />
              <span className="text-[14.5px] font-medium leading-6 text-ink/85">{tag.label}</span>
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center rounded-[10px] border border-line bg-cream/50 px-4 py-2.5 text-[13.5px] font-bold text-ink transition-colors hover:bg-cream"
        >
          {expanded ? t("servicesShowLess") : t("servicesShowAll", { count: tags.length })}
        </button>
      )}
    </div>
  );
};

export default ServicesList;

"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BriefcaseBusiness,
  FileCheck2,
  GalleryHorizontal,
  History,
  Loader2,
  Megaphone,
  UserRoundCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey =
  | "ozet"
  | "profil"
  | "belgeler"
  | "icerik-seo"
  | "talepler"
  | "gecmis";

const TABS: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: "ozet", label: "Özet", icon: <BriefcaseBusiness size={15} aria-hidden /> },
  { key: "profil", label: "Profil", icon: <UserRoundCog size={15} aria-hidden /> },
  { key: "icerik-seo", label: "İçerik & SEO", icon: <GalleryHorizontal size={15} aria-hidden /> },
  { key: "belgeler", label: "Belgeler", icon: <FileCheck2 size={15} aria-hidden /> },
  { key: "talepler", label: "Talepler", icon: <Megaphone size={15} aria-hidden /> },
  { key: "gecmis", label: "Geçmiş", icon: <History size={15} aria-hidden /> },
];

export default function BusinessDetailTabs({ activeTab }: { activeTab: TabKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);
  const effectivePendingTab = isPending ? pendingTab : null;

  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const goToTab = (tab: TabKey) => {
    if (tab === activeTab || effectivePendingTab) return;

    const nextParams = new URLSearchParams(currentParams);
    if (tab === "ozet") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tab);
    }

    const href = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    setPendingTab(tab);
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  return (
    <nav className="overflow-x-auto" aria-label="İşletme detay modülleri">
      <div className="grid min-w-[760px] grid-cols-6">
        {TABS.map((tab) => {
          const selected = activeTab === tab.key && !effectivePendingTab;
          const loading = effectivePendingTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => goToTab(tab.key)}
              aria-current={selected ? "page" : undefined}
              disabled={Boolean(effectivePendingTab)}
              className={cn(
                "relative inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-2 text-[12.5px] font-extrabold transition-colors disabled:cursor-wait",
                selected ? "border-ink text-ink" : "border-transparent text-muted hover:border-[#D8DFEA] hover:text-ink",
                loading && "border-brand text-brand",
              )}
            >
              {loading ? <Loader2 size={15} className="animate-spin" aria-hidden /> : tab.icon}
              <span>{tab.label}</span>
              {loading && <span className="text-[11px] font-bold">Yükleniyor</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

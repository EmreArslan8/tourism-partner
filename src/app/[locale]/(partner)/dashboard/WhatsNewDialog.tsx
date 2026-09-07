"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarRange, Lock, Sparkles, Tag, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/common/Dialog";
import { Link } from "@/i18n/navigation";
import styles from "./styles";
import { DEALS_FEATURE_KEY, markFeatureSeen, useFeatureSeen } from "./whats-new";

/* Panele ilk girişte tek seferlik "Fırsat İlanları" duyurusu. Kapatınca (veya
   özelliğe gidince) bir daha açılmaz; sidebar'daki "Yeni" rozeti de söner. */
export default function WhatsNewDialog() {
  const t = useTranslations("panel");
  const seen = useFeatureSeen(DEALS_FEATURE_KEY);
  const [dismissed, setDismissed] = useState(false);

  const close = () => {
    setDismissed(true);
    markFeatureSeen(DEALS_FEATURE_KEY);
  };

  if (seen || dismissed) return null;

  const points = [
    { icon: CalendarRange, text: t("whatsNewPoint1") },
    { icon: Lock, text: t("whatsNewPoint2") },
    { icon: Users, text: t("whatsNewPoint3") },
  ];

  return (
    <Dialog open onOpenChange={(next) => !next && close()}>
      {/* p-0: başlık şeridi kenarlara dayansın; kapatma düğmesi mor zeminde kalır. */}
      <DialogContent scope="theme-light" className="max-w-[460px] overflow-hidden p-0 [&>button]:text-white/70 [&>button:hover]:bg-white/10 [&>button:hover]:text-white">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#4c1d95_0%,#6d28d9_55%,#24113f_100%)] px-6 pb-6 pt-7 text-white">
          {/* Yumuşak ışık lekesi — düz mor yerine derinlik. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -end-10 -top-16 h-40 w-40 rounded-full bg-white/12 blur-2xl"
          />
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[.08em] text-white/90 backdrop-blur-sm">
            <Sparkles size={12} aria-hidden /> {t("whatsNewEyebrow")}
          </span>
          <h2 className="mt-3 text-[21px] font-bold leading-tight">{t("whatsNewTitle")}</h2>
          <p className="mt-2 max-w-[360px] text-[13px] leading-6 text-white/80">{t("whatsNewText")}</p>
        </div>

        <ul className="grid gap-3 px-6 py-5">
          {points.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[#F1ECFF] text-sapphire">
                <Icon size={15} aria-hidden />
              </span>
              <p className="pt-1 text-[13px] leading-5 text-ink/85">{text}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line/70 bg-[#FAFAFD] px-6 py-4">
          <button type="button" onClick={close} className="h-9 rounded-[8px] px-3 text-[13px] font-medium text-muted transition-colors hover:bg-cream hover:text-ink">
            {t("whatsNewLater")}
          </button>
          <Link href="/dashboard/firsatlar" onClick={close} className={`${styles.compactPrimaryButton} h-9`}>
            <Tag size={14} aria-hidden />
            {t("whatsNewCta")}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

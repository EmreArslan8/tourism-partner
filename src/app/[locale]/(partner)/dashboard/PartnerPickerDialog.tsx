"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/common/Dialog";
import { serviceTranslationKey } from "@/lib/categories";
import { sendPartnerRequest, type PartnerRequestActionState } from "@/lib/actions/panel";
import type { PanelPartnerOption } from "./view";
import styles from "./styles";

/* Ücretli üyelik yayını açıldığında kullanılan seçim akışı. Ana dashboard bu
   bileşeni yalnızca sunucudan gelen üyelik yetkisi true olduğunda render eder. */
export default function PartnerPickerDialog({ partnerOptions }: { partnerOptions: PanelPartnerOption[] }) {
  const t = useTranslations("panel");
  const tc = useTranslations("cat");
  const ts = useTranslations("service");
  const serviceName = (value: string) => {
    const key = serviceTranslationKey(value);
    return key ? ts(key) : value;
  };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [city, setCity] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<PanelPartnerOption | null>(null);
  const [requestState, requestAction, requestPending] = useActionState(sendPartnerRequest, {
    status: "idle",
    partnerBusinessId: null,
  } satisfies PartnerRequestActionState);

  const groups = Array.from(new Set(partnerOptions.map((partner) => partner.group))).sort();
  const cities = Array.from(new Set(partnerOptions.map((partner) => partner.city).filter(Boolean))).sort((a, b) => a.localeCompare(b, "tr"));
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredPartners = partnerOptions.filter((partner) => {
    const matchesQuery = !normalizedQuery || [partner.name, partner.type, serviceName(partner.type), partner.city]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase("tr-TR").includes(normalizedQuery));
    return matchesQuery && (!group || partner.group === group) && (!city || partner.city === city);
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedPartner(null);
      setQuery("");
      setGroup("");
      setCity("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" disabled={partnerOptions.length === 0} className={styles.partnerAddButton}>
          <Plus size={16} aria-hidden />
          {t("partnerAdd")}
        </button>
      </DialogTrigger>
      <DialogContent
        title={selectedPartner ? t("partnerConfirmTitle") : t("partnerPickerTitle")}
        description={selectedPartner ? t("partnerConfirmSub", { name: selectedPartner.name }) : t("partnerPickerSub")}
        className={styles.partnerDialog}
      >
        {selectedPartner && requestState.status === "success" && requestState.partnerBusinessId === selectedPartner.id ? (
          <div className={styles.partnerResultState} role="status" aria-live="polite">
            <span className={styles.partnerSuccessIcon}><CheckCircle2 size={24} aria-hidden /></span>
            <div><h3>{t("partnerSendSuccessTitle")}</h3><p>{t("partnerSendSuccessSub", { name: selectedPartner.name })}</p></div>
            <button type="button" onClick={() => handleOpenChange(false)} className={styles.compactPrimaryButton}>{t("partnerDone")}</button>
          </div>
        ) : selectedPartner ? (
          <div className={styles.partnerConfirm}>
            <div className={styles.partnerConfirmCard}>
              <span className={styles.partnerPickName}>{selectedPartner.name}</span>
              <span className={styles.partnerPickMeta}>{[tc(selectedPartner.group), serviceName(selectedPartner.type), selectedPartner.city].filter(Boolean).join(" · ")}</span>
            </div>
            <p>{t("partnerConfirmHint")}</p>
            <div className={styles.partnerDialogActions}>
              <button type="button" onClick={() => setSelectedPartner(null)} className={styles.compactSecondaryButton}>
                <ArrowLeft size={15} className="rtl:rotate-180" aria-hidden />{t("partnerBack")}
              </button>
              <form action={requestAction}>
                <input type="hidden" name="partnerBusinessId" value={selectedPartner.id} />
                <button type="submit" disabled={requestPending} className={styles.compactPrimaryButton}>
                  {requestPending && <LoaderCircle size={15} className="animate-spin" aria-hidden />}
                  {requestPending ? t("partnerSending") : t("partnerConfirmSend")}
                </button>
              </form>
            </div>
            {requestState.status === "error" && requestState.partnerBusinessId === selectedPartner.id && (
              <p className={styles.partnerSendError} role="alert"><AlertCircle size={16} aria-hidden />{requestState.reason === "exists" ? t("partnerAlreadyExists") : t("partnerSendError")}</p>
            )}
          </div>
        ) : (
          <div className={styles.partnerPicker}>
            <label className={styles.partnerSearch}><Search size={17} aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("partnerSearchPlaceholder")} autoFocus /></label>
            <div className={styles.partnerFilters}>
              <select value={group} onChange={(event) => setGroup(event.target.value)} aria-label={t("partnerGroupFilter")}>
                <option value="">{t("partnerAllGroups")}</option>
                {groups.map((item) => <option key={item} value={item}>{tc(item)}</option>)}
              </select>
              <select value={city} onChange={(event) => setCity(event.target.value)} aria-label={t("partnerCityFilter")}>
                <option value="">{t("partnerAllCities")}</option>
                {cities.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <p className={styles.partnerResultCount}>{t("partnerResultCount", { count: filteredPartners.length })}</p>
            <div className={styles.partnerResultList}>
              {filteredPartners.map((partner) => (
                <button key={partner.id} type="button" onClick={() => setSelectedPartner(partner)} className={styles.partnerResultItem}>
                  <span className={styles.partnerPickName}>{partner.name}</span>
                  <span className={styles.partnerPickMeta}>{[tc(partner.group), serviceName(partner.type), partner.city].filter(Boolean).join(" · ")}</span>
                  <span className={styles.partnerResultAction}>{t("partnerSelect")}</span>
                </button>
              ))}
              {filteredPartners.length === 0 && <p className={styles.partnerNoResult}>{t("partnerNoResults")}</p>}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

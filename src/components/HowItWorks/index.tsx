"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  ClipboardList,
  Mail,
  MessagesSquare,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./styles";

type Path = "supplier" | "buyer";
type Step = { Icon: LucideIcon; title: string; desc: string };

const AUTO_ADVANCE_MS = 4500;

const HowItWorks = () => {
  const t = useTranslations("how");
  const [activePath, setActivePath] = useState<Path>("supplier");
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const supplier: Step[] = [
    { Icon: ClipboardList, title: t("s1t"), desc: t("s1d") },
    { Icon: BadgeCheck, title: t("s2t"), desc: t("s2d") },
    { Icon: Mail, title: t("s3t"), desc: t("s3d") },
  ];
  const buyer: Step[] = [
    { Icon: UserPlus, title: t("b1t"), desc: t("b1d") },
    { Icon: SlidersHorizontal, title: t("b2t"), desc: t("b2d") },
    { Icon: MessagesSquare, title: t("b3t"), desc: t("b3d") },
  ];
  const steps = activePath === "supplier" ? supplier : buyer;
  const current = steps[activeStep];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveStep((step) => (step + 1) % 3), AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, activePath]);

  const selectPath = (path: Path) => {
    setActivePath(path);
    setActiveStep(0);
  };

  return (
    <section
      className={styles.section}
      id="nasil"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className={styles.headline}>
        <div>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 className={styles.title}>{t("title")}</h2>
        </div>
        <p className={styles.lead}>{t("lead")}</p>
      </div>

      <div className={styles.stage}>
        <div className={styles.controls}>
          <div className={styles.tabs} role="tablist" aria-label={t("eyebrow")}>
            <button
              type="button"
              role="tab"
              aria-selected={activePath === "supplier"}
              className={activePath === "supplier" ? styles.tabActive : styles.tab}
              onClick={() => selectPath("supplier")}
            >
              <Store size={16} aria-hidden />
              {t("pathSupplier")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePath === "buyer"}
              className={activePath === "buyer" ? styles.tabActive : styles.tab}
              onClick={() => selectPath("buyer")}
            >
              <Search size={16} aria-hidden />
              {t("pathBuyer")}
            </button>
          </div>

          <ol className={styles.steps}>
            {steps.map((step, index) => {
              const selected = index === activeStep;
              const complete = index < activeStep;
              return (
                <li key={`${activePath}-${step.title}`} className={styles.stepItem}>
                  <button
                    type="button"
                    className={selected ? styles.stepActive : styles.step}
                    aria-current={selected ? "step" : undefined}
                    onClick={() => setActiveStep(index)}
                  >
                    <span className={complete ? styles.stepMarkerComplete : selected ? styles.stepMarkerActive : styles.stepMarker}>
                      {complete ? <Check size={15} aria-hidden /> : String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.stepCopy}>
                      <strong className={styles.stepTitle}>{step.title}</strong>
                      <span className={styles.stepDesc}>{step.desc}</span>
                    </span>
                    <step.Icon className={styles.stepIcon} size={19} aria-hidden />
                  </button>
                </li>
              );
            })}
          </ol>

          <Link
            href={{ pathname: activePath === "supplier" ? "/register" : "/explore" }}
            className={styles.cta}
          >
            {activePath === "supplier" ? t("primaryCta") : t("secondaryCta")}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className={styles.preview} aria-live="polite">
          <div className={styles.previewGlow} aria-hidden />
          <div className={styles.previewTopbar} aria-hidden>
            <span /><span /><span />
            <em>tourismpartner.com</em>
          </div>

          <div className={styles.previewBody} key={`${activePath}-${activeStep}`}>
            <div className={styles.previewHead}>
              <span className={styles.previewKicker}>{t("visualKicker")} · 0{activeStep + 1}</span>
            </div>
            <h3 className={styles.previewTitle}>{current.title}</h3>
            <p className={styles.previewSummary}>
              {t(activePath === "supplier" ? `visual${activeStep + 1}` : `visualB${activeStep + 1}`)}
            </p>

            <div className={styles.desktopDemo}>
              {activePath === "supplier" ? (
                <SupplierPreview step={activeStep} t={t} />
              ) : (
                <BuyerPreview step={activeStep} t={t} />
              )}
            </div>

            <div className={styles.mobileDemo}>
              <MobileWorkflowDemo path={activePath} step={activeStep} t={t} />
            </div>
          </div>

          <div className={styles.progress} aria-hidden>
            {steps.map((_, index) => (
              <span key={index} className={index === activeStep ? styles.progressActive : styles.progressDot} />
            ))}
          </div>
        </div>

        <ol className={styles.mobileSteps}>
          {steps.map((step, index) => {
            const selected = index === activeStep;
            const complete = index < activeStep;
            return (
              <li key={`mobile-${activePath}-${step.title}`} className={styles.stepItem}>
                <button type="button" className={selected ? styles.stepActive : styles.step} aria-current={selected ? "step" : undefined} onClick={() => setActiveStep(index)}>
                  <span className={complete ? styles.stepMarkerComplete : selected ? styles.stepMarkerActive : styles.stepMarker}>
                    {complete ? <Check size={15} aria-hidden /> : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.stepCopy}><strong className={styles.stepTitle}>{step.title}</strong></span>
                </button>
              </li>
            );
          })}
        </ol>

        <Link href={{ pathname: activePath === "supplier" ? "/register" : "/explore" }} className={styles.mobileCta}>
          {activePath === "supplier" ? t("primaryCta") : t("secondaryCta")}
          <span aria-hidden>→</span>
        </Link>

      </div>

      <div className={styles.trustRow}>
        {[t("chip1"), t("chip2"), t("chip3")].map((chip) => (
          <span key={chip} className={styles.trustChip}>
            <ShieldCheck size={13} aria-hidden />
            {chip}
          </span>
        ))}
      </div>
    </section>
  );
};

type Translation = ReturnType<typeof useTranslations>;

const MobileWorkflowDemo = ({ path, step, t }: { path: Path; step: number; t: Translation }) => (
  <div className={styles.mobilePhone}>
    <div className={styles.mobilePhoneBar}><span /><em>tourismpartner</em><i>0{step + 1}</i></div>
    <div className={styles.mobilePhoneBody}>
      {path === "supplier" && step === 0 && (
        <><div className={styles.mobileUiToolbar}><span><strong>{t("demoProfile")}</strong><small>64%</small></span><i><b style={{ width: "64%" }} /></i></div><div className={styles.mobileUiProfile}><i>TP</i><span><strong>Tourism Partner</strong><small>{t("demoIstanbulLocation")}</small></span><Check size={14} /></div><div className={styles.mobileUiFields}><span>{t("demoCompany")}<strong>Tourism Partner</strong></span><span>{t("demoCity")}<strong>{t("vf1")}</strong></span></div><small className={styles.mobileUiLabel}>{t("demoCategory")}</small><div className={styles.mobileUiChips}><span>{t("vf1")}</span><span>{t("vf2")}</span><span>{t("vf3")}</span></div></>
      )}
      {path === "supplier" && step === 1 && (
        <><div className={styles.mobileUiToolbar}><span><strong>{t("demoDocuments")}</strong><small>2/3</small></span><i><b style={{ width: "67%" }} /></i></div><div className={styles.mobileUiList}>{[t("demoDoc1"), t("demoDoc2"), t("demoDoc3")].map((item, index) => <span key={item}><i>{index < 2 && <Check size={11} />}</i><strong>{item}</strong><small>{index < 2 ? t("demoApproved") : t("demoPending")}</small></span>)}</div></>
      )}
      {path === "supplier" && step === 2 && (
        <><div className={styles.mobileUiNotice}><Mail size={18} /><span><small>{t("vq1")}</small><strong>{t("vq2")}</strong></span></div><div className={styles.mobileUiStats}><span>{t("demoOpen")}<small>{t("demoRequestStatus")}</small></span><span>3<small>{t("demoIncomingOffers")}</small></span></div><div className={styles.mobileUiFlow}><span><i><Check size={10} /></i><small>{t("demoNew")}</small></span><span><i><Check size={10} /></i><small>{t("demoOpened")}</small></span><span><i>03</i><small>{t("demoReply")}</small></span></div><div className={styles.mobileUiActions}><button type="button">{t("demoViewRequest")}</button><button type="button">{t("demoSendOffer")}</button></div></>
      )}
      {path === "buyer" && step === 0 && (
        <><div className={styles.mobileUiToolbar}><span><strong>{t("demoAccountSetup")}</strong><small>67%</small></span><i><b style={{ width: "67%" }} /></i></div><div className={styles.mobileUiProfile}><UserPlus size={20} /><span><strong>{t("demoBuyerAccount")}</strong><small>{t("demoFree")}</small></span><Check size={14} /></div><div className={styles.mobileUiFields}><span>{t("demoCompany")}<strong>Demo Travel Agency</strong></span><span>{t("demoCity")}<strong>{t("demoIstanbul")}</strong></span></div><div className={styles.mobileUiChoiceRows}>{[t("vf1"), t("vf2"), t("vf3")].map((item, index) => <span key={item}><i>0{index + 1}</i><strong>{item}</strong>{index === 0 && <Check size={11} />}</span>)}</div></>
      )}
      {path === "buyer" && step === 1 && (
        <><div className={styles.mobileUiChips}><span>{t("vf1")}</span><span>{t("vf2")}</span><span>{t("vf3")}</span></div><small className={styles.mobileUiLabel}>3 {t("demoResults")}</small><div className={styles.mobileUiResults}>{[1, 2, 3].map((item) => <span key={item}><i /><strong>Tourism Partner {item}</strong><small>★ 4.{10 - item}</small></span>)}</div><div className={styles.mobileUiSummary}><span><Search size={12} />{t("demoSmartMatch")}</span><strong>3 {t("demoActiveFilter")}</strong></div></>
      )}
      {path === "buyer" && step === 2 && (
        <><div className={styles.mobileUiRequestFields}><span><small>{t("demoRegion")}</small><strong>{t("demoCappadocia")}</strong></span><span><small>{t("demoCategoryLabel")}</small><strong>{t("vf2")}</strong></span><span><small>{t("demoGroupSize")}</small><strong>{t("demoGroupSizeValue", { count: 24 })}</strong></span></div><div className={styles.mobileUiRequest}><small>{t("demoRequestTitle")}</small><strong>{t("vq2")}</strong><button type="button"><Check size={10} />{t("demoPublished")}</button></div><div className={styles.mobileUiOfferRows}>{[1, 2].map((item) => <span key={item}><i>TP</i><b><strong>Tourism Partner {item}</strong><small>{t("demoPrivateOffer")}</small></b><em>₺{item === 1 ? "118.000" : "124.500"}</em></span>)}</div></>
      )}
    </div>
  </div>
);

const SupplierPreview = ({ step, t }: { step: number; t: Translation }) => (
  <div className={styles.mockArea}>
    {step === 0 && <ProfileDemo t={t} />}
    {step === 1 && <VerificationDemo t={t} />}
    {step === 2 && <QuoteDemo t={t} />}
  </div>
);

const BuyerPreview = ({ step, t }: { step: number; t: Translation }) => (
  <div className={styles.mockArea}>
    {step === 0 && <JoinDemo t={t} />}
    {step === 1 && <FilterDemo t={t} />}
    {step === 2 && <RequestOfferDemo t={t} />}
  </div>
);

const ProfileDemo = ({ t }: { t: Translation }) => {
  const options = [t("vf1"), t("vf2"), t("vf3")];
  const [selected, setSelected] = useState<string[]>([options[0]]);
  const completion = 48 + selected.length * 16;

  const toggle = (option: string) => {
    setSelected((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };

  return (
    <div className={styles.demoStack}>
      <div className={styles.demoToolbar}>
        <span><strong>{t("demoProfile")}</strong><small>{completion}%</small></span>
        <span className={styles.demoProgress}><i style={{ width: `${completion}%` }} /></span>
      </div>
      <div className={styles.profileRow}>
        <span className={styles.mockLogo}>TP</span>
        <span className={styles.demoIdentity}><strong>Tourism Partner Demo</strong><small>{t("demoIstanbulLocation")}</small></span>
        <BadgeCheck size={20} aria-hidden />
      </div>
      <div className={styles.demoFields}>
        <span><small>{t("demoCompany")}</small><strong>Tourism Partner</strong></span>
        <span><small>{t("demoCity")}</small><strong>{t("vf1")}</strong></span>
      </div>
      <div className={styles.demoChoice}>
        <small>{t("demoCategory")}</small>
        <div>{options.map((option) => (
          <button key={option} type="button" className={selected.includes(option) ? styles.demoChipActive : styles.demoChip} onClick={() => toggle(option)}>
            {selected.includes(option) && <Check size={12} aria-hidden />}{option}
          </button>
        ))}</div>
      </div>
    </div>
  );
};

const VerificationDemo = ({ t }: { t: Translation }) => {
  const docs = [t("demoDoc1"), t("demoDoc2"), t("demoDoc3")];
  const [checked, setChecked] = useState([true, true, false]);
  const approved = checked.filter(Boolean).length;

  return (
    <div className={styles.demoStack}>
      <div className={styles.demoToolbar}>
        <span><strong>{t("demoDocuments")}</strong><small>{approved}/3</small></span>
        <span className={styles.demoProgress}><i style={{ width: `${approved / 3 * 100}%` }} /></span>
      </div>
      <div className={styles.documentList}>
        {docs.map((doc, index) => (
          <button key={doc} type="button" onClick={() => setChecked((items) => items.map((item, i) => i === index ? !item : item))}>
            <span className={checked[index] ? styles.documentCheckActive : styles.documentCheck}>{checked[index] && <Check size={13} />}</span>
            <strong>{doc}</strong>
            <small className={checked[index] ? styles.approved : styles.pending}>{checked[index] ? t("demoApproved") : t("demoPending")}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

const QuoteDemo = ({ t }: { t: Translation }) => {
  const [opened, setOpened] = useState(true);
  return (
    <div className={styles.demoStack}>
      <button type="button" className={opened ? styles.quotePanelOpen : styles.quotePanel} onClick={() => setOpened((value) => !value)}>
        <span className={styles.quoteIcon}><Mail size={20} /></span>
        <span><small>{t("vq1")}</small><strong>{t("vq2")}</strong></span>
        <i>{opened ? <Check size={18} /> : "→"}</i>
      </button>
      <div className={styles.quoteDetails} data-open={opened}>
        <span><small>{t("demoBudget")}</small><strong>₺120.000</strong></span>
        <span><small>{t("demoDeadline")}</small><strong>24 saat</strong></span>
        <span><small>{t("demoStatus")}</small><strong>{opened ? t("demoOpened") : t("demoNew")}</strong></span>
      </div>
      <div className={styles.quoteFlow}>
        <span><i><Check size={12} /></i><small>{t("demoNew")}</small></span>
        <span><i><Check size={12} /></i><small>{t("demoOpened")}</small></span>
        <span><i>03</i><small>{t("demoReply")}</small></span>
      </div>
      <div className={styles.quoteActions}>
        <button type="button" onClick={() => setOpened(true)}>{t("demoViewRequest")}</button>
        <button type="button">{t("demoSendOffer")}</button>
      </div>
    </div>
  );
};

const JoinDemo = ({ t }: { t: Translation }) => {
  const details = [t("vf1"), t("vf2"), t("vf3")];
  const [active, setActive] = useState(0);
  return (
    <div className={styles.demoStack}>
      <div className={styles.demoToolbar}>
        <span><strong>{t("demoAccountSetup")}</strong><small>67%</small></span>
        <span className={styles.demoProgress}><i style={{ width: "67%" }} /></span>
      </div>
      <div className={styles.joinPanel}>
        <span className={styles.joinIcon}><UserPlus size={26} /></span>
        <span className={styles.demoIdentity}><strong>{t("demoBuyerAccount")}</strong><small>{t("demoFree")}</small></span>
        <Check size={20} />
      </div>
      <div className={styles.demoFields}>
        <span><small>{t("demoCompany")}</small><strong>Demo Travel Agency</strong></span>
        <span><small>{t("demoCity")}</small><strong>{t("demoIstanbul")}</strong></span>
      </div>
      <div className={styles.joinDetails}>
        {details.map((detail, index) => (
          <button key={detail} type="button" className={active === index ? styles.joinDetailActive : ""} onClick={() => setActive(index)}>
            <i>{String(index + 1).padStart(2, "0")}</i><strong>{detail}</strong>{active === index && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
};

const FilterDemo = ({ t }: { t: Translation }) => {
  const filters = [t("vf1"), t("vf2"), t("vf3")];
  const [selected, setSelected] = useState<string[]>([]);
  const count = Math.max(3, 24 - selected.length * 7);
  return (
    <div className={styles.demoStack}>
      <div className={styles.filterRow}>
        {filters.map((filter) => (
          <button key={filter} type="button" className={selected.includes(filter) ? styles.filterActive : ""} onClick={() => setSelected((items) => items.includes(filter) ? items.filter((item) => item !== filter) : [...items, filter])}>
            {filter}{selected.includes(filter) && <Check size={12} />}
          </button>
        ))}
      </div>
      <p className={styles.resultCount}>{count} {t("demoResults")}</p>
      <div className={styles.resultRows}>{[0, 1, 2].map((item) => <button key={item} type="button"><i /><span><strong>Tourism Partner {item + 1}</strong><small>{t("vq2")}</small></span><span>★ 4.{9 - item}</span></button>)}</div>
      <div className={styles.filterSummary}>
        <span><Search size={14} />{t("demoSmartMatch")}</span>
        <strong>{selected.length || 1} {t("demoActiveFilter")}</strong>
      </div>
    </div>
  );
};

const RequestOfferDemo = ({ t }: { t: Translation }) => {
  const [published, setPublished] = useState(false);
  return (
    <div className={styles.requestDemo}>
      <div className={styles.requestFields}>
        <span><small>{t("demoRegion")}</small><strong>{t("demoCappadocia")}</strong></span>
        <span><small>{t("demoCategoryLabel")}</small><strong>{t("vf2")}</strong></span>
        <span><small>{t("demoGroupSize")}</small><strong>{t("demoGroupSizeValue", { count: 24 })}</strong></span>
      </div>
      <div className={styles.requestBrief}>
        <span><small>{t("demoRequestTitle")}</small><strong>{t("vq2")}</strong></span>
        <button type="button" onClick={() => setPublished((value) => !value)}>
          {published ? <><Check size={13} />{t("demoPublished")}</> : t("demoPublish")}
        </button>
      </div>
      {!published && <p className={styles.requestHint}>{t("demoPublishHint")}</p>}
      <div className={published ? styles.offerListVisible : styles.offerList}>
        {[0, 1].map((item) => (
          <span key={item}>
            <i>TP</i>
            <span><strong>Tourism Partner {item + 1}</strong><small>{t("demoPrivateOffer")}</small></span>
            <em>₺{item === 0 ? "118.000" : "124.500"}</em>
          </span>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;

"use client";

import { useState } from "react";
import { ArrowRight, Building2, Check, ChevronDown, Mail, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { Link, useRouter } from "@/i18n/navigation";
import styles from "./styles";

/* Faydalar + "hemen üye ol" formu. Form gönderiminde çok adımlı asıl kayıt
   akışına (/register) geçer; girilen değerler query ile taşınır (kayıt formu
   ileride bunları ön-doldurmak için okuyabilir). */
const WhyJoin = () => {
  const t = useTranslations("whyJoin");
  const tc = useTranslations("cat");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");

  const benefits = [t("b1"), t("b2"), t("b3"), t("b4"), t("b5")];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push({
      pathname: "/register",
      query: {
        ...(name && { name }),
        ...(email && { email }),
        ...(type && { type }),
      },
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
        <h2 className={styles.title}>{t("title")}</h2>
        <ul className={styles.list}>
          {benefits.map((label) => (
            <li key={label} className={styles.item}>
              <span className={styles.check} aria-hidden>
                <Check size={17} strokeWidth={3} />
              </span>
              <span className={styles.itemText}>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.card}>
        <h3 className={styles.formTitle}>{t("formTitle")}</h3>
        <p className={styles.formSub}>{t("formSub")}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <UserRound size={18} className={styles.fieldIcon} aria-hidden />
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("fullName")}
              autoComplete="name"
              className={styles.input}
              aria-label={t("fullName")}
            />
          </div>

          <div className={styles.field}>
            <Mail size={18} className={styles.fieldIcon} aria-hidden />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              autoComplete="email"
              className={styles.input}
              aria-label={t("email")}
            />
          </div>

          <div className={styles.field}>
            <Building2 size={18} className={styles.fieldIcon} aria-hidden />
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${styles.select} ${type ? "" : styles.selectPlaceholder}`}
              aria-label={t("businessType")}
            >
              <option value="" disabled>
                {t("businessType")}
              </option>
              {CATEGORY_GROUPS.map((group) => (
                <option key={group.key} value={group.key} className="text-ink">
                  {tc(group.key)}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className={styles.chevron} aria-hidden />
          </div>

          <button type="submit" className={styles.submit}>
            <span>{t("submit")}</span>
            <ArrowRight size={18} strokeWidth={2.4} className="rtl:rotate-180" aria-hidden />
          </button>
        </form>

        <Link href="/register" className={styles.mobileSubmit}>
          <span>{t("submit")}</span>
          <ArrowRight size={18} strokeWidth={2.4} className="rtl:rotate-180" aria-hidden />
        </Link>

        <p className={styles.foot}>
          {t("haveAccount")}{" "}
          <Link href="/login" className={styles.footLink}>
            {t("login")}
          </Link>
        </p>
      </div>
      </div>
    </section>
  );
};

export default WhyJoin;

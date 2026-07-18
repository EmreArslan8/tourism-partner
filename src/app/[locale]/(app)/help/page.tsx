import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";
import Faq from "@/components/Faq";
import HelpContactForm from "./HelpContactForm";
import styles from "./styles";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "helpPage" });
  return {
    title: `${t("title")} · Tourism Partner`,
    description: t("sub"),
    alternates: localeAlternates(locale as SiteLocale, "/help"),
  };
}

const HelpPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("helpPage");

  return (
    <main className={styles.main}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.sub}>{t("sub")}</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.formCard} aria-labelledby="help-form">
          <h2 id="help-form" className={styles.cardTitle}>{t("formTitle")}</h2>
          <HelpContactForm />
        </section>

        <aside className={styles.asideCard}>
          <h2 className={styles.cardTitle}>{t("otherTitle")}</h2>
          <div className={styles.channel}>
            <strong>{t("otherEmail")}</strong>
            <a href="mailto:info@tourismpartner.world" className={styles.channelLink}>info@tourismpartner.world</a>
          </div>
          <div className={styles.channel}>
            <strong>{t("otherPhone")}</strong>
            <a href="tel:+905384848790" className={styles.channelLink} dir="ltr">+90 538 484 87 90</a>
          </div>
          <div className={styles.channel}>
            <strong>{t("otherPanel")}</strong>
            <p className={styles.channelDesc}>{t("otherPanelDesc")}</p>
          </div>
        </aside>
      </div>

      <Faq />
    </main>
  );
};

export default HelpPage;

import { getTranslations } from "next-intl/server";
import { Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBusinessContactsForViewer } from "@/lib/business-contacts";
import styles from "./styles";

export default async function MemberContactSection({ businessId }: { businessId: number }) {
  const [contactAccess, t] = await Promise.all([
    getBusinessContactsForViewer(businessId),
    getTranslations("supplier"),
  ]);

  if (!contactAccess.isAuthenticated) {
    return (
      <div className={styles.gated}>
        <span className={styles.gatedIcon} aria-hidden>
          <Lock size={20} strokeWidth={2} />
        </span>
        <h2 className={styles.gatedTitle}>{t("gatedTitle")}</h2>
        <p className={styles.gatedText}>{t("gated")}</p>
        <Link href={{ pathname: "/login" }} className={styles.gatedButton}>{t("loginCta")}</Link>
      </div>
    );
  }

  return (
    <section className={styles.memberContacts} aria-labelledby="member-contacts-title">
      <div className={styles.memberContactsHead}>
        <span>{t("memberOnly")}</span>
        <h2 id="member-contacts-title">{t("memberContactsTitle")}</h2>
        <p>{t("memberContactsSub")}</p>
      </div>
      {contactAccess.contacts.length > 0 ? (
        <div className={styles.memberContactGrid}>
          {contactAccess.contacts.map((contact) => (
            <article key={contact.id} className={styles.memberContactCard}>
              <div className={styles.memberContactAvatar}>{contact.fullName.slice(0, 2).toLocaleUpperCase("tr-TR")}</div>
              <div className={styles.memberContactBody}>
                <h3>{contact.fullName}</h3>
                {contact.title && <p>{contact.title}</p>}
                <div className={styles.memberContactLinks}>
                  {contact.phone && <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>}
                  {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.memberContactsEmpty}>{t("memberContactsEmpty")}</p>
      )}
    </section>
  );
}

export function MemberContactSkeleton() {
  return (
    <div className={styles.memberContactsLoading} aria-label="Yetkili kişi bilgileri yükleniyor" aria-busy="true">
      <div />
      <span />
    </div>
  );
}

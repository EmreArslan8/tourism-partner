import { Headset, MessagesSquare, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./styles";

/* Trust — güven rozetleri ("how" namespace'indeki trustTitle / trust1-3). */
const Trust = () => {
  const t = useTranslations("how");
  const items = [
    { t: t("trust1t"), d: t("trust1d"), Icon: ShieldCheck },
    { t: t("trust2t"), d: t("trust2d"), Icon: MessagesSquare },
    { t: t("trust3t"), d: t("trust3d"), Icon: Headset },
  ];

  return (
    <section className={styles.section} aria-label={t("trustTitle")}>
      <ul className={styles.list}>
        {items.map((b) => (
          <li className={styles.item} key={b.t}>
            <span className={styles.icon}>
              <b.Icon size={27} strokeWidth={1.9} aria-hidden />
            </span>
            <span className={styles.body}>
              <strong className={styles.itemTitle}>{b.t}</strong>
              <span className={styles.itemDesc}>{b.d}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Trust;

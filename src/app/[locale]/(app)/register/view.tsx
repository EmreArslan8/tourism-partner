import { Link } from "@/i18n/navigation";
import RegisterForm from "./RegisterForm";
import styles from "./styles";

const RegisterPageView = ({ t }: { t: any }) => {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.sub}>{t("sub")}</p>
        <RegisterForm />
        <p className={styles.footer}>
          {t("haveAccount")} <Link href={{ pathname: "/login" }} className={styles.link}>{t("loginLink")}</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPageView;

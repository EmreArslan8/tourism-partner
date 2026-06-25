import { Link } from "@/i18n/navigation";
import LoginForm from "./LoginForm";
import styles from "./styles";

const LoginPageView = ({ t }: { t: any }) => {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.sub}>{t("sub")}</p>
        <LoginForm />
        <p className={styles.footer}>
          {t("noAccount")} <Link href={{ pathname: "/register" }} className={styles.link}>{t("signupLink")}</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPageView;

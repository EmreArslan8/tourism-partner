import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import styles from "./styles";

/* Alt panel sayfaları için sade üst bar (overview/listings kendi zengin
   topbar'ını view.tsx içinde kullanır). Başlık + çıkış. */
export default function DashboardTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarInner}>
        <div className={styles.topbarText}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.email}>{subtitle}</p>}
        </div>
        <div className={styles.actions}>
          <form action={signOut}>
            <button type="submit" className={styles.compactSecondaryButton}>
              <LogOut size={15} aria-hidden />
              Çıkış
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPanelSession } from "@/lib/panel-auth";
import DashboardShell from "./DashboardShell";
import styles from "./styles";

/* Tüm tedarikçi paneli alt sayfalarını saran ortak kabuk: sol sidebar + workspace.
   Böylece overview/listings/requests ve yeni modüller (favoriler, değerlendirmeler,
   destek, doping) aynı sidebar'ı paylaşır — tek kaynak. */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPanelSession();
  if (!session) redirect({ href: "/login", locale });

  return (
    <main className={styles.main}>
      <DashboardShell email={session!.email}>{children}</DashboardShell>
    </main>
  );
}

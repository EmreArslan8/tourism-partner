import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAdminData } from "@/lib/admin";
import { AdminAccessDenied, AdminShell } from "./_components";

export const metadata: Metadata = {
  title: "Admin Panel — Tourism Partner",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getAdminData();

  if (!data.isAdmin) return <AdminAccessDenied />;

  return <AdminShell data={data}>{children}</AdminShell>;
}

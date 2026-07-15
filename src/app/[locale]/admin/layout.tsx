import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getAdminAccess } from "@/lib/admin-auth";
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

  // getAdminData() cookies okur (runtime). Cache Components için <Suspense> altında;
  // bu boundary içine render edilen admin sayfalarının auth erişimini de kapsar.
  return (
    <div dir="ltr">
      <Suspense fallback={null}>
        <AdminGate>{children}</AdminGate>
      </Suspense>
    </div>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const data = await getAdminAccess();
  if (!data.isAdmin) return <AdminAccessDenied />;
  return <AdminShell data={data}>{children}</AdminShell>;
}

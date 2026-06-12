"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/Header";
import SiteFooter from "@/components/Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = /^\/(tr|en)\/admin(?:\/|$)/.test(pathname);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site";
import { getLegalDoc } from "@/lib/legal-content";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(locale, "kvkk");
  return {
    title: `${doc.title} · Tourism Partner`,
    description: doc.intro.slice(0, 160),
    alternates: localeAlternates(locale as SiteLocale, "/kvkk"),
  };
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={getLegalDoc(locale, "kvkk")} />;
};

export default Page;

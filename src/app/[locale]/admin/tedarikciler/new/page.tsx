import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { BusinessForm, PageHeader } from "../../_components";

export default async function AdminBusinessCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      <PageHeader
        title="Yeni İşletme Kaydı"
        description="Yeni bir tedarikçi/işletme kaydı oluşturun. Zorunlu alanları doldurup kaydedin."
        action={
          <Link
            href="/admin/tedarikciler"
            className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-[13px] font-medium text-ink transition-colors hover:bg-cream"
          >
            <ArrowLeft size={16} aria-hidden />
            Listeye dön
          </Link>
        }
      />

      <BusinessForm locale={locale} defaultEditing />
    </div>
  );
}

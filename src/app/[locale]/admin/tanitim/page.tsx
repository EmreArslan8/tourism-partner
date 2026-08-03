import { Mail } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Card, CardHeader, PageHeader } from "../_components";
import PromoForm from "./PromoForm";
import { listPromoTemplates } from "@/lib/promo-template-store";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const templates = await listPromoTemplates();

  return (
    <>
      <PageHeader
        title="Tanıtım Maili"
        description="Kayıt ekranına yönlendiren tanıtım mailini hazırlayın ve seçtiğiniz adreslere gönderin. Her gönderim güvenlik kaydına yazılır."
      />

      <Card className="hover:translate-y-0">
        <CardHeader title="Mail içeriği ve alıcılar" tone="blue" icon={<Mail size={18} aria-hidden />} />
        <div className="p-5">
          <PromoForm initialTemplates={templates} />
        </div>
      </Card>

      <p className="mt-4 text-[12px] leading-5 text-muted">
        Toplu gönderimde tek seferde en fazla 50 adres kabul edilir ve mailler saniyede iki adetten hızlı
        gitmez; gönderim yaklaşık yarım dakika sürer, sayfayı kapatmayın. Ticari ileti mevzuatı gereği alt
        bilgide firma adı, açık adres ve &ldquo;listeden çık&rdquo; bağlantısı yer alır; yanıt adresi gerçek
        bir posta kutusu olmalıdır.
      </p>
    </>
  );
}

import { setRequestLocale } from "next-intl/server";
import PanelClient, { type PanelBusiness, type PanelQuote } from "../panel/PanelClient";

/* GEÇİCİ — panel UI/UX önizlemesi (mock veri). Demo sonrası silinecek. */
export default async function PanelDemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const business: PanelBusiness = {
    id: 1,
    group: "konaklama",
    type: "Otel",
    name: "Kaya Palas Hotel",
    country: "Türkiye",
    city: "Antalya",
    district: "Muratpaşa",
    description:
      "Denize sıfır, 240 odalı 5 yıldızlı şehir oteli. Acentelere özel kontenjan ve komisyonlu çalışma modeli.",
    phone: "+90 242 000 00 00",
    website: "https://kayapalas.com",
    image: "/assets/cards/hotel-1.jpg",
    images: ["/assets/cards/hotel-2.jpg", "/assets/cards/resort-1.jpg"],
    attributes: ["yildiz-5", "denize-sifir", "havuz", "spa", "komisyonlu", "garanti-kontenjan", "para-eur"],
    status: "approved",
    verified: true,
    sponsored: true,
    created_at: "2026-05-01T10:00:00Z",
  };

  const quotes: PanelQuote[] = [
    {
      id: 101, name: "Selin Acar", company: "Akdeniz Tur", email: "selin@akdeniztur.com",
      service: "Grup konaklama", date_range: "12–18 Temmuz", people: 24,
      message: "24 kişilik grup için yarım pansiyon, deniz manzaralı oda talebimiz var. Komisyon oranınız nedir?",
      status: "new", created_at: "2026-06-11T08:30:00Z",
    },
    {
      id: 102, name: "Mert Yılmaz", company: "Vizyon Seyahat", email: "mert@vizyon.com.tr",
      service: "Transfer + konaklama", date_range: "20–22 Temmuz", people: 8,
      message: "Havalimanı transferi dahil 2 gece için fiyat alabilir miyiz?",
      status: "new", created_at: "2026-06-10T14:05:00Z",
    },
    {
      id: 103, name: "Ayça Demir", company: null, email: "ayca.demir@gmail.com",
      service: "Grup konaklama", date_range: "1–5 Ağustos", people: 40,
      message: "Düğün organizasyonu için 40 kişilik blok rezervasyon düşünüyoruz.",
      status: "new", created_at: "2026-06-09T19:20:00Z",
    },
  ];

  return (
    <PanelClient
      business={business}
      quotes={quotes}
      email="info@kayapalas.com"
      userId="demo-user"
      group="konaklama"
      meta={{ firm_name: "Kaya Palas Hotel", biz_type: "Otel" }}
    />
  );
}

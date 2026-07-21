import { templateParam } from "@/lib/whatsapp";
import { formatDate } from "@/lib/email-templates/quote-notification";

/* Meta'ya onaya gönderilecek şablon (kategori: UTILITY).
   Şablon adı env'deki WHATSAPP_TEMPLATE_NAME ile birebir aynı olmalı.

   ÖNEMLİ: Meta'da aynı şablon adının HER DİLİ ayrı ayrı onaylanır. Kod
   alıcının diline göre language.code gönderir; o dil onaylı değilse Meta
   132001 döner. Bu yüzden hangi dillerin hazır olduğu env ile bildirilir:
   WHATSAPP_TEMPLATE_LANGS=tr,en (listede olmayan dil için ilk dile düşülür).

   Gövde — Türkçe (language: tr). Meta gövdenin değişkenle başlamasına/
   bitmesine izin vermez; ilk satır sabit metinle açılır:
     Tourism Partner bildirimi: *{{1}}* işletmeniz için yeni bir teklif talebi var.
     Talebi gönderen: {{2}}
     Hizmet: {{3}}
     Bölge: {{4}}
     Tarih: {{5}}
     Kişi sayısı: {{6}}
     Teklif için son tarih: {{7}}
     Talebin tamamını panelinizden görüntüleyip yanıtlayabilirsiniz.
   Buton: "Panelde görüntüle" → statik URL (…/tr/panel/talepler)

   Gövde — İngilizce (language: en). Değişken sırası Türkçesiyle AYNI olmalı:
     Tourism Partner notification: you have a new quote request for *{{1}}*.
     Requested by: {{2}}
     Service: {{3}}
     Region: {{4}}
     Dates: {{5}}
     Group size: {{6}}
     Respond by: {{7}}
     You can view and answer the full request from your dashboard.
   Buton: "Open dashboard" → statik URL (…/en/dashboard/requests)

   Not: Şablon değişkenleri boş bırakılamaz; eksik alanlar "—" ile doldurulur. */

type QuoteWhatsappInput = {
  businessName: string;
  senderName: string;
  service: string | null;
  category: string | null;
  location: string | null;
  dateRange: string | null;
  validUntil: string | null;
  people: number | null;
};

/* Sayı/tarih biçimi de mesajın diliyle uyumlu olmalı; aksi halde İngilizce
   şablonun içine "01 Ağustos 2026" düşer. */
const INTL_LOCALE: Record<string, string> = { tr: "tr-TR", en: "en-GB" };

export function quoteNotificationWhatsapp(input: QuoteWhatsappInput, language: string = "tr"): string[] {
  const intlLocale = INTL_LOCALE[language] ?? INTL_LOCALE.tr;
  const dateRange = input.dateRange
    ? input.dateRange.split(" - ").map((part) => formatDate(part, intlLocale)).join(" – ")
    : null;
  const people = input.people != null
    ? `${input.people.toLocaleString(intlLocale)} ${language === "en" ? "people" : "kişi"}`
    : null;
  return [
    templateParam(input.businessName, 60),
    templateParam(input.senderName, 60),
    templateParam(input.service ?? input.category, 80),
    templateParam(input.location, 80),
    templateParam(dateRange, 60),
    templateParam(people, 30),
    templateParam(input.validUntil ? formatDate(input.validUntil, intlLocale) : null, 40),
  ];
}

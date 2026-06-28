import type { Business } from "./types";

/* Faz 1 seed verisi — statik prototipten taşındı + yeni kategoriler (sağlık,
   eğlence) ve Ankara kayıtları eklendi. İleride Supabase'e taşınacak.
   `sponsored: true` olanlar landing vitrininde reklam olarak gösterilir.
   `attributes`: filtreleme facet slug'ları — bkz. lib/facets.ts */
export const BUSINESSES: Business[] = [
  // ---- KONAKLAMA ----
  { id: 1, group: "konaklama", type: "Otel", name: "Kaya Palas Hotel", country: "Türkiye", city: "Antalya", district: "Muratpaşa", coords: [36.885, 30.705],
    desc: "Denize sıfır, 240 odalı 5 yıldızlı şehir oteli. Acentelere özel kontenjan ve komisyonlu çalışma modeli.",
    rating: 4.8, reviews: 132, tag: "5 Yıldız", verified: true, sponsored: true, image: "/assets/cards/hotel-1.webp",
    attributes: ["yildiz-5", "denize-sifir", "havuz", "spa", "komisyonlu", "garanti-kontenjan", "para-eur", "para-try"] },
  { id: 2, group: "konaklama", type: "Butik Otel", name: "Taş Konak Cappadocia", country: "Türkiye", city: "Nevşehir", district: "Ürgüp", coords: [38.630, 34.910],
    desc: "Restore edilmiş kaya oteli, 28 butik oda. Balon turu paketleriyle kombine B2B fiyatlandırma.",
    rating: 4.9, reviews: 98, tag: "Butik", verified: true, sponsored: true, image: "/assets/cards/hotel-2.webp",
    attributes: ["butik", "oda-kahvalti", "komisyonlu", "vadeli", "para-try"] },
  { id: 3, group: "konaklama", type: "Otel", name: "Marmara Liman Otel", country: "Türkiye", city: "İstanbul", district: "Beyoğlu", coords: [41.032, 28.977],
    desc: "Galata bölgesinde 76 odalı şehir oteli. Grup konaklamalarında esnek iptal koşulları.",
    rating: 4.5, reviews: 210, tag: "Şehir Oteli", verified: false, sponsored: false, image: "/assets/cards/hotel-3.webp",
    attributes: ["yildiz-4", "oda-kahvalti", "esnek-iptal", "talep-uzerine", "para-try"] },
  { id: 4, group: "konaklama", type: "Resort", name: "Ege Bay Resort", country: "Türkiye", city: "Muğla", district: "Bodrum", coords: [37.034, 27.430],
    desc: "Her şey dahil konseptli 380 odalı resort. Yurt dışı acenteler için charter kontenjanı mevcut.",
    rating: 4.6, reviews: 301, tag: "Resort", verified: true, sponsored: true, image: "/assets/cards/resort-1.webp",
    attributes: ["yildiz-5", "hersey-dahil", "denize-sifir", "havuz", "spa", "cocuk-kulubu", "garanti-kontenjan", "komisyonlu", "para-eur"] },
  { id: 5, group: "konaklama", type: "Butik Otel", name: "Santorini Blue Suites", country: "Yunanistan", city: "Santorini", district: "Oia", coords: [36.461, 25.375],
    desc: "Caldera manzaralı 18 süit. Türk acentelerle TL bazlı sözleşme imkânı, balayı segmenti odaklı.",
    rating: 4.9, reviews: 87, tag: "Butik", verified: true, sponsored: false, image: "/assets/cards/hotel-1.webp",
    attributes: ["butik", "oda-kahvalti", "denize-sifir", "vadeli", "para-try"] },
  { id: 23, group: "konaklama", type: "Otel", name: "Başkent Grand Otel", country: "Türkiye", city: "Ankara", district: "Çankaya", coords: [39.905, 32.855],
    desc: "Kızılay merkezde 160 odalı kongre oteli. Kurumsal grup ve MICE kontenjanı.",
    rating: 4.4, reviews: 142, tag: "Kongre", verified: true, sponsored: false,
    attributes: ["yildiz-4", "mice-salon", "oda-kahvalti", "cari-hesap", "para-try"] },

  // ---- ACENTE & TUR ----
  { id: 6, group: "acente", type: "Seyahat Acentesi", name: "Anadolu Tur & Travel", country: "Türkiye", city: "İstanbul", district: "Kadıköy", coords: [40.990, 29.030],
    desc: "A grubu işletme belgeli incoming acentesi. Kültür turları ve MICE organizasyonlarında 15 yıllık deneyim.",
    rating: 4.7, reviews: 64, tag: "A Grubu", verified: true, sponsored: true, image: "/assets/cards/agency-1.webp",
    attributes: ["a-grubu", "kultur-turu", "mice", "pazar-avrupa", "komisyonlu", "dil-en", "dil-de"] },
  { id: 7, group: "acente", type: "Seyahat Acentesi", name: "Likya Travel", country: "Türkiye", city: "Antalya", district: "Kaş", coords: [36.200, 29.640],
    desc: "Batı Akdeniz odaklı butik acente. Yat kiralama, mavi yolculuk ve dalış paketlerinde B2B iş birliği.",
    rating: 4.8, reviews: 45, tag: "Butik", verified: true, sponsored: false,
    attributes: ["b-grubu", "mavi-yolculuk", "komisyonlu", "pazar-avrupa", "dil-en"] },
  { id: 8, group: "acente", type: "Seyahat Acentesi", name: "Doğu Ekspres Turizm", country: "Türkiye", city: "İzmir", district: "Konak", coords: [38.420, 27.130],
    desc: "Yurt içi paket turlar ve okul gezilerinde uzman acente. Acenteler arası kontenjan paylaşımına açık.",
    rating: 4.4, reviews: 89, tag: "Yurt İçi", verified: false, sponsored: false,
    attributes: ["a-grubu", "okul-gezisi", "talep-uzerine", "para-try", "dil-en"] },
  { id: 9, group: "acente", type: "DMC", name: "Batum Gateway DMC", country: "Gürcistan", city: "Batum", district: "Merkez", coords: [41.640, 41.640],
    desc: "Gürcistan'da yerel DMC. Türk acenteler için Batum–Tiflis kombine programları ve transfer ağı.",
    rating: 4.6, reviews: 38, tag: "DMC", verified: true, sponsored: false,
    attributes: ["kultur-turu", "pazar-rusya-bdt", "komisyonlu", "cari-hesap", "dil-en", "dil-ru"] },
  { id: 18, group: "acente", type: "Tur Firması", name: "Tbilisi Old Town Tours", country: "Gürcistan", city: "Tiflis", district: "Mtatsminda", coords: [41.715, 44.800],
    desc: "Tiflis şehir turları ve şarap rotaları operatörü. Türkçe rehberli programlar, acente komisyonu %15.",
    rating: 4.7, reviews: 52, tag: "Şehir Turu", verified: true, sponsored: false,
    attributes: ["kultur-turu", "komisyonlu", "pazar-avrupa", "dil-en"] },

  // ---- REHBERLİK ----
  { id: 10, group: "rehber", type: "Tur Rehberi", name: "Elif Demirkan", country: "Türkiye", city: "İstanbul", district: "Fatih", coords: [41.013, 28.950],
    desc: "TUREB ruhsatlı profesyonel rehber. İngilizce & İspanyolca, tarihi yarımada ve müze turlarında uzman.",
    rating: 5.0, reviews: 156, tag: "EN · ES", verified: true, sponsored: true, image: "/assets/cards/guide-1.webp",
    attributes: ["dil-en", "dil-es", "uz-tarihi", "uz-muze"] },
  { id: 11, group: "rehber", type: "Tur Rehberi", name: "Mehmet Aksoy", country: "Türkiye", city: "Nevşehir", district: "Avanos", coords: [38.715, 34.850],
    desc: "Kapadokya bölge rehberi. Almanca grup turları, atölye ziyaretleri ve özel trekking rotaları.",
    rating: 4.9, reviews: 121, tag: "DE", verified: true, sponsored: false,
    attributes: ["dil-de", "uz-doga"] },
  { id: 12, group: "rehber", type: "Tur Rehberi", name: "Ayşe Yıldız", country: "Türkiye", city: "İzmir", district: "Selçuk", coords: [37.950, 27.370],
    desc: "Efes ve çevresi arkeoloji turlarında 12 yıllık deneyim. Fransızca ve İngilizce kruvaziyer grupları.",
    rating: 4.8, reviews: 203, tag: "FR · EN", verified: true, sponsored: false,
    attributes: ["dil-fr", "dil-en", "uz-tarihi", "uz-kruvaziyer"] },
  { id: 13, group: "rehber", type: "Tur Rehberi", name: "Kerem Ulusoy", country: "Türkiye", city: "Muğla", district: "Fethiye", coords: [36.650, 29.120],
    desc: "Likya Yolu ve doğa turları rehberi. Rusça konuşan gruplar için tekne ve yamaç paraşütü programları.",
    rating: 4.7, reviews: 77, tag: "RU", verified: false, sponsored: false,
    attributes: ["dil-ru", "uz-doga"] },

  // ---- EĞLENCE ----
  { id: 14, group: "eglence", type: "Balon Turu", name: "Göktürk Balloons", country: "Türkiye", city: "Nevşehir", district: "Göreme", coords: [38.643, 34.830],
    desc: "Sivil havacılık lisanslı balon işletmesi. Acentelere sezonluk blok satış ve komisyon modeli.",
    rating: 4.9, reviews: 412, tag: "Balon Turu", verified: true, sponsored: true, image: "/assets/cards/balloon-1.webp",
    attributes: ["lisansli", "blok-satis", "komisyonlu", "garanti-kontenjan", "para-eur", "para-try"] },
  { id: 15, group: "eglence", type: "Tekne / Yat", name: "Mavi Yol Yachting", country: "Türkiye", city: "Muğla", district: "Marmaris", coords: [36.850, 28.270],
    desc: "12 guletlik filoyla mavi yolculuk operasyonu. Haftalık kiralama ve kabin satışında B2B fiyat listesi.",
    rating: 4.8, reviews: 96, tag: "Gulet", verified: true, sponsored: false, image: "/assets/cards/yacht-1.webp",
    attributes: ["blok-satis", "talep-uzerine", "komisyonlu", "para-eur"] },
  { id: 16, group: "eglence", type: "Adrenalin Sporları", name: "Pamukkale Adventures", country: "Türkiye", city: "Denizli", district: "Pamukkale", coords: [37.920, 29.120],
    desc: "Yamaç paraşütü ve antik kent kombine turları. Günlük operasyon, acente paneli üzerinden anlık kontenjan.",
    rating: 4.6, reviews: 154, tag: "Macera", verified: true, sponsored: false,
    attributes: ["lisansli", "gunluk-operasyon", "acente-paneli", "anlik-kontenjan", "komisyonlu"] },
  { id: 17, group: "eglence", type: "Tekne / Yat", name: "Bosphorus Line Cruises", country: "Türkiye", city: "İstanbul", district: "Beşiktaş", coords: [41.043, 29.007],
    desc: "Boğaz teknesi ve davet organizasyonları. Kurumsal etkinlik ve incoming gruplara özel kapasite.",
    rating: 4.5, reviews: 188, tag: "Tekne Turu", verified: false, sponsored: false,
    attributes: ["gunluk-operasyon", "talep-uzerine", "para-try"] },
  { id: 22, group: "eglence", type: "Binicilik", name: "Atlı Doğa Binicilik", country: "Türkiye", city: "Ankara", district: "Gölbaşı", coords: [39.790, 32.800],
    desc: "Doğa içinde at safari ve binicilik dersleri. Kurumsal etkinlik ve okul grupları için paketler.",
    rating: 4.7, reviews: 63, tag: "Binicilik", verified: false, sponsored: false,
    attributes: ["gunluk-operasyon", "komisyonlu", "para-try"] },

  // ---- SAĞLIK TURİZMİ ----
  { id: 19, group: "saglik", type: "Diş Kliniği", name: "Çankaya Diş Estetik", country: "Türkiye", city: "Ankara", district: "Çankaya", coords: [39.905, 32.860],
    desc: "İmplant ve gülüş tasarımında uzman klinik. Yurt dışı hasta için konaklama+transfer paketleri.",
    rating: 4.9, reviews: 240, tag: "Diş", verified: true, sponsored: true, image: "/assets/cards/clinic-1.webp",
    attributes: ["paket-konaklama-transfer", "refakat-tercuman", "komisyonlu", "dil-en", "dil-ar", "para-eur", "para-usd"] },
  { id: 20, group: "saglik", type: "Saç Kliniği", name: "Capital Hair Clinic", country: "Türkiye", city: "Ankara", district: "Çankaya", coords: [39.910, 32.850],
    desc: "FUE/DHI saç ekimi merkezi. Acente ve aracılar için komisyonlu sağlık turizmi anlaşmaları.",
    rating: 4.8, reviews: 318, tag: "Saç Ekimi", verified: true, sponsored: false,
    attributes: ["paket-konaklama-transfer", "komisyonlu", "dil-en", "dil-ar", "para-eur"] },
  { id: 21, group: "saglik", type: "Hastane", name: "Anadolu Sağlık Hastanesi", country: "Türkiye", city: "Ankara", district: "Çankaya", coords: [39.900, 32.865],
    desc: "JCI akreditasyonlu özel hastane. Uluslararası hasta birimi ve çok dilli koordinasyon.",
    rating: 4.7, reviews: 196, tag: "JCI", verified: true, sponsored: false,
    attributes: ["jci", "iso", "refakat-tercuman", "dil-en", "dil-de", "dil-ru", "para-eur", "para-usd"] },
];

export function getBusiness(id: number | string): Business | undefined {
  return BUSINESSES.find((b) => b.id === Number(id));
}

export const CITIES = [...new Set(BUSINESSES.map((b) => b.city))].sort((a, b) =>
  a.localeCompare(b, "tr")
);

export const COUNTRIES = [...new Set(BUSINESSES.map((b) => b.country))].sort((a, b) =>
  a.localeCompare(b, "tr")
);

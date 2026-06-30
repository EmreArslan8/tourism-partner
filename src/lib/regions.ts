export type CityRegion = {
  name: string;
  districts: string[];
};

export type CountryRegion = {
  country: string;
  cities: CityRegion[];
};

export const REGION_TREE: CountryRegion[] = [
  {
    country: "Türkiye",
    cities: [
      { name: "Ankara", districts: ["Altındağ", "Çankaya", "Etimesgut", "Gölbaşı", "Keçiören", "Mamak", "Pursaklar", "Sincan", "Yenimahalle"] },
      { name: "Antalya", districts: ["Aksu", "Alanya", "Döşemealtı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Kumluca", "Manavgat", "Muratpaşa", "Serik"] },
      { name: "Aydın", districts: ["Didim", "Efeler", "Kuşadası", "Söke"] },
      { name: "Balıkesir", districts: ["Ayvalık", "Burhaniye", "Edremit", "Karesi"] },
      { name: "Bursa", districts: ["Mudanya", "Nilüfer", "Osmangazi", "Yıldırım"] },
      { name: "Çanakkale", districts: ["Ayvacık", "Bozcaada", "Çanakkale Merkez", "Gökçeada"] },
      { name: "Denizli", districts: ["Merkezefendi", "Pamukkale"] },
      { name: "İstanbul", districts: ["Adalar", "Ataşehir", "Avcılar", "Bağcılar", "Bakırköy", "Başakşehir", "Beşiktaş", "Beyoğlu", "Büyükçekmece", "Eminönü", "Eyüpsultan", "Fatih", "Kadıköy", "Kartal", "Sarıyer", "Şişli", "Tuzla", "Üsküdar", "Zeytinburnu"] },
      { name: "İzmir", districts: ["Balçova", "Bornova", "Çeşme", "Foça", "Karşıyaka", "Konak", "Seferihisar", "Selçuk", "Urla"] },
      { name: "Mersin", districts: ["Akdeniz", "Erdemli", "Mezitli", "Silifke", "Tarsus", "Yenişehir"] },
      { name: "Muğla", districts: ["Bodrum", "Dalaman", "Datça", "Fethiye", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Ula"] },
      { name: "Nevşehir", districts: ["Avanos", "Göreme", "Merkez", "Ürgüp"] },
      { name: "Trabzon", districts: ["Akçaabat", "Ortahisar", "Sürmene", "Uzungöl", "Yomra"] },
    ],
  },
  {
    country: "Gürcistan",
    cities: [
      { name: "Batum", districts: ["Merkez"] },
      { name: "Kutaisi", districts: ["Merkez"] },
      { name: "Tiflis", districts: ["Mtatsminda", "Old Tbilisi", "Saburtalo", "Vake"] },
    ],
  },
  {
    country: "Yunanistan",
    cities: [
      { name: "Atina", districts: ["Merkez", "Plaka", "Pire"] },
      { name: "Girit", districts: ["Hanya", "Heraklion", "Resmo"] },
      { name: "Mikonos", districts: ["Merkez"] },
      { name: "Rodos", districts: ["Merkez"] },
      { name: "Santorini", districts: ["Fira", "Imerovigli", "Oia"] },
      { name: "Selanik", districts: ["Merkez"] },
    ],
  },
];

const byCountry = new Map(REGION_TREE.map((region) => [region.country, region]));

export function getCountryOptions() {
  return REGION_TREE.map((region) => region.country);
}

export function getCityOptions(country: string) {
  return (byCountry.get(country)?.cities ?? []).map((city) => city.name);
}

export function getDistrictOptions(country: string, city: string) {
  return byCountry.get(country)?.cities.find((item) => item.name === city)?.districts ?? [];
}

export function isValidRegion(country: string, city: string, district: string) {
  return getDistrictOptions(country, city).includes(district);
}

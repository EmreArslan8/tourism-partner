import { setRequestLocale } from "next-intl/server";
import { getBusinesses } from "@/lib/businesses";
import GlobeDestinations, { type GlobePoint } from "@/components/Globe/GlobeDestinations";

/*
 * /globe — etkileşimli destinasyon globe'u DENEME rotası (anasayfa bozulmadan).
 * İşletmeler şehre göre gruplanıp pin'e dönüşür; pin yüksekliği = işletme sayısı.
 */
export default async function GlobePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const businesses = await getBusinesses();

  const byCity = new Map<string, GlobePoint>();
  for (const b of businesses) {
    if (!b.coords) continue;
    const [lat, lng] = b.coords;
    const existing = byCity.get(b.city);
    if (existing) existing.count += 1;
    else byCity.set(b.city, { city: b.city, lat, lng, count: 1 });
  }
  const points = [...byCity.values()];

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-pine">
      <GlobeDestinations points={points} />
    </main>
  );
}

import type { Business } from "@/lib/types";
import { realBusinessImages } from "@/lib/business-images";
import { premiumVisibilityRank } from "@/lib/business-visibility";
import { profileScore } from "@/lib/listing";

/* Vitrine yalnız 5 kart çıkar; ama karıştırma çeşitliliği için birkaç yedek aday
   gerekir. Tüm işletmeleri client'a taşımak yerine (RSC payload'ı ~85KB şişiyordu)
   sunucu uygun havuzu bu sayıya kırpıp gönderir; client bu küçük havuzda karıştırır. */
export const SHOWCASE_POOL_LIMIT = 12;

const hasGallery = (b: Business): boolean => realBusinessImages(b.image, b.images).length > 0;

/* Vitrinde gösterilmeye uygun işletmeler: görünürlük dopingi olan + galerili,
   görünürlük → puan → profil skoru sırasıyla. Saf fonksiyon — hem sunucu (havuzu
   kırpıp payload'ı küçültür) hem client (SSR sırası) aynı sonucu üretir. */
export function rankShowcaseCandidates(businesses: Business[]): Business[] {
  return businesses
    .filter((business) => premiumVisibilityRank(business) > 0 && hasGallery(business))
    .sort(
      (a, b) =>
        premiumVisibilityRank(b) - premiumVisibilityRank(a) ||
        b.rating - a.rating ||
        profileScore(b) - profileScore(a),
    );
}

import type { AdminMembership } from "@/lib/types";

/* Üyelik süresi yardımcıları — admin dashboard önizlemesi ve CRM "sonlanan" bölümü
   ile üyelik uzatma aksiyonu bu türetmeleri paylaşır. Saf fonksiyonlar (server yok). */

/** Bitişe 14 gün veya daha az kalınca "yakında bitiyor" uyarısı verilir. */
export const EXPIRY_WARNING_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Bitişe kalan tam gün sayısı (yukarı yuvarlanır); tarih geçmişse negatif döner. */
export function membershipDaysLeft(endsAt: string, now: Date = new Date()): number {
  return Math.ceil((new Date(endsAt).getTime() - now.getTime()) / DAY_MS);
}

export type MembershipState = "active" | "expiring" | "expired";

/** Üyeliğin türetilmiş durumu: tarih + kayıt statüsü birlikte değerlendirilir
    (cron gecikirse ends_at geçmiş ama status hâlâ active olabilir → yine expired). */
export function membershipState(
  membership: Pick<AdminMembership, "status" | "endsAt">,
  now: Date = new Date(),
): MembershipState {
  const days = membershipDaysLeft(membership.endsAt, now);
  if (membership.status === "expired" || membership.status === "cancelled" || days < 0) return "expired";
  if (days <= EXPIRY_WARNING_DAYS) return "expiring";
  return "active";
}

/** Her işletme için en güncel (en geç biten) üyeliği seçer. */
export function latestMembershipByBusiness(memberships: AdminMembership[]): Map<number, AdminMembership> {
  const map = new Map<number, AdminMembership>();
  for (const membership of memberships) {
    const current = map.get(membership.businessId);
    if (!current || new Date(membership.endsAt).getTime() > new Date(current.endsAt).getTime()) {
      map.set(membership.businessId, membership);
    }
  }
  return map;
}

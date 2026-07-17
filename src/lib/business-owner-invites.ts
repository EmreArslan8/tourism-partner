import "server-only";

import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type BusinessOwnerInviteStatus = "pending" | "accepted" | "revoked" | "expired";

export type BusinessOwnershipView = {
  ownerId: string | null;
  ownerEmail: string | null;
  invite: {
    id: number;
    email: string;
    status: BusinessOwnerInviteStatus;
    expiresAt: string;
    acceptedAt: string | null;
    deliveryStatus: "pending" | "sent" | "failed";
    deliveryError: string | null;
    lastSentAt: string | null;
  } | null;
};

export type PublicBusinessInvite = {
  businessId: number;
  businessName: string;
  email: string;
  status: BusinessOwnerInviteStatus;
  expiresAt: string;
  acceptedBy: string | null;
  viewerId: string | null;
  viewerEmail: string | null;
};

export function normalizeInviteEmail(value: string) {
  return value.trim().toLowerCase();
}

export function hashBusinessInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function adminDb() {
  const admin = createAdminClient();
  // Tablo migration ile geliyor; tipler deploy sonrası gen:types ile yenilenebilir.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return admin ? (admin as any) : null;
}

export async function getBusinessOwnership(businessId: number): Promise<BusinessOwnershipView> {
  const admin = adminDb();
  if (!admin || !Number.isInteger(businessId) || businessId <= 0) {
    return { ownerId: null, ownerEmail: null, invite: null };
  }

  const [{ data: business }, { data: invite }] = await Promise.all([
    admin.from("businesses").select("owner_id").eq("id", businessId).maybeSingle(),
    admin
      .from("business_owner_invites")
      .select("id,email,status,expires_at,accepted_at,delivery_status,delivery_error,last_sent_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  let ownerEmail: string | null = null;
  if (business?.owner_id) {
    const { data } = await admin.auth.admin.getUserById(business.owner_id);
    ownerEmail = data.user?.email ?? null;
  }

  const effectiveStatus = invite?.status === "pending" && new Date(invite.expires_at).getTime() <= Date.now()
    ? "expired"
    : invite?.status;

  return {
    ownerId: business?.owner_id ?? null,
    ownerEmail,
    invite: invite
      ? {
          id: Number(invite.id),
          email: String(invite.email),
          status: effectiveStatus as BusinessOwnerInviteStatus,
          expiresAt: String(invite.expires_at),
          acceptedAt: invite.accepted_at ? String(invite.accepted_at) : null,
          deliveryStatus: invite.delivery_status,
          deliveryError: invite.delivery_error,
          lastSentAt: invite.last_sent_at,
        }
      : null,
  };
}

export async function getPublicBusinessInvite(token: string): Promise<PublicBusinessInvite | null> {
  if (!token || token.length < 30 || token.length > 160) return null;
  const admin = adminDb();
  if (!admin) return null;

  const tokenHash = hashBusinessInviteToken(token);
  const { data: invite } = await admin
    .from("business_owner_invites")
    .select("business_id,email,status,expires_at,accepted_by")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (!invite) return null;

  const [{ data: business }, supabase] = await Promise.all([
    admin.from("businesses").select("name").eq("id", invite.business_id).maybeSingle(),
    createClient(),
  ]);
  if (!business) return null;

  const { data: userData } = await supabase.auth.getUser();
  const expired = invite.status === "pending" && new Date(invite.expires_at).getTime() <= Date.now();

  return {
    businessId: Number(invite.business_id),
    businessName: String(business.name),
    email: String(invite.email),
    status: (expired ? "expired" : invite.status) as BusinessOwnerInviteStatus,
    expiresAt: String(invite.expires_at),
    acceptedBy: invite.accepted_by,
    viewerId: userData.user?.id ?? null,
    viewerEmail: userData.user?.email?.toLowerCase() ?? null,
  };
}

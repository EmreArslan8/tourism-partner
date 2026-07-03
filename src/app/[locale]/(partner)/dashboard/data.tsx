import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { withSignedDocumentUrls } from "@/lib/business-documents";
import DashboardView, { PanelBusiness, PanelDraft, PanelMembership, PanelQuote } from "./view";

export type DashboardMode = "overview" | "listings" | "edit";

export async function PanelData({
  locale,
  mode,
  listingId,
}: {
  locale: string;
  mode: DashboardMode;
  listingId?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";
  if (!userId) redirect({ href: "/login", locale });

  // Alıcı-üye (listelenmeyen firma) tedarikçi panelini kullanmaz → keşfete yönlendir.
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.account_type === "buyer") redirect({ href: "/explore", locale });

  const { data: biz } = await supabase
    .from("businesses")
    .select(
      "id,group,type,name,country,city,district,description,phone,website,image,images,attributes,details,documents,status,verified,sponsored,created_at"
    )
    .eq("owner_id", user!.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (listingId && biz?.id && listingId !== String(biz.id)) {
    redirect({ href: "/dashboard/listings", locale });
  }

  let draft = null;
  if (!biz) {
    const { data } = await supabase
      .from("business_drafts")
      .select("draft_key,group,cover_image,gallery_images,documents")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    draft = data;
  }

  let quotes: PanelQuote[] = [];
  let membership: PanelMembership | null = null;
  if (biz) {
    const [{ data: q }, { data: m }] = await Promise.all([
      supabase
        .from("quotes")
        .select("id,name,company,email,service,date_range,people,message,status,created_at")
        .eq("business_id", biz.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("business_memberships")
        .select("id,plan,status,starts_at,ends_at")
        .eq("business_id", biz.id)
        .order("ends_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    quotes = (q as PanelQuote[]) ?? [];
    membership = (m as PanelMembership | null) ?? null;
  }

  const meta = (user!.user_metadata ?? {}) as Record<string, string>;
  const group = (biz?.group as string) || meta.biz_group || "konaklama";
  const business = biz
    ? { ...biz, documents: await withSignedDocumentUrls(supabase, biz.documents) }
    : null;
  const signedDraftDocuments = draft
    ? await withSignedDocumentUrls(supabase, draft.documents)
    : [];

  return (
    <DashboardView
      mode={mode}
      business={business as PanelBusiness | null}
      quotes={quotes}
      membership={membership}
      email={user!.email ?? ""}
      userId={userId}
      group={group}
      meta={{ firm_name: meta.firm_name ?? "", biz_type: meta.biz_type ?? "" }}
      draft={
        !biz && draft
          ? {
              draftKey: draft.draft_key,
              group: draft.group,
              cover: draft.cover_image ?? "",
              gallery: draft.gallery_images ?? [],
              documents: signedDraftDocuments as PanelDraft["documents"],
            }
          : null
      }
    />
  );
}

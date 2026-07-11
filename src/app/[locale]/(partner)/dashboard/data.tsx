import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPanelUser, getPanelSession } from "@/lib/panel-auth";
import { withSignedDocumentUrls } from "@/lib/business-documents";
import DashboardView, {
  PanelBusiness,
  PanelContact,
  PanelDraft,
  PanelPartnerOption,
  PanelPartnerRequest,
  PanelQuote,
} from "./view";
import type { PanelViewStats } from "./Overview";

export type DashboardMode = "overview" | "listings" | "edit";

const DAY_MS = 86_400_000;

/* Son 7 gün + önceki 7 gün görüntülenme (impression) ve profil detay ziyareti (business).
   page_views yalnızca service-role ile okunabildiğinden admin client kullanılır; anahtar
   yoksa veya satır yoksa tüm sayılar 0 döner (Overview bunu sorunsuz gösterir). */
async function loadViewStats(businessId: number): Promise<PanelViewStats> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfToday.getTime() - (6 - i) * DAY_MS);
    return { label: d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }), impressions: 0, details: 0 };
  });
  const empty: PanelViewStats = { current: 0, previous: 0, days };

  const admin = createAdminClient();
  if (!admin) return empty;

  const since = new Date(startOfToday.getTime() - 13 * DAY_MS);
  const { data, error } = await admin
    .from("page_views")
    .select("entity_type,viewed_at")
    .eq("entity_id", businessId)
    .in("entity_type", ["impression", "business"])
    .gte("viewed_at", since.toISOString());
  if (error || !data) return empty;

  let current = 0;
  let previous = 0;
  for (const row of data as { entity_type: string; viewed_at: string }[]) {
    const viewed = new Date(row.viewed_at);
    const viewedDay = new Date(viewed.getFullYear(), viewed.getMonth(), viewed.getDate());
    const dayIndex = Math.floor((startOfToday.getTime() - viewedDay.getTime()) / DAY_MS);
    if (dayIndex >= 0 && dayIndex <= 6) {
      current += 1;
      const slot = days[6 - dayIndex];
      if (row.entity_type === "impression") slot.impressions += 1;
      else slot.details += 1;
    } else if (dayIndex >= 7 && dayIndex <= 13) {
      previous += 1;
    }
  }
  return { current, previous, days };
}

export async function PanelData({
  locale,
  mode,
  listingId,
}: {
  locale: string;
  mode: DashboardMode;
  listingId?: string;
}) {
  const user = await getPanelUser();
  if (!user) redirect({ href: "/login", locale });
  const userId = user!.id;

  // Alıcı-üye (listelenmeyen firma) tedarikçi panelini kullanmaz → keşfete yönlendir.
  const session = await getPanelSession();
  if (session?.accountType === "buyer") redirect({ href: "/explore", locale });

  const supabase = await createClient();
  const { data: businessRow } = await supabase
    .from("businesses")
    .select(
      "id,group,type,name,country,city,district,description,phone,website,socials,image,images,attributes,details,documents,status,verified,sponsored,founder_partner,created_at"
    )
    .eq("owner_id", user!.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (listingId && businessRow?.id && listingId !== String(businessRow.id)) {
    redirect({ href: "/dashboard/listings", locale });
  }

  let draft = null;
  if (!businessRow) {
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
  let contacts: PanelContact[] = [];
  let partnerOptions: PanelPartnerOption[] = [];
  let acceptedPartners: PanelPartnerOption[] = [];
  let incomingPartnerRequests: PanelPartnerRequest[] = [];
  let outgoingPartnerRequests: PanelPartnerRequest[] = [];
  if (businessRow) {
    const [{ data: q }, { data: c }, { data: partnerRequests }, { data: options }] = await Promise.all([
      supabase
        .from("quotes")
        .select("id,name,company,email,phone,service,category_group,category_type,country,city,district,date_range,valid_until,people,message,status,created_at")
        .eq("business_id", businessRow.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("business_contacts")
        .select("full_name,title,phone,email")
        .eq("business_id", businessRow.id)
        .order("id", { ascending: true }),
      supabase
        .from("business_partner_requests")
        .select("id,requester_business_id,receiver_business_id,status,created_at")
        .or(`requester_business_id.eq.${businessRow.id},receiver_business_id.eq.${businessRow.id}`)
        .order("created_at", { ascending: false }),
      supabase
        .from("businesses")
        .select("id,name,group,type,city")
        .eq("status", "approved")
        .neq("id", businessRow.id)
        .order("name", { ascending: true }),
    ]);
    quotes = (q as PanelQuote[]) ?? [];
    contacts = (c as PanelContact[]) ?? [];
    const requests = ((partnerRequests ?? []) as {
      id: number;
      requester_business_id: number;
      receiver_business_id: number;
      status: "pending" | "accepted" | "rejected";
    }[]);
    const partnerBusinessIds = new Set<number>();
    requests.forEach((request) => {
      partnerBusinessIds.add(
        Number(request.requester_business_id) === Number(businessRow.id)
          ? Number(request.receiver_business_id)
          : Number(request.requester_business_id),
      );
    });

    const optionRows = ((options ?? []) as PanelPartnerOption[]).slice(0, 200);
    const optionById = new Map(optionRows.map((option) => [Number(option.id), option]));
    const toRequest = (request: (typeof requests)[number]): PanelPartnerRequest | null => {
      const businessId = Number(request.requester_business_id) === Number(businessRow.id)
        ? Number(request.receiver_business_id)
        : Number(request.requester_business_id);
      const business = optionById.get(businessId);
      return business ? { id: Number(request.id), business } : null;
    };

    acceptedPartners = requests
      .filter((request) => request.status === "accepted")
      .map(toRequest)
      .filter((request): request is PanelPartnerRequest => Boolean(request))
      .map((request) => request.business);
    incomingPartnerRequests = requests
      .filter((request) => request.status === "pending" && Number(request.receiver_business_id) === Number(businessRow.id))
      .map(toRequest)
      .filter((request): request is PanelPartnerRequest => Boolean(request));
    outgoingPartnerRequests = requests
      .filter((request) => request.status === "pending" && Number(request.requester_business_id) === Number(businessRow.id))
      .map(toRequest)
      .filter((request): request is PanelPartnerRequest => Boolean(request));
    partnerOptions = optionRows.filter((option) => !partnerBusinessIds.has(Number(option.id)));
  }

  const meta = (user!.user_metadata ?? {}) as Record<string, string>;
  const group = (businessRow?.group as string) || meta.biz_group || "konaklama";
  const business = businessRow
    ? {
        id: businessRow.id,
        group: businessRow.group,
        type: businessRow.type,
        name: businessRow.name,
        country: businessRow.country,
        city: businessRow.city,
        district: businessRow.district,
        description: businessRow.description,
        phone: businessRow.phone,
        website: businessRow.website,
        socials: businessRow.socials ?? {},
        image: businessRow.image,
        images: businessRow.images,
        attributes: businessRow.attributes,
        details: businessRow.details,
        status: businessRow.status,
        verified: businessRow.verified,
        sponsored: businessRow.sponsored,
        founderPartner: businessRow.founder_partner ?? false,
        created_at: businessRow.created_at,
        documents: await withSignedDocumentUrls(supabase, businessRow.documents),
      }
    : null;
  const signedDraftDocuments = draft
    ? await withSignedDocumentUrls(supabase, draft.documents)
    : [];

  const viewStats: PanelViewStats = businessRow
    ? await loadViewStats(Number(businessRow.id))
    : { current: 0, previous: 0, days: [] };

  return (
    <DashboardView
      mode={mode}
      business={business as PanelBusiness | null}
      quotes={quotes}
      viewStats={viewStats}
      email={user!.email ?? ""}
      userId={userId}
      group={group}
      contacts={contacts}
      partnerOptions={partnerOptions}
      acceptedPartners={acceptedPartners}
      incomingPartnerRequests={incomingPartnerRequests}
      outgoingPartnerRequests={outgoingPartnerRequests}
      meta={{ firm_name: meta.firm_name ?? "", biz_type: meta.biz_type ?? "" }}
      draft={
        !businessRow && draft
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

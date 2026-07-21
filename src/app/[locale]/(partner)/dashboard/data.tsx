import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { selectAll } from "@/lib/supabase/select-all";
import { getPanelUser, getPanelSession } from "@/lib/panel-auth";
import { withSignedDocumentUrls } from "@/lib/business-documents";
import { getServiceSlugs } from "@/lib/business-services";
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
  // Sayfalanarak çekilir: limit yazılmasa bile PostgREST 1000 satırda sessizce keser,
  // bu da çok görüntülenen bir işletmenin 14 günlük trendini eksik gösterirdi.
  const { data, error } = await selectAll(
    (from, to) =>
      admin
        .from("page_views")
        .select("entity_type,viewed_at,id")
        .eq("entity_id", businessId)
        .in("entity_type", ["impression", "business"])
        .gte("viewed_at", since.toISOString())
        .order("id", { ascending: false })
        .range(from, to),
    { label: "panel/page_views" },
  );
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

  // Alıcılar kendi dashboard özetini kullanır; tedarikçi ekranlarına doğrudan erişemez.
  const session = await getPanelSession();
  if (session?.accountType === "buyer") redirect({ href: "/dashboard", locale });

  const supabase = await createClient();
  const { data: businessRows } = await supabase
    .from("businesses")
    .select(
      "id,group,type,name,country,city,district,description,phone,website,socials,image,images,attributes,details,documents,status,verified,sponsored,founder_partner,created_at"
    )
    .eq("owner_id", user!.id)
    .order("id");

  const ownedRows = businessRows ?? [];
  const selectedBusinessRow =
    listingId
      ? ownedRows.find((row) => String(row.id) === listingId) ?? null
      : mode === "edit"
        ? null
        : ownedRows[0] ?? null;

  if (listingId && !selectedBusinessRow) {
    redirect({ href: "/dashboard/businesses", locale });
  }

  let draft = null;
  if (!selectedBusinessRow && mode === "edit") {
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
  if (selectedBusinessRow) {
    const [{ data: q }, { data: c }, { data: partnerRequests }, { data: options }] = await Promise.all([
      supabase
        .from("quotes")
        .select("id,name,company,email,phone,service,category_group,category_type,country,city,district,date_range,valid_until,people,message,status,created_at")
        .eq("business_id", selectedBusinessRow.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("business_contacts")
        .select("full_name,title,phone,email")
        .eq("business_id", selectedBusinessRow.id)
        .order("id", { ascending: true }),
      supabase
        .from("business_partner_requests")
        .select("id,requester_business_id,receiver_business_id,status,created_at")
        .or(`requester_business_id.eq.${selectedBusinessRow.id},receiver_business_id.eq.${selectedBusinessRow.id}`)
        .order("created_at", { ascending: false }),
      supabase
        .from("businesses")
        .select("id,name,group,type,city")
        .eq("status", "approved")
        .neq("id", selectedBusinessRow.id)
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
        Number(request.requester_business_id) === Number(selectedBusinessRow.id)
          ? Number(request.receiver_business_id)
          : Number(request.requester_business_id),
      );
    });

    const optionRows = ((options ?? []) as PanelPartnerOption[]).slice(0, 200);
    const optionById = new Map(optionRows.map((option) => [Number(option.id), option]));
    const toRequest = (request: (typeof requests)[number]): PanelPartnerRequest | null => {
      const businessId = Number(request.requester_business_id) === Number(selectedBusinessRow.id)
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
      .filter((request) => request.status === "pending" && Number(request.receiver_business_id) === Number(selectedBusinessRow.id))
      .map(toRequest)
      .filter((request): request is PanelPartnerRequest => Boolean(request));
    outgoingPartnerRequests = requests
      .filter((request) => request.status === "pending" && Number(request.requester_business_id) === Number(selectedBusinessRow.id))
      .map(toRequest)
      .filter((request): request is PanelPartnerRequest => Boolean(request));
    partnerOptions = optionRows.filter((option) => !partnerBusinessIds.has(Number(option.id)));
  }

  const meta = (user!.user_metadata ?? {}) as Record<string, string>;
  const group = (selectedBusinessRow?.group as string) || meta.biz_group || "konaklama";
  const business = selectedBusinessRow
    ? {
        id: selectedBusinessRow.id,
        group: selectedBusinessRow.group,
        type: selectedBusinessRow.type,
        name: selectedBusinessRow.name,
        country: selectedBusinessRow.country,
        city: selectedBusinessRow.city,
        district: selectedBusinessRow.district,
        description: selectedBusinessRow.description,
        phone: selectedBusinessRow.phone,
        website: selectedBusinessRow.website,
        socials: selectedBusinessRow.socials ?? {},
        image: selectedBusinessRow.image,
        images: selectedBusinessRow.images,
        attributes: selectedBusinessRow.attributes,
        details: selectedBusinessRow.details,
        status: selectedBusinessRow.status,
        verified: selectedBusinessRow.verified,
        sponsored: selectedBusinessRow.sponsored,
        founderPartner: selectedBusinessRow.founder_partner ?? false,
        created_at: selectedBusinessRow.created_at,
        documents: await withSignedDocumentUrls(supabase, selectedBusinessRow.documents),
        serviceTypes: await getServiceSlugs(supabase, selectedBusinessRow.id),
      }
    : null;
  const businesses = await Promise.all(
    ownedRows.map(async (row) => ({
      id: row.id,
      group: row.group,
      type: row.type,
      name: row.name,
      country: row.country,
      city: row.city,
      district: row.district,
      description: row.description,
      phone: row.phone,
      website: row.website,
      socials: row.socials ?? {},
      image: row.image,
      images: row.images,
      attributes: row.attributes,
      details: row.details,
      status: row.status,
      verified: row.verified,
      sponsored: row.sponsored,
      founderPartner: row.founder_partner ?? false,
      created_at: row.created_at,
      documents: await withSignedDocumentUrls(supabase, row.documents),
      serviceTypes: await getServiceSlugs(supabase, row.id),
    })),
  );
  const signedDraftDocuments = draft
    ? await withSignedDocumentUrls(supabase, draft.documents)
    : [];

  const viewStats: PanelViewStats = selectedBusinessRow
    ? await loadViewStats(Number(selectedBusinessRow.id))
    : { current: 0, previous: 0, days: [] };

  return (
    <DashboardView
      mode={mode}
      business={business as PanelBusiness | null}
      businesses={businesses as PanelBusiness[]}
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
        !selectedBusinessRow && draft
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

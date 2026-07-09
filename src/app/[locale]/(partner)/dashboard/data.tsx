import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
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
      "id,group,type,name,country,city,district,description,phone,website,image,images,attributes,details,documents,status,verified,sponsored,founder_partner_number,created_at"
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
        .select("id,name,company,email,phone,service,category_group,category_type,country,city,district,date_range,people,message,status,created_at")
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
        image: businessRow.image,
        images: businessRow.images,
        attributes: businessRow.attributes,
        details: businessRow.details,
        status: businessRow.status,
        verified: businessRow.verified,
        sponsored: businessRow.sponsored,
        founderPartnerNumber: businessRow.founder_partner_number ?? undefined,
        created_at: businessRow.created_at,
        documents: await withSignedDocumentUrls(supabase, businessRow.documents),
      }
    : null;
  const signedDraftDocuments = draft
    ? await withSignedDocumentUrls(supabase, draft.documents)
    : [];

  return (
    <DashboardView
      mode={mode}
      business={business as PanelBusiness | null}
      quotes={quotes}
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

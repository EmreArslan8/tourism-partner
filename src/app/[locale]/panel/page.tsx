import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import PanelClient, { type PanelBusiness, type PanelQuote } from "./PanelClient";

/* Firma paneli — yalnızca giriş yapmış firma sahibi. Kendi ilanını ve gelen
   teklifleri görür/düzenler. Oturum yoksa /giris'e yönlenir.
   Auth (cookies) runtime erişimi olduğundan veri kısmı <Suspense> altında;
   Cache Components statik kabuğu hemen, dinamik içeriği stream eder. */
export default async function PanelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <PanelData locale={locale} />
    </Suspense>
  );
}

async function PanelData({ locale }: { locale: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/giris", locale });

  const { data: biz } = await supabase
    .from("businesses")
    .select(
      "id,group,type,name,country,city,district,description,phone,website,image,images,attributes,status,verified,sponsored,created_at"
    )
    .eq("owner_id", user!.id)
    .order("id")
    .limit(1)
    .maybeSingle();

  let quotes: PanelQuote[] = [];
  if (biz) {
    const { data: q } = await supabase
      .from("quotes")
      .select("id,name,company,email,service,date_range,people,message,status,created_at")
      .eq("business_id", biz.id)
      .order("created_at", { ascending: false });
    quotes = (q as PanelQuote[]) ?? [];
  }

  const meta = (user!.user_metadata ?? {}) as Record<string, string>;
  const group = (biz?.group as string) || meta.biz_group || "konaklama";

  return (
    <PanelClient
      business={biz as PanelBusiness | null}
      quotes={quotes}
      email={user!.email ?? ""}
      userId={user!.id}
      group={group}
      meta={{ firm_name: meta.firm_name ?? "", biz_type: meta.biz_type ?? "" }}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { BUSINESSES, getBusiness } from "@/lib/data";
import { GROUP_COLORS } from "@/lib/categories";
import { initials } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BUSINESSES.map((b) => ({ locale, id: String(b.id) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const b = getBusiness(id);
  return { title: b ? `${b.name} — Tourism Partner` : "Tourism Partner" };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const b = getBusiness(id);
  if (!b) notFound();

  const t = await getTranslations("supplier");
  const tc = await getTranslations("cat");
  const tCommon = await getTranslations("common");
  const services = [b.type, t("svcGroupDiscount"), t("svcTransfer"), t("svcCommission")];

  return (
    <main className="container-px py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">{t("home")}</Link><span>›</span>
        <Link href="/listeleme" className="hover:text-ink">{t("explore")}</Link><span>›</span>
        <Link href={`/listeleme?cat=${b.group}`} className="hover:text-ink">{tc(b.group)}</Link><span>›</span>
        <strong className="text-ink">{b.name}</strong>
      </nav>

      <section
        className="relative grid h-[200px] place-items-center overflow-hidden rounded-[18px] text-white/90"
        style={{ background: GROUP_COLORS[b.group] }}
      >
        {b.sponsored && (
          <span className="absolute right-4 top-4 rounded-pill bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[.06em] text-[#2a2208]">{tCommon("ad")}</span>
        )}
        <span className="font-display text-[64px] italic">{initials(b.name)}</span>
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_360px] items-start gap-7 max-[900px]:grid-cols-1">
        <article>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[clamp(26px,3vw,38px)]">{b.name}</h1>
            {b.verified && <span className="text-[12px] font-bold text-group-acente">✓ {tCommon("verified")}</span>}
          </div>
          <p className="mt-2 text-[14.5px] text-muted">
            {tc(b.group)} · {b.type} &nbsp;|&nbsp; {b.district}, {b.city} · {b.country}
            &nbsp;|&nbsp; <span className="text-gold">★ {b.rating.toFixed(1)}</span> ({b.reviews})
          </p>

          <h2 className="mt-7 text-[22px]">{t("about")}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.desc}</p>

          <h2 className="mt-7 text-[22px]">{t("services")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {services.map((sv) => (
              <span key={sv} className="rounded-pill border border-line bg-cream px-3 py-1.5 text-[13px] font-medium">{sv}</span>
            ))}
          </div>

          <div className="mt-7 rounded-[14px] border border-dashed border-line bg-cream px-5 py-4 text-[13.5px] text-muted">
            {t("gated")} <Link href="/giris" className="font-semibold text-terra">{t("loginCta")}</Link>.
          </div>
        </article>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[16px] border border-line bg-paper p-5 shadow-card">
            <h3 className="text-[18px]">{t("quoteTitle")}</h3>
            <p className="mt-1 text-[13.5px] text-muted">{t("quoteSub")}</p>
            <Link href={`/teklif?s=${b.id}`} className="btn btn-solid btn-block mt-4">{t("requestQuote")}</Link>
          </div>
          <div className="rounded-[16px] border border-line bg-paper p-5 shadow-card">
            <h3 className="mb-3 text-[18px]">{t("quickInfo")}</h3>
            <Row k={t("category")} v={`${tc(b.group)} · ${b.type}`} />
            <Row k={t("location")} v={`${b.city}, ${b.country}`} />
            <Row k={t("rating")} v={`★ ${b.rating.toFixed(1)} (${b.reviews})`} />
            <Row k={t("verification")} v={b.verified ? t("verifiedDone") : t("verifiedPending")} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-t border-line py-2 text-[13.5px] first:border-t-0">
      <span className="text-muted">{k}</span>
      <span className="font-medium text-ink">{v}</span>
    </div>
  );
}

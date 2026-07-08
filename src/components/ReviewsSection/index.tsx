"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { submitReview, type ReviewState } from "@/lib/actions/reviews";

/* İşletme detayında Değerlendirme & Yorum bölümü — client island (SSG korunur).
   Yorumlar herkese açık okunur; yorum formu yalnız giriş yapmış kullanıcıya
   gösterilir ve kendi işletmesini puanlayamaz. */

type ReviewItem = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  author: { name: string } | { name: string }[] | null;
};

const fmt = (v: string) => new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(v));
const authorName = (a: ReviewItem["author"]) => (Array.isArray(a) ? a[0]?.name : a?.name) ?? "Bir iş ortağı";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} className={n <= value ? "fill-terra text-terra" : "text-line"} aria-hidden />
      ))}
    </span>
  );
}

export default function ReviewsSection({ businessId }: { businessId: number }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [rating, setRating] = useState(5);
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, { ok: false });

  const fetchData = useCallback(async () => {
    const sb = createClient();
    const [{ data: { user } }, { data }] = await Promise.all([
      sb.auth.getUser(),
      sb
        .from("reviews")
        .select("id,rating,comment,created_at,author:businesses!reviews_author_business_id_fkey(name)")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false }),
    ]);
    return { loggedIn: !!user, rows: (data ?? []) as unknown as ReviewItem[] };
  }, [businessId]);

  useEffect(() => {
    let active = true;
    fetchData().then(({ loggedIn: li, rows }) => {
      if (!active) return;
      setLoggedIn(li);
      setReviews(rows);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [fetchData]);

  useEffect(() => {
    if (!state.ok) return;
    let active = true;
    fetchData().then(({ rows }) => {
      if (active) setReviews(rows);
    });
    return () => {
      active = false;
    };
  }, [state.ok, fetchData]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mt-8">
      <h2 className="mb-1 inline-flex items-center gap-2 text-[17px] font-extrabold text-ink">
        Değerlendirmeler
        {reviews.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted">
            · {avg.toFixed(1)} <Star size={13} className="fill-terra text-terra" aria-hidden /> ({reviews.length})
          </span>
        )}
      </h2>
      <p className="mb-4 text-[13px] text-muted">İş birliği yaptığınız iş ortaklarını puanlayın — B2B güven duvarı.</p>

      {ready && loggedIn && (
        <form action={action} className="mb-5 rounded-[14px] border border-line bg-paper p-4">
          <input type="hidden" name="business_id" value={businessId} />
          <input type="hidden" name="rating" value={rating} />
          <div className="mb-2.5 flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-ink">Puanınız:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} yıldız`} className="p-0.5">
                <Star size={20} className={n <= rating ? "fill-terra text-terra" : "text-line hover:text-terra/50"} aria-hidden />
              </button>
            ))}
          </div>
          <textarea name="comment" rows={3} maxLength={2000} placeholder="Deneyiminizi paylaşın (opsiyonel)…" className="field w-full py-2.5" />
          <div className="mt-2 flex items-center gap-3">
            <button type="submit" disabled={pending} className="btn btn-solid btn-sm w-fit disabled:opacity-60">Değerlendir →</button>
            {state.ok && <span className="text-[12.5px] font-semibold text-emerald-700">✓ Kaydedildi</span>}
            {state.error === "self" && <span className="text-[12.5px] font-semibold text-red-600">Kendi işletmenizi puanlayamazsınız</span>}
            {state.error && state.error !== "self" && <span className="text-[12.5px] font-semibold text-red-600">Bir hata oluştu</span>}
          </div>
        </form>
      )}

      {ready && !loggedIn && (
        <p className="mb-5 rounded-[12px] border border-dashed border-line bg-cream/40 px-4 py-3 text-[13px] text-muted">
          Değerlendirme bırakmak için <Link href="/login" className="font-semibold text-terra-deep hover:underline">giriş yapın</Link>.
        </p>
      )}

      {reviews.length === 0 ? (
        ready && <p className="text-[13.5px] text-muted">Henüz değerlendirme yok. İlk yorumu siz bırakın.</p>
      ) : (
        <ul className="grid gap-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-[12px] border border-line/80 bg-paper p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13.5px] font-bold text-ink">{authorName(r.author)}</span>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="mt-1.5 text-[13.5px] leading-5 text-ink/80">{r.comment}</p>}
              <p className="mt-1 text-[11.5px] font-medium text-muted">{fmt(r.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

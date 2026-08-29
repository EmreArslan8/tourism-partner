"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check, CheckCircle2, LoaderCircle, Lock, Pencil, X } from "lucide-react";

type Feedback = { tone: "success" | "error"; message: string } | null;

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-1.5 rounded-[7px] bg-sapphire px-3 text-[12.5px] font-bold text-white transition-opacity hover:bg-sapphire/90 disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? <LoaderCircle size={15} aria-hidden className="animate-spin" /> : <Check size={15} aria-hidden />}
      {pending ? "Kaydediliyor…" : "Kaydet"}
    </button>
  );
}

/* Admin formları için görüntüleme/düzenleme sarmalayıcı.
   Varsayılan: kilitli (tüm alanlar disabled). "Düzenle"ye basınca alanlar
   açılır; Kaydet/İptal formun içinde görünür. Alanların tümü tek bir
   <fieldset disabled> ile kilitlenir (display:contents ile grid bozulmaz).
   Not: name'li tüm inputlar children olarak geçmeli; her zaman gönderilmesi
   gereken hidden alanlar için `persistent` kullan (fieldset dışında kalır). */
export default function EditableForm({
  id,
  action,
  className,
  persistent,
  defaultEditing = false,
  children,
}: {
  id?: string;
  action: (formData: FormData) => void | Promise<void>;
  className?: string;
  persistent?: React.ReactNode;
  /** Yeni kayıt formunda doğrudan düzenleme modunda açmak için. */
  defaultEditing?: boolean;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(defaultEditing);
  const [formVersion, setFormVersion] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  const showFeedback = (next: Exclude<Feedback, null>) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(next);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3000);
  };

  const submitAction = async (formData: FormData) => {
    setFeedback(null);
    try {
      await action(formData);
      setEditing(false);
      setFormVersion((current) => current + 1);
      showFeedback({ tone: "success", message: "Değişiklikler kaydedildi." });
    } catch (error) {
      const message = error instanceof Error && error.message
        ? error.message
        : "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.";
      showFeedback({ tone: "error", message });
    }
  };

  return (
    <form id={id} action={submitAction} className={className}>
      {persistent}
      <div className="col-span-full flex items-center justify-between gap-3 rounded-[8px] border border-line bg-cream/35 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
          {feedback?.tone === "success" ? (
            <>
              <CheckCircle2 size={15} aria-hidden className="text-emerald-600" />
              <span className="text-emerald-700" role="status" aria-live="polite">{feedback.message}</span>
            </>
          ) : feedback?.tone === "error" ? (
            <>
              <AlertCircle size={15} aria-hidden className="text-red-600" />
              <span className="text-red-700" role="alert">{feedback.message}</span>
            </>
          ) : editing ? (
            <>
              <Pencil size={15} aria-hidden className="text-sapphire" /> Düzenleme açık
            </>
          ) : (
            <>
              <Lock size={15} aria-hidden className="text-muted" /> Görüntüleme modu
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFeedback(null);
                  // Kontrollü kategori alanları dahil tüm formu sunucudan gelen
                  // başlangıç değerleriyle yeniden kur.
                  setFormVersion((current) => current + 1);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-line px-3 text-[12.5px] font-bold text-ink hover:bg-cream"
              >
                <X size={15} aria-hidden /> İptal
              </button>
              <SaveButton />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-line bg-white px-3 text-[12.5px] font-bold text-ink hover:bg-cream"
            >
              <Pencil size={15} aria-hidden /> Düzenle
            </button>
          )}
        </div>
      </div>
      <fieldset key={formVersion} disabled={!editing} className="contents">
        {children}
      </fieldset>
    </form>
  );
}

"use client";

import { Dialog, DialogTrigger, DialogContent, StatusBadge } from "@/components/common";
import type { BadgeTone } from "@/components/common/StatusBadge";
import { replyToTicket } from "@/lib/actions/platform";
import type { SupportTicketRow, SupportTicketMessageRow } from "@/lib/supabase/database.types";

const fmt = (v: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));

const isAdminMsg = (m: SupportTicketMessageRow) => m.author_name === "Destek Ekibi";

/* Admin destek kutusunda satır tıklanınca tam yazışmayı gösteren detay modalı.
   Geçmiş mesajlar + cevap yazma kutusu burada. Public (misafir) taleplerde panel
   içi yazışma yoktur; onlara mailto ile cevap verilir. */
export default function TicketDetail({
  ticket,
  messages,
  tone,
  label,
  locale,
}: {
  ticket: SupportTicketRow;
  messages: SupportTicketMessageRow[];
  tone: BadgeTone;
  label: string;
  locale: string;
}) {
  const canReplyInPanel = Boolean(ticket.business_id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="group max-w-[320px] cursor-pointer text-start">
          <p className="text-[13px] font-semibold text-ink underline-offset-2 group-hover:underline">
            {ticket.subject}
          </p>
          <p className="mt-1 line-clamp-1 text-[12px] text-muted">{ticket.message}</p>
        </button>
      </DialogTrigger>
      <DialogContent title={ticket.subject} className="max-w-[600px]">
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={tone}>{label}</StatusBadge>
            <span className="text-[12px] text-muted">{fmt(ticket.created_at)}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-cream/40 p-3">
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold text-ink">{ticket.sender_name}</p>
              {ticket.sender_email && <p className="truncate text-[12px] font-semibold text-muted">{ticket.sender_email}</p>}
            </div>
            {ticket.sender_email && (
              <a
                href={`mailto:${ticket.sender_email}?subject=${encodeURIComponent("Re: " + ticket.subject)}`}
                className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold text-muted hover:bg-cream"
              >
                E-posta ile yanıtla
              </a>
            )}
          </div>

          {/* Yazışma geçmişi: ilk mesaj = talebin kendisi, sonrası mesaj tablosundan. */}
          <div className="max-h-[42vh] space-y-3 overflow-y-auto pr-1">
            <Bubble side="left" name={ticket.sender_name} at={ticket.created_at} body={ticket.message} />
            {messages.map((m) => (
              <Bubble
                key={m.id}
                side={isAdminMsg(m) ? "right" : "left"}
                name={m.author_name ?? (isAdminMsg(m) ? "Destek Ekibi" : ticket.sender_name)}
                at={m.created_at}
                body={m.body}
              />
            ))}
          </div>

          {canReplyInPanel ? (
            <form action={replyToTicket} className="space-y-2 border-t border-line/70 pt-3">
              <input type="hidden" name="id" value={ticket.id} />
              <input type="hidden" name="locale" value={locale} />
              <textarea
                name="body"
                required
                rows={3}
                maxLength={4000}
                placeholder="İşletmeye cevabınızı yazın… (panelinde görür)"
                className="w-full resize-y rounded-xl border border-line bg-white p-3 text-[14px] text-ink outline-none focus:border-sapphire"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-sapphire px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-sapphire-deep"
                >
                  Cevap gönder
                </button>
              </div>
            </form>
          ) : (
            <p className="border-t border-line/70 pt-3 text-[12px] text-muted">
              Bu talep site üzerinden (misafir) gönderilmiş; panel içi yazışma yok. Yukarıdaki{" "}
              <strong>E-posta ile yanıtla</strong> ile cevaplayın.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Bubble({
  side,
  name,
  at,
  body,
}: {
  side: "left" | "right";
  name: string;
  at: string;
  body: string;
}) {
  const admin = side === "right";
  return (
    <div className={admin ? "flex justify-end" : "flex justify-start"}>
      <div className={"max-w-[85%] rounded-2xl px-3.5 py-2.5 " + (admin ? "bg-sapphire text-white" : "bg-cream text-ink")}>
        <div className={"mb-0.5 flex items-center gap-2 text-[11px] " + (admin ? "text-white/80" : "text-muted")}>
          <span className="font-bold">{name}</span>
          <span>·</span>
          <span>{fmt(at)}</span>
        </div>
        <p className="whitespace-pre-wrap break-words text-[13.5px] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

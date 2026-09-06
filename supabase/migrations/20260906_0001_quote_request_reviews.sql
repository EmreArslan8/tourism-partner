-- Tek form gönderiminin admin incelemesi. quotes.status tedarikçi süreci olarak kalır.
-- Eski contacted/won/lost değerleri inceleme yapıldığının kanıtı olmadığından taşınmaz.
create table if not exists public.quote_request_reviews (
  email text not null,
  submitted_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed', 'archived')),
  internal_note text check (char_length(internal_note) <= 1000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (email, submitted_at)
);
alter table public.quote_request_reviews enable row level security;
drop policy if exists "Admins manage quote request reviews" on public.quote_request_reviews;
create policy "Admins manage quote request reviews" on public.quote_request_reviews
  for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.quote_request_reviews to authenticated;
create index if not exists quotes_submission_idx on public.quotes (email, created_at);
notify pgrst, 'reload schema';

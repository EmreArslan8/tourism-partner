create table if not exists public.promo_email_templates (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{1,79}$'),
  label text not null check (char_length(label) between 2 and 120),
  subject text not null check (char_length(subject) between 2 and 200),
  preheader text not null default '',
  headline text not null check (char_length(headline) between 2 and 180),
  intro text not null,
  bullets text[] not null default '{}',
  outro text not null default '',
  cta_label text not null check (char_length(cta_label) between 2 and 80),
  campaign text not null check (campaign ~ '^[a-z0-9][a-z0-9-]{1,59}$'),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promo_email_templates enable row level security;

revoke all on table public.promo_email_templates from anon;
grant select, insert, update, delete on table public.promo_email_templates to authenticated;

drop policy if exists "Admins manage promo email templates" on public.promo_email_templates;
create policy "Admins manage promo email templates"
  on public.promo_email_templates
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.touch_promo_email_template_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists promo_email_templates_touch_updated_at on public.promo_email_templates;
create trigger promo_email_templates_touch_updated_at
  before update on public.promo_email_templates
  for each row execute function public.touch_promo_email_template_updated_at();


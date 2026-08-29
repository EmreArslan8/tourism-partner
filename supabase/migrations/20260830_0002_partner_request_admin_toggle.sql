-- Partnerlik özelliği admin panelinden yönetilir. Bayrak kapalıyken kullanıcı
-- arayüzleri özelliği gizler ve RLS yeni talep eklenmesini ayrıca engeller.
create table if not exists public.platform_feature_flags (
  key text primary key,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.platform_feature_flags enable row level security;

drop policy if exists "Anyone can read platform feature flags" on public.platform_feature_flags;
create policy "Anyone can read platform feature flags"
  on public.platform_feature_flags
  for select
  using (true);

drop policy if exists "Admins can manage platform feature flags" on public.platform_feature_flags;
create policy "Admins can manage platform feature flags"
  on public.platform_feature_flags
  for all
  using (public.is_admin())
  with check (public.is_admin());

insert into public.platform_feature_flags (key, enabled)
values ('partner_requests', false)
on conflict (key) do nothing;

drop policy if exists "Business owners can create outgoing partner requests"
  on public.business_partner_requests;
create policy "Business owners can create outgoing partner requests"
  on public.business_partner_requests
  for insert
  with check (
    exists (
      select 1
      from public.platform_feature_flags flag
      where flag.key = 'partner_requests' and flag.enabled
    )
    and status = 'pending'
    and exists (
      select 1
      from public.businesses requester
      where requester.owner_id = auth.uid()
        and requester.id = requester_business_id
        and requester.status in ('approved', 'active')
    )
    and exists (
      select 1
      from public.businesses receiver
      where receiver.id = receiver_business_id
        and receiver.status in ('approved', 'active')
    )
    and exists (
      select 1
      from public.business_memberships membership
      where membership.business_id = requester_business_id
        and membership.status = 'active'
        and membership.starts_at <= now()
        and membership.ends_at >= now()
    )
  );

notify pgrst, 'reload schema';

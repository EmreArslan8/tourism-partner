-- Log saklama süresi (KVKK). Log'lar kişisel veri içerir; süresiz saklamak varlık
-- değil sorumluluktur. Baştan otomatik temizlik kurulur — "sonra hallederiz" hiç
-- olmuyor. pg_cron altyapısı 20260722_0001'de kurulu.
-- Migration idempotenttir.

create or replace function public.purge_activity_logs()
returns table (session_events_deleted bigint, record_changes_deleted bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  s bigint := 0;
  r bigint := 0;
  n bigint;
begin
  -- Başarısız giriş denemeleri: yalnızca yakın dönem brute-force analizinde işe yarar.
  delete from public.session_events
   where event in ('login_failed', 'mfa_failed')
     and created_at < now() - interval '6 months';
  get diagnostics n = row_count; s := s + n;

  -- Giriş/çıkış: güvenlik olayı, uzun saklanır.
  delete from public.session_events
   where created_at < now() - interval '24 months';
  get diagnostics n = row_count; s := s + n;

  -- Satır değişiklikleri: 12 ay.
  delete from public.record_changes
   where created_at < now() - interval '12 months';
  get diagnostics r = row_count;

  return query select s, r;
end;
$$;

comment on function public.purge_activity_logs() is
  'session_events ve record_changes icin saklama suresi temizligi; gunluk pg_cron ile calisir.';

revoke all on function public.purge_activity_logs() from public, anon, authenticated;

-- Aynı isimli job upsert edilir; tekrar çalıştırmak güvenlidir.
select cron.schedule(
  'purge-activity-logs',
  '15 4 * * *',
  $$select public.purge_activity_logs()$$
);

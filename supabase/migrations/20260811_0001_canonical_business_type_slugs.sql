-- İşletme kategorilerinde tek veri standardı:
-- DB'de yalnızca dil-bağımsız kanonik slug, görünen metinde locale etiketi.
-- Migration tekrar çalıştırılabilir; eski Türkçe etiket ve slug'ları normalize eder.

drop table if exists pg_temp.service_slug_map;
create temporary table service_slug_map (
  legacy text primary key,
  canonical text not null
);

insert into service_slug_map (legacy, canonical) values
  ('Şehir Oteli', 'city-hotel'), ('sehir-oteli', 'city-hotel'), ('Otel', 'city-hotel'),
  ('Butik Otel', 'boutique-hotel'), ('butik-otel', 'boutique-hotel'),
  ('Apart Otel', 'apart-hotel'), ('apart-otel', 'apart-hotel'),
  ('Termal / Spa', 'thermal-spa'), ('termal-spa', 'thermal-spa'),
  ('Tarihi Konak / Pansiyon', 'historic-mansion'), ('tarihi-konak', 'historic-mansion'),
  ('Bungalov & Dağ Evi', 'bungalow-lodge'), ('bungalov-dag-evi', 'bungalow-lodge'),
  ('Kamp & Glamping', 'camping-glamping'), ('kamp-glamping', 'camping-glamping'),
  ('Bağ Evi', 'vineyard-house'), ('bag-evi', 'vineyard-house'),
  ('Resort / Tatil Köyü', 'resort'), ('Resort', 'resort'),
  ('Villa', 'villa'),
  ('Tiny House', 'tiny-house'),
  ('DMC', 'dmc'), ('Seyahat Acentesi', 'incoming'), ('Tur Firması', 'tour-operator'),
  ('Incoming', 'incoming'),
  ('Outgoing', 'outgoing'),
  ('Tur Operatörleri', 'tour-operator'), ('tur-operatoru', 'tour-operator'),
  ('B2B Wholesaler', 'b2b-wholesaler'),
  ('Uçak Bileti', 'flight-tickets'), ('ucak-bileti', 'flight-tickets'),
  ('MICE', 'mice'),
  ('Sağlık Turizmi', 'health-tourism'), ('saglik-turizmi', 'health-tourism'),
  ('Havalimanı Transfer', 'airport-transfer'), ('havalimani-transfer', 'airport-transfer'),
  ('Şehirlerarası Transfer', 'intercity-transfer'), ('sehirlerarasi-transfer', 'intercity-transfer'),
  ('VIP / Lüks Transfer', 'vip-transfer'),
  ('Rent A Car', 'car-rental'), ('rent-a-car', 'car-rental'),
  ('Kültür ve Arkeoloji', 'culture-archaeology'), ('kultur-arkeoloji', 'culture-archaeology'),
  ('Gastronomi', 'gastronomy-guide'), ('rehber-gastronomi', 'gastronomy-guide'),
  ('Doğa, Macera & Trekking', 'nature-adventure-trekking'), ('doga-macera-trekking', 'nature-adventure-trekking'),
  ('İnanç & Mitoloji', 'faith-mythology'), ('inanc-mitoloji', 'faith-mythology'),
  ('Lifestyle', 'lifestyle'),
  ('Paket Tur', 'package-tour'), ('paket-tur', 'package-tour'),
  ('Münferit', 'private-tour'), ('munferit', 'private-tour'), ('Tur Rehberi', 'private-tour'),
  ('Günübirlik', 'day-tour'), ('gunubirlik', 'day-tour'),
  ('rehber-mice', 'mice-guide'),
  ('Restoranlar', 'restaurant'), ('restoran', 'restaurant'),
  ('Gurme Deneyim Alanları', 'gourmet-experience'), ('gurme-deneyim', 'gourmet-experience'),
  ('Yerel Lezzet Noktaları', 'local-food'), ('yerel-lezzet', 'local-food'),
  ('Saç Ekimi ve Estetik', 'hair-transplant'), ('sac-ekimi-estetik', 'hair-transplant'),
  ('Dermatoloji', 'dermatology'), ('dermatoloji', 'dermatology'),
  ('Plastik / Estetik Cerrahi', 'plastic-surgery'), ('plastik-estetik-cerrahi', 'plastic-surgery'),
  ('Diş Sağlığı', 'dental'), ('dis-sagligi', 'dental'), ('Diş Kliniği', 'dental'),
  ('Göz Sağlığı', 'eye-health'), ('goz-sagligi', 'eye-health'),
  ('Genel Cerrahi', 'general-surgery'), ('genel-cerrahi', 'general-surgery'),
  ('Hastane', 'hospital'), ('hastane', 'hospital'), ('Saç Kliniği', 'hair-transplant'),
  ('Outdoor, Doğa, Macera', 'outdoor-nature-adventure'), ('outdoor-doga-macera', 'outdoor-nature-adventure'),
  ('Balon Turu', 'outdoor-nature-adventure'), ('Tekne / Yat', 'outdoor-nature-adventure'),
  ('Adrenalin Sporları', 'outdoor-nature-adventure'), ('Binicilik', 'outdoor-nature-adventure'),
  ('Kültür Sanat Eğlence', 'arts-culture-entertainment'), ('kultur-sanat-eglence', 'arts-culture-entertainment'),
  ('Tematik Parklar', 'theme-parks'), ('tematik-parklar', 'theme-parks'),
  ('Atölyeler ve Yerel Deneyimler', 'workshops-local-experiences'), ('atolye-yerel-deneyim', 'workshops-local-experiences')
on conflict (legacy) do update set canonical = excluded.canonical;

-- Duplicate temizliğinde eski birincil satır silinse bile hangi kanonik hizmetin
-- birincil kalacağını önceden kaydet.
drop table if exists pg_temp.primary_service_targets;
create temporary table primary_service_targets as
select distinct
  s.business_id,
  case
    when s.group_key = 'rehber' and s.service_slug = 'MICE' then 'mice-guide'
    else m.canonical
  end as service_slug
from public.business_services s
join service_slug_map m on m.legacy = s.service_slug
where s.is_primary and s.service_slug <> m.canonical;

-- Aynı görünen etikete sahip iki farklı hizmet için grup bağlamı belirleyicidir.
update public.businesses set type = 'mice-guide' where "group" = 'rehber' and type = 'MICE';
delete from public.business_services legacy_row
where legacy_row.group_key = 'rehber'
  and legacy_row.service_slug = 'MICE'
  and exists (
    select 1
    from public.business_services canonical_row
    where canonical_row.business_id = legacy_row.business_id
      and canonical_row.service_slug = 'mice-guide'
  );
update public.business_services set service_slug = 'mice-guide' where group_key = 'rehber' and service_slug = 'MICE';
update public.quotes set category_type = 'mice-guide' where category_group = 'rehber' and category_type = 'MICE';

update public.businesses b
set type = m.canonical
from service_slug_map m
where b.type = m.legacy and b.type <> m.canonical;

-- Aynı işletmede eski ve yeni slug birlikte varsa yinelenen eski satırı kaldır.
delete from public.business_services legacy_row
using service_slug_map m
where legacy_row.service_slug = m.legacy
  and legacy_row.service_slug <> m.canonical
  and exists (
    select 1
    from public.business_services canonical_row
    where canonical_row.business_id = legacy_row.business_id
      and canonical_row.service_slug = m.canonical
  );

update public.business_services s
set service_slug = m.canonical
from service_slug_map m
where s.service_slug = m.legacy and s.service_slug <> m.canonical;

update public.business_services s
set is_primary = true
from primary_service_targets p
where s.business_id = p.business_id
  and s.service_slug = p.service_slug
  and not s.is_primary;

-- Yinelenen eski satır silinirken birincil işareti kaybolduysa bir hizmeti yeniden birincil yap.
with missing_primary as (
  select min(s.id) as id
  from public.business_services s
  group by s.business_id
  having not bool_or(s.is_primary)
)
update public.business_services s
set is_primary = true
from missing_primary p
where s.id = p.id;

update public.applications a
set category_slug = m.canonical
from service_slug_map m
where a.category_slug = m.legacy and a.category_slug <> m.canonical;

update public.quotes q
set category_type = m.canonical
from service_slug_map m
where q.category_type = m.legacy and q.category_type <> m.canonical;

-- Bekleyen kayıt niyetleri uygulanırken de aynı kanonik değer kullanılsın.
update public.signup_intents i
set payload = jsonb_set(i.payload, '{type}', to_jsonb(m.canonical), true)
from service_slug_map m
where i.payload ->> 'type' = m.legacy
  and i.payload ->> 'type' <> m.canonical;

update public.signup_intents i
set payload = jsonb_set(
  i.payload,
  '{serviceSlugs}',
  coalesce((
    select jsonb_agg(normalized.value order by normalized.first_position)
    from (
      select
        coalesce(m.canonical, item.value) as value,
        min(item.position) as first_position
      from jsonb_array_elements_text(coalesce(i.payload -> 'serviceSlugs', '[]'::jsonb))
        with ordinality item(value, position)
      left join service_slug_map m on m.legacy = item.value
      group by coalesce(m.canonical, item.value)
    ) normalized
  ), '[]'::jsonb),
  true
)
where jsonb_typeof(coalesce(i.payload -> 'serviceSlugs', '[]'::jsonb)) = 'array';

-- B2B hedef türleri de businesses.type ile aynı slug uzayında kalmalı.
update public.b2b_requests r
set target_types = coalesce((
  select array_agg(distinct coalesce(m.canonical, item.value))
  from unnest(r.target_types) item(value)
  left join service_slug_map m on m.legacy = item.value
), '{}');

-- Kategori yönetim tablosundaki eski slug'ları da kanonikleştir.
delete from public.categories legacy_row
using service_slug_map m
where legacy_row.slug = m.legacy
  and legacy_row.slug <> m.canonical
  and exists (select 1 from public.categories canonical_row where canonical_row.slug = m.canonical);

update public.categories c
set slug = m.canonical, updated_at = now()
from service_slug_map m
where c.slug = m.legacy and c.slug <> m.canonical;

-- Bundan sonra etiketi yanlışlıkla type alanına yazan bir kod yolu DB'de durdurulur.
alter table public.businesses drop constraint if exists businesses_type_canonical_slug;
alter table public.businesses
  add constraint businesses_type_canonical_slug
  check (type ~ '^[a-z0-9]+(-[a-z0-9]+)*$') not valid;
alter table public.businesses validate constraint businesses_type_canonical_slug;

drop table primary_service_targets;
drop table service_slug_map;

notify pgrst, 'reload schema';

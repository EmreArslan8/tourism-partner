-- Aynı hesap altında yalnızca harf büyüklüğü/boşluk farkıyla mükerrer işletme
-- oluşmasını DB seviyesinde engeller. Uygulama ön kontrolü kullanıcıya anlaşılır
-- hata verir; bu indeks eşzamanlı istek yarışlarına karşı son güvenlik katmanıdır.
create unique index if not exists businesses_owner_normalized_name_idx
  on public.businesses (owner_id, lower(btrim(name)))
  where owner_id is not null;

# Migrations — artımlı şema değişiklikleri

Artık **700 satırlık schema.sql'i tekrar tekrar çalıştırmıyoruz.**

## Kural
- `supabase/schema.sql` + `admin-dashboard.sql` + `admin_backoffice_schema.sql` = **ilk kurulum** (sıfırdan bir DB'de bir kez).
- Bundan sonraki **her şema değişikliği** → bu klasörde **ayrı, küçük, tarihli bir dosya**.
- Her dosya **idempotent**tir (tekrar çalıştırmak zararsız).

## Nasıl uygularsın (CLI'siz — Supabase SQL Editor)
Sadece **henüz çalıştırmadığın** yeni migration dosyalarını, dosya adı sırasıyla SQL Editor'a yapıştırıp çalıştır. Hepsi bu.

## Nasıl uygularsın (CLI ile — önerilen, tek komut)
```bash
brew install supabase/tap/supabase          # bir kez
supabase link --project-ref <PROJE_REF>      # bir kez (Dashboard > Settings > General)
supabase db push                             # sadece BEKLEYEN migration'ları uygular
```
`db push` hangi dosyaların uygulandığını takip eder; her seferinde sadece yenileri çalışır.

## Yeni değişiklik eklerken (geliştirici)
`YYYYMMDD_NNNN_kisa_ad.sql` formatında yeni dosya oluştur, yalnızca o değişikliğin idempotent DDL'ini yaz.

# Deploy notları (Hostinger VPS)

Mimari: `nginx (443) → 127.0.0.1:3000 (Docker: Next.js standalone)`. SSL/domain host nginx'te.

## Dosyalar
- `docker-compose.vps.yml` — Docker Manager compose şablonu (env değerlerini gerçekleriyle doldur).
- `nginx.conf.example` — host nginx reverse proxy config'i.

## 2026-08-01: `Link` header birikmesi → 502 (çözüldü)
next-intl proxy'sinin hreflang `Link` header'ı sınırsız büyüyüp (555 entry / 39 KB)
nginx buffer'ını taşırdı → 502. En çok trafik alan `/ar` (reklam landing) vurdu.

**Kök neden (yerelde birebir üretildi):** `cacheComponents: true` ile Next 16,
proxy'nin yazdığı response header'larını cache'lenen sayfa girdisine gömüyor.
`cacheLife("minutes")` (`lib/platform-data.ts`, `lib/business-partners.ts`) girdiyi
dakikalarda bir yeniden ürettiriyor ve her üretimde eski `Link` korunup yenisi
**üstüne ekleniyor** (proxy `.set` kullansa bile; birleştirme Next katmanında
append semantiğiyle oluyor). Ölçüm: 15 → 20 → 25, her revalidation turunda +5.
Container ne kadar uzun ayaktaysa header o kadar büyük; `docker restart` cache'i
silmediği için sıfırlamaz, yalnızca yeni container (`up -d`) sıfırlar.

**Çözüm:** `src/i18n/routing.ts` → `alternateLinks: false`. hreflang zaten
`src/lib/seo.ts` üzerinden sayfa metadata'sında veriliyor. Buffer'lar 16k → 32k.

⚠️ Aynı mekanizma proxy'nin yazdığı **her** header için geçerli. Proxy'ye yeni bir
response header eklersen, cache'lenen bir sayfada birikip birikmediğini aşağıdaki
komutla birkaç revalidation turu boyunca ölç.

Teşhis komutu (header şişmiş mi):
```bash
curl -s -o /dev/null -D - -H "Host: www.tourismpartner.com" \
  http://127.0.0.1:3000/ar | grep -o 'rel="alternate"' | wc -l   # normali 5
```

> nginx config yedeklerini **asla** `sites-available`/`sites-enabled` içinde bırakma;
> `include sites-enabled/*` `.bak` dosyasını da yükleyip "duplicate listen" ile
> nginx'i başlatmaz. Yedeği `/root`'a al.

## ⚠️ nginx proxy buffer — ZORUNLU
`nginx.conf.example` içindeki `proxy_buffer_size 16k` / `proxy_buffers 8 16k` satırları
**olmazsa giriş 502 verir.** Supabase auth çerezi (parçalı JWT) büyük bir `Set-Cookie`
başlığı üretir; nginx varsayılan buffer'ı (4k/8k) taşınca `upstream sent too big header`
→ 502 döner. Login, `/api/auth/callback` (mail doğrulama + şifre sıfırlama), kayıt ve
token yenileme — auth çerezi yazan her yol etkilenir.

Sunucu yeniden kurulursa veya nginx config'i sıfırlanırsa bu satırları tekrar ekle:
```bash
# location / { proxy_pass http://127.0.0.1:3000; } bloğunun içine:
proxy_buffer_size 16k; proxy_buffers 8 16k; proxy_busy_buffers_size 32k;
nginx -t && systemctl reload nginx
```

## Yeni sürüm deploy
```bash
docker compose pull app && docker compose up -d app
```
(Otomatik güncelleme yok; watchtower kaldırıldı.)

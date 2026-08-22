# Çok aşamalı build — çıktı: yalnızca standalone sunucuyu içeren küçük runtime imajı.
# NEXT_PUBLIC_* değişkenleri build sırasında bundle'a gömülür; bu yüzden build-arg olarak gelir
# (CI'da GitHub secrets'tan beslenir, bkz. .github/workflows/deploy.yml).
#
# NODE SÜRÜMÜNÜ 22'YE YÜKSELTME. Node 22'nin web-streams katmanında bir regresyon var:
# stream'li bir sayfa render'ı (PPR) tam akarken bağlantı yarıda kopunca
# "controller[kState].transformAlgorithm is not a function" fırlıyor ve tüm render
# çöküyor (kullanıcı boş sayfa + "Tekrar dene" görüyor). Node 20 LTS etkilenmiyor.
# Ref: vercel/next.js#75994, nodejs/node#62036.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Lock dosyası legacy-peer-deps=true ile üretildi (lokal ~/.npmrc); CI'da da aynı bayrak gerekir.
RUN npm ci --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ALLOW_INDEXING
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ALLOW_INDEXING=$NEXT_PUBLIC_ALLOW_INDEXING \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# cache klasörünü build zamanında oluştur ve doğru sahiplikle bırak
RUN mkdir -p .next/cache && chown -R node:node .next/cache

USER node
EXPOSE 3000
CMD ["node", "server.js"]
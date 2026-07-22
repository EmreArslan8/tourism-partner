# Çok aşamalı build — çıktı: yalnızca standalone sunucuyu içeren küçük runtime imajı.
# NEXT_PUBLIC_* değişkenleri build sırasında bundle'a gömülür; bu yüzden build-arg olarak gelir
# (CI'da GitHub secrets'tan beslenir, bkz. .github/workflows/deploy.yml).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Lock dosyası legacy-peer-deps=true ile üretildi (lokal ~/.npmrc); CI'da da aynı bayrak gerekir.
RUN npm ci --legacy-peer-deps

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ALLOW_INDEXING
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ALLOW_INDEXING=$NEXT_PUBLIC_ALLOW_INDEXING \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]

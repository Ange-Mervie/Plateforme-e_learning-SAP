# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npx prisma generate || true
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/sql ./sql
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts/docker-migrate.mjs ./scripts/docker-migrate.mjs
COPY --from=builder /app/package.json ./package.json
# mysql2 needed by migration script at runtime (standalone may not include it in root context reliably)
COPY --from=deps /app/node_modules ./node_modules
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
EXPOSE 3000
USER nextjs
CMD ["sh", "-c", "node scripts/docker-migrate.mjs && node server.js"]

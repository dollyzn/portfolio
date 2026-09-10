# Build e runtime em imagens Chainguard (Wolfi) - base quase sem CVEs.
# O scanner do IDE analisa CADA stage; por isso deps/builder também precisam
# sair do node oficial (Debian/Alpine), não só o runner.

# ── Dependências ────────────────────────────────────────────────
FROM cgr.dev/chainguard/node:latest-dev AS deps
USER root
WORKDIR /app

RUN npm install -g pnpm@9.15.9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Build ───────────────────────────────────────────────────────
FROM cgr.dev/chainguard/node:latest-dev AS builder
USER root
WORKDIR /app

RUN npm install -g pnpm@9.15.9

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://nsantos.dev
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# ── Runtime ─────────────────────────────────────────────────────
FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

# Chainguard node já entra com ENTRYPOINT ["node"]
CMD ["server.js"]

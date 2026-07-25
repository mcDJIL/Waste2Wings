FROM node:22-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

FROM node:22-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/henwasteoil?schema=public"
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]

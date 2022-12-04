# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
COPY auditor/package.json ./auditor/

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn workspace auditor build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN mkdir -p /app/auditor

COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=deps /app/auditor/package.json ./auditor
COPY --from=builder /app/auditor/dist ./auditor/dist

RUN yarn --production

EXPOSE 3000

ENV PORT 3000

CMD ["node", "auditor/dist/index.js"]

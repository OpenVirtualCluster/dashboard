# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Set production env
ENV NODE_ENV=production
CMD ["npm", "run", "start"]

# # Production image, copy all the files and run next
# FROM node:18-alpine AS runner
# WORKDIR /app

# # Set production env
# ENV NODE_ENV=production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# # COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
# COPY --from=builder --chown=1001:1001 /app/.next ./.next
# COPY --from=builder --chown=1001:1001 /app/package.json ./
# COPY --from=builder --chown=1001:1001 /app/node_modules ./node_modules
# COPY --from=builder --chown=1001:1001 /app/public ./public

# USER 1001

# EXPOSE 3000

# ENV PORT 3000

# CMD ["npm", "run", "start"]

FROM node:22-alpine AS builder

WORKDIR /app

# Copy root and package files
COPY package.json ./
COPY packages ./packages
COPY database ./database
COPY apps/api ./apps/api

# Install dependencies and build
RUN npm install
RUN npm run prisma:generate --workspace=@codepractice/api
RUN npm run build --workspace=@codepractice/shared-types
RUN npm run build --workspace=@codepractice/validation
RUN npm run build --workspace=@codepractice/api

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/database ./database
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 4000

CMD ["node", "apps/api/dist/main"]

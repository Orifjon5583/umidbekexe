FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN npm install
RUN npm run build --workspace=@codepractice/shared-types
RUN npm run build --workspace=@codepractice/validation
RUN npm run build --workspace=@codepractice/api-client
RUN npm run build --workspace=@codepractice/web

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

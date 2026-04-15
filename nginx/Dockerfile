# Сборка из корня репозитория (context: .)
FROM node:20-alpine AS builder
WORKDIR /app
COPY coffeecafe/package*.json ./
RUN npm ci
COPY coffeecafe/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

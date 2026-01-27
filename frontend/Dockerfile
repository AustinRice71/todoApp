# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# Build the static site
RUN npm run build

# ---- Run stage (nginx) ----
FROM nginx:alpine
# Replace default nginx site config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

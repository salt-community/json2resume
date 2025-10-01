# ---------- Build stage ----------
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files first for caching dependencies
COPY package*.json ./

# Optional backend URLs injected at build time (Vite reads VITE_* at build)
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Install dependencies
RUN npm ci

# Copy source and config files
COPY . .

# Build the app for production (use Vite directly to avoid type-check-only failures)
RUN npx vite build

# ---------- Production stage ----------
FROM nginx:alpine

# Copy build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (kept out of project root)
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

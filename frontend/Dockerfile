# VintageVision Frontend Dockerfile
# Vite + React build served by Nginx

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production image with Nginx
FROM nginx:alpine AS runner

# Copy custom nginx config and remove default.conf (not used, prevents entrypoint warning)
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx user already exists in nginx:alpine, just set ownership
RUN chown -R nginx:nginx /usr/share/nginx/html

# Switch to non-root user
USER nginx

EXPOSE 80

# Skip default nginx entrypoint scripts (we use custom nginx.conf)
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build React app with Vite
FROM node:20-alpine AS build

WORKDIR /app

# Optimize dependency installation by caching package files first
COPY package.json package-lock.json* ./

# Install dependencies (ci is faster and stricter than install)
RUN npm install

# Copy source code
COPY . .

# Build Arguments for Environment Variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:1.27-alpine AS runtime

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
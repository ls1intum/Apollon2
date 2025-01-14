# Stage 1: Builder
FROM node:20.18.0-slim AS builder

# Create and set working directory
WORKDIR /app

# Copy root-level package and lock files
COPY package*.json ./
# Copy workspace package files (if needed)
COPY library/package*.json ./library/
COPY standalone/webapp/package*.json ./standalone/webapp/
COPY standalone/server/package*.json ./standalone/server/

# Install all dependencies for the entire monorepo using npm ci
RUN npm install

# Copy all source code into the image
COPY . .

# Build the webapp - assuming there's a script at the root or 
# you can directly run:
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine
# Remove default nginx pages
RUN rm -rf /usr/share/nginx/html/*

# Copy the built webapp from the builder stage
COPY --from=builder /app/standalone/webapp/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Default command to run nginx
CMD ["nginx", "-g", "daemon off;"]

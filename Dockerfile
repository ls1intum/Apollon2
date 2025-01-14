# Stage 1: Install dependencies and build the frontend
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy workspace package.json files
COPY library/package.json ./library/
COPY standalone/server/package.json ./standalone/server/
COPY standalone/webapp/package.json ./standalone/webapp/

# Install all dependencies (leveraging npm workspaces)
RUN npm install

# Copy the entire monorepo
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built frontend with Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from the previous stage
COPY --from=build /app/standalone/webapp/dist /usr/share/nginx/html

# Optional: Copy custom Nginx configuration
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

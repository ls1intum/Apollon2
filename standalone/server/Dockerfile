FROM node:20.18.0-slim

WORKDIR /app

# Copy only what's needed for dependency installation
COPY package*.json ./
COPY standalone/server/package*.json ./standalone/server/

# Install server-only dependencies using workspaces
RUN npm install --workspace=@apollon2/server

# Copy server source and tsconfig only (no node_modules!)
COPY standalone/server/src ./standalone/server/src
COPY standalone/server/tsconfig.json ./standalone/server/tsconfig.json

# Build the server (TypeScript → JavaScript)
RUN npm run build:server

# Create persistence directory
RUN mkdir -p /app/dbDir

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV WSSPORT=4444
ENV YPERSISTENCE=./dbDir
ENV FRONTEND_URL=http://localhost:5173

# Expose required ports
EXPOSE 8000 4444

# Start the compiled server
CMD ["node", "standalone/server/dist/src/server.js"]

FROM node:20.18.0-slim

WORKDIR /app

# Copy server package files
COPY package*.json tsconfig.json ./

# Copy source code
COPY src ./src

# Install and build
RUN npm install
RUN npm run build

EXPOSE 4444
CMD ["npm", "run", "start"]

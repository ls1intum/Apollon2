# Step 1: Use Node.js base image
FROM node:20.18.0

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the server's package.json and yarn.lock
COPY ./apps/server/package.json ./package.json
COPY ./yarn.lock ./yarn.lock

# Step 4: Install all dependencies (including devDependencies) for build
RUN yarn install

# Step 5: Copy the server source code
COPY ./apps/server ./apps/server
COPY ./tsconfig.json ./tsconfig.json

# Step 6: Build the server
WORKDIR /app/apps/server
RUN yarn build


# Step 8: Expose the application port
EXPOSE 4444

# Step 9: Start the server
CMD ["node", "apps/server/dist/server.js"]

FROM node:20-bullseye-slim

# Install curl (needed for Docker health checks) and build tools for bcrypt
RUN apt-get update \
  && apt-get install -y curl python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

EXPOSE 3001

CMD ["node", "src/server.js"]

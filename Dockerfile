# ── Stage 1: Install dependencies ─────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Root dependencies
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Server dependencies
COPY server/package.json server/package-lock.json* server/
RUN cd server && npm ci --ignore-scripts

# Client dependencies
COPY client/package.json client/package-lock.json* client/
RUN cd client && npm ci --ignore-scripts

# ── Stage 2: Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules

COPY . .

# Build the React client
RUN cd client && npm run build

# Build the Express server
RUN cd server && npm run build

# ── Stage 3: Production ──────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production artifacts
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/data ./server/data

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server/dist/index.js"]

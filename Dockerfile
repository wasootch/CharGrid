FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/db/words.db ./db/words.db
COPY package*.json ./
COPY server.js ./
COPY db/index.js ./db/index.js
COPY public ./public

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]

FROM node:lts as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:lts-slim AS runner

ENV NODE_ENV production
USER node
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]

EXPOSE 3000

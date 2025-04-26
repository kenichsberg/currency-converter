FROM node:lts

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY app ./src
COPY public ./public
COPY next.config.ts .
COPY tsconfig.json .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run dev

FROM node:lts

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run dev

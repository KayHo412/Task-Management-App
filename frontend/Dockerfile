# Build stage
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.example .env
RUN npm run build

# Production stage
FROM nginx:alpine3.20
COPY --from=build-stage /app/dist /usr/share/nginx/html

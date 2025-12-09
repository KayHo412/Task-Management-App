FROM node:18-alpine

WORKDIR /app

# Copy Prisma schema 
COPY prisma ./prisma

# Copy both package.json and package-lock.json 
COPY package.json package-lock.json ./

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of backend code
COPY . .

# Expose the backend port
EXPOSE 3000

CMD ["npm", "run", "dev"]


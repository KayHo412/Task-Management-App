import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables early
dotenv.config();

// Validate DATABASE_URL exists
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set in environment variables. " +
    "Please create a .env file with DATABASE_URL defined."
  );
}

// Create Prisma Client singleton
let prisma: PrismaClient;

declare global {
  var prismaClient: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, reuse the same Prisma Client to avoid connection leaks
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  prisma = global.prismaClient;
}

export default prisma;

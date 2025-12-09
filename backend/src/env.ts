import dotenv from "dotenv";
import { z } from "zod/v4";

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid database URL")
    .min(1, "DATABASE_URL is required"),
  JWT_SECRET: z
    .string()
    .min(8, "JWT_SECRET must be at least 8 characters long"),
});

try {
  var env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Environment validation failed:");
    error.issues.forEach((err: any) => {
      console.error(`   - ${err.path.join(".")}: ${err.message}`);
    });
    console.error("\n📋 Required variables:");
    console.error("   - NODE_ENV (development|production|test)");
    console.error("   - PORT (default: 3000)");
    console.error("   - DATABASE_URL (PostgreSQL connection string)");
    console.error("   - JWT_SECRET (min 8 characters)");
    console.error("\n💡 Copy .env.example to .env and fill in the values");
    process.exit(1);
  }
  throw error;
}

export { env };

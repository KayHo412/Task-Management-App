import "./tracing.js";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import { env } from "./env.js";
import app from "./app.js";
import prisma from "./db.js";

const port = Number(env.PORT) || 3000;

/**
 * Check database connectivity before starting server
 */
async function startServer() {
  try {
    console.log("🔍 Testing database connection...");
    console.log(`📍 Database URL: ${env.DATABASE_URL.split("@")[1] || "configured"}`);

    // Test DB connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Connected to database successfully");

    // Start the Express server only after DB is OK
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server running on http://0.0.0.0:${port}`);
      console.log(`📝 API available at http://0.0.0.0:${port}/api`);
    });
  }
  catch (error: any) {
    console.error("❌ Cannot connect to database");
    console.error("Error Details:", error.message);

    // Provide helpful debugging info
    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 Hint: Make sure PostgreSQL is running on localhost:5432");
    } else if (error.message.includes("authentication failed")) {
      console.error("💡 Hint: Check your username/password in DATABASE_URL");
    } else if (error.message.includes("database") && error.message.includes("does not exist")) {
      console.error("💡 Hint: Create the database 'mydb' first or run: npx prisma migrate deploy");
    }

    process.exit(1); // This makes Docker restart it if restart policy is set
  }
}

startServer();

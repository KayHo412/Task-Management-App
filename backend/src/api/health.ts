import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

// Health endpoint - basic liveness check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Ready endpoint - verifies database connectivity
router.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ready",
      message: "Database connection healthy ✅",
      timestamp: new Date().toISOString(),
    });
  }
  catch (err) {
    res.status(500).json({
      status: "error",
      message: "Database not reachable ❌",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

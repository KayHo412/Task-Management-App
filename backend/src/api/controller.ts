import express from "express";

import authRoutes from "./auth.js";
import taskRoutes from "./tasks.js";
import userRoutes from "./users.js";
import emojiRoutes from "./emojis.js";
import healthRoutes from "./health.js";
import teamRoutes from "./teams.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "TaskFlow API - A modern task management system" });
});

router.use("/emojis", emojiRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/teams", teamRoutes);
router.use("/user", userRoutes);
// health endpoints are mounted at the app root (see src/app.ts)


export default router;

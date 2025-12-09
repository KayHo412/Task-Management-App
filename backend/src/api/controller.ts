import express from "express";

import authRoutes from "./auth.js";
import taskRoutes from "./tasks.js";
import userRoutes from "./users.js";
import emojiRoutes from "./emojis.js";
import healthRoutes from "./health.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the urfhuhw where is my ut" });
});

router.use("/emojis", emojiRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/user", userRoutes);
// health endpoints are mounted at the app root (see src/app.ts)


export default router;

import express from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";
import prisma from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();


// Get current user's profile
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Invalid user" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete current user's account
router.delete("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Invalid user" });

    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update current user's password
router.put("/password", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { newPassword } = req.body;
    if (!userId || !newPassword)
      return res.status(400).json({ error: "Invalid user or password" });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users (for admin purposes)
router.get("/users", async (req, res) => { //Remember to put back the AuthRequest
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a user by ID (for admin purposes)
router.delete("/users/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

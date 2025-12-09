import express from "express";
import { z } from "zod";

import type { AuthRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validators.js";
import {
  getAllTasksByOwnerId,
  createTask,
  deleteTaskById,
  markTaskAsDone,
  markTaskAsUndone,
} from "../services/taskService.js";

const router = express.Router();

const createTaskSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
});

// Get all tasks for the authenticated user
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(400).json({ error: "Invalid user" });

    const tasks = await getAllTasksByOwnerId(ownerId);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new task
router.post("/", requireAuth, validateBody(createTaskSchema), async (req: AuthRequest, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(400).json({ error: "Invalid user" });

    const { title, body } = req.body;
    const task = await createTask(ownerId, title, body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a task by ID
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const ownerId = req.user?.id;
    const taskId = req.params.id;
    if (!ownerId) return res.status(400).json({ error: "Invalid user" });

    const deleted = await deleteTaskById(ownerId, taskId);
    if (!deleted) return res.status(404).json({ error: "Task not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Mark a task as done
router.post("/:id/done", requireAuth, async (req: AuthRequest, res) => {
  try {
    const ownerId = req.user?.id;
    const taskId = req.params.id;
    if (!ownerId) return res.status(400).json({ error: "Invalid user" });

    const task = await markTaskAsDone(ownerId, taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Mark a task as not done
router.post("/:id/undone", requireAuth, async (req: AuthRequest, res) => {
  try {
    const ownerId = req.user?.id;
    const taskId = req.params.id;
    if (!ownerId) return res.status(400).json({ error: "Invalid user" });

    const task = await markTaskAsUndone(ownerId, taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

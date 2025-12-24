import express, { Response } from "express";
import { z } from "zod";

import type { AuthRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validators.js";
import prisma from "../db.js";

const router = express.Router();

const createTeamSchema = z.object({
  name: z.string().min(1),
});

const addMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member']).optional(),
});

// Get all teams for the authenticated user
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Invalid user" });

    // Teams owned by the user
    const ownedTeams = await prisma.team.findMany({
      where: { ownerId: userId },
      include: { members: { include: { user: { select: { id: true, email: true } } } } },
    });

    // Teams the user is a member of
    const memberTeams = await prisma.team.findMany({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: { select: { id: true, email: true } } } } },
    });

    const allTeams = [
      ...ownedTeams,
      ...memberTeams.filter((t) => !ownedTeams.find((ot) => ot.id === t.id)),
    ];
    res.json(allTeams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new team
router.post("/", requireAuth, validateBody(createTeamSchema), async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(400).json({ error: "Invalid user" });

    const { name } = req.body;
    const team = await prisma.team.create({
      data: {
        name,
        ownerId,
      },
      include: { members: { include: { user: { select: { id: true, email: true } } } } },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get team by ID
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const teamId = req.params.id;

    if (!userId) return res.status(400).json({ error: "Invalid user" });

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: { members: { include: { user: { select: { id: true, email: true } } } } },
    });

    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add member to team
router.post("/:id/members", requireAuth, validateBody(addMemberSchema), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const teamId = req.params.id;

    if (!userId) return res.status(400).json({ error: "Invalid user" });

    // Check if user is team owner
    const team = await prisma.team.findFirst({
      where: { id: teamId, ownerId: userId },
    });

    if (!team) return res.status(403).json({ error: "Unauthorized" });

    const { userId: newMemberId, role } = req.body;

    const member = await prisma.teamMember.create({
      data: {
        userId: newMemberId,
        teamId,
        role: role || 'member',
      },
      include: { user: { select: { id: true, email: true } } },
    });

    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete team
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const teamId = req.params.id;

    if (!userId) return res.status(400).json({ error: "Invalid user" });

    // Check if user is team owner
    const team = await prisma.team.findFirst({
      where: { id: teamId, ownerId: userId },
    });

    if (!team) return res.status(403).json({ error: "Unauthorized - only team owner can delete" });

    // Delete all members first
    await prisma.teamMember.deleteMany({
      where: { teamId },
    });

    // Delete the team
    await prisma.team.delete({
      where: { id: teamId },
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Remove member from team
router.delete("/:id/members/:memberId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const teamId = req.params.id;
    const memberId = req.params.memberId;

    if (!userId) return res.status(400).json({ error: "Invalid user" });

    // Check if user is team owner
    const team = await prisma.team.findFirst({
      where: { id: teamId, ownerId: userId },
    });

    if (!team) return res.status(403).json({ error: "Unauthorized" });

    await prisma.teamMember.deleteMany({
      where: { id: memberId, teamId },
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

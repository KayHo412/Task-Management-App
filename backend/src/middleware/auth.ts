import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { env } from "../env.js";

export type AuthRequest = {
  user?: { id: string; email: string };
} & Request;

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = { id: String(payload.sub), email: payload.email };
    next();
  }
  catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../env.js";
import { validateBody } from "../middleware/validators.js";
import * as userService from "../services/userService.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        error: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign({ email: user.email }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1h",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      error: "Server error during login",
      code: "SERVER_ERROR",
    });
  }
});

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post("/signup", validateBody(signupSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await userService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: "Email already in use",
        code: "EMAIL_EXISTS",
      });
    }

    const user = await userService.createUser(email, password);

    const token = jwt.sign({ email: user.email }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1h",
    });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      error: "Server error during signup",
      code: "SERVER_ERROR",
    });
  }
});

export default router;

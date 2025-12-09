import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./env.js";

export function applyMiddlewares(app: express.Express) {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  if (env.NODE_ENV !== "test")
    app.use(morgan("dev"));
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    details: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

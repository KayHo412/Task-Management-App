import express from "express";

import api from "./api/controller.js";
import healthRoutes from "./api/health.js";
import { applyMiddlewares, errorHandler } from "./middlewares.js";

const app = express();

// Register global middlewares
applyMiddlewares(app);

// Register main API routes
app.use("/api", api);

// Attach the health routes
app.use("/", healthRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

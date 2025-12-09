import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../src/app.js";

process.env.JWT_SECRET = "GRoyY4mxZIip6PcIvexKVwkKfGa+E6887G0UalRixFI=";

describe("API routes", () => {
  it("GET /api responds with welcome message", async () => {
    const res = await request(app)
      .get("/api")
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(res.body).toEqual({ message: "Welcome to the urfhuhw where is my ut" });
  });

  it("GET /api/emojis returns an array of emojis", async () => {
    const res = await request(app).get("/api/emojis");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(typeof res.body[0]).toBe("string");
  });

  it("GET /health returns ok status and message", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("protected routes return 401 when called without token", async () => {
    const tasksRes = await request(app).get("/api/tasks");
    expect(tasksRes.status).toBe(401);
    expect(tasksRes.body).toEqual({ error: "Missing token" });

    const userRes = await request(app).get("/api/user");
    expect(userRes.status).toBe(401);
    expect(userRes.body).toEqual({ error: "Missing token" });
  });
});

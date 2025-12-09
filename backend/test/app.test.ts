import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../src/app.js";

process.env.JWT_SECRET = "GRoyY4mxZIip6PcIvexKVwkKfGa+E6887G0UalRixFI=";

describe("app", () => {
  it("responds with a 404 for unknown routes", async () => {
    const res = await request(app).get("/what-is-this-even");
    expect(res.status).toBe(404);
  });
});

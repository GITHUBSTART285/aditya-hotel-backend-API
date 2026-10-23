
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {
  it("should return status 200 and status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

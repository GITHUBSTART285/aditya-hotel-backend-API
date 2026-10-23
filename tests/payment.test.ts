
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Payment API", () => {
  it("should return 400 when bookingId is missing", async () => {
    const response = await request(app)
      .post("/api/payments")
      .send({
        method: "UPI",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

it("should return 400 when bookingId is invalid", async () => {
  const response = await request(app)
    .post("/api/payments")
    .send({
      bookingId: -1,
      method: "UPI",
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});
it("should return 400 when payment method is missing", async () => {
  const response = await request(app)
    .post("/api/payments")
    .send({
      bookingId: 1,
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});
it("should return 400 when payment method is invalid", async () => {
  const response = await request(app)
    .post("/api/payments")
    .send({
      bookingId: 1,
      method: "ABC",
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

it("should return 404 when booking is not found", async () => {
  const response = await request(app)
    .post("/api/payments")
    .send({
      bookingId: 999999,
      method: "UPI",
    });

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
});

it("should create payment successfully", async () => {
  const response = await request(app)
    .post("/api/payments")
    .send({
      bookingId: 5,
      method: "UPI",
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeDefined();
});
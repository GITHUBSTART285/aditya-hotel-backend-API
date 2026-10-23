
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler.js";
import roomsRouter from "./modules/rooms/rooms.index.js";
import bookingsRouter from "./modules/bookings/bookings.index.js";
import usersRouter from "./modules/users/user.index.js";
import authRouter from "./modules/auth/auth.index.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rooms routes
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentRoutes);
// Error handler — routes ke baad
app.use(errorHandler);

export default app;

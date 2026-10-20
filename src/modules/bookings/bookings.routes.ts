
import { Router } from "express";
import {
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  updateBookingPaymentStatusController,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
  updateBooking,
} from "./bookings.controller.js";

const router = Router();

// 1. Create booking
router.post("/", createBookingController);

// 2. Get all bookings
router.get("/", getBookingsController);

// 3. Get booking by ID
router.get("/:id", getBookingByIdController);

// 4. Update payment status
router.patch("/:id/payment", updateBookingPaymentStatusController);

// 5. Cancel booking
router.patch("/:id/cancel", cancelBooking);

// 6. Update booking status
router.patch("/:id/status", updateBookingStatus);

// 7. Update booking details
router.patch("/:id", updateBooking);

// 8. Delete booking
router.delete("/:id", deleteBooking);

export default router;

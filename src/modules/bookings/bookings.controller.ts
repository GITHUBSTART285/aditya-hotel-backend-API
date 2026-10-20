
import type { Request, Response, NextFunction } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingPaymentStatus,
  cancelBookingService,
  updateBookingStatusService,
  deleteBookingService,
  updateBookingService,
} from "./bookings.service.js";




type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";


// Create booking
export const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings
export const getBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await getBookings();

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
export const getBookingByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const booking = await getBookingById(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Update payment status
export const updateBookingPaymentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { paymentStatus } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

   
const allowedStatuses: ("PENDING" | "PAID" | "FAILED")[] = [
  "PENDING",
  "PAID",
  "FAILED",
];

if (
  typeof paymentStatus !== "string" ||
  !allowedStatuses.includes(paymentStatus as "PENDING" | "PAID" | "FAILED")
) {
  res.status(400).json({
    success: false,
    message: "paymentStatus must be PENDING, PAID, or FAILED",
  });
  return;
}

const booking = await updateBookingPaymentStatus(
  id,
  paymentStatus as "PENDING" | "PAID" | "FAILED"
);

    res.status(200).json({
      success: true,
      message: "Booking payment status updated successfully",
      data: booking,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Booking not found."
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "Cancelled booking cannot be paid."
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
};

// Validate booking ID
const getBookingId = (req: Request): number => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid booking ID");
  }

  return id;
};

// Cancel booking
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await cancelBookingService(getBookingId(req));

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    const allowedStatuses: BookingStatus[] = [
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ];

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as BookingStatus)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
      return;
    }

    const booking = await updateBookingStatusService(
      getBookingId(req),
      status as BookingStatus
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};


// Delete booking
export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteBookingService(getBookingId(req));

    return res.status(200).json({
      success: true,
      message: "Booking deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};

// Update booking details
export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await updateBookingService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Booking not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "Check-out must be after check-in") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    next(error);
  }
};

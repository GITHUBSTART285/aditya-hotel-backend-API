import type { Request, Response, NextFunction } from "express";
import { createPaymentService, getPaymentsService, getPaymentByIdService,
  getPaymentsByBookingIdService,updatePaymentStatusService, deletePaymentService,refundPaymentService} from "./payment.service.js";
import type { PaymentStatus } from "../../../generated/prisma/enums.js";
export const createPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId, method } = req.body;

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid bookingId is required",
      });
    }

    const allowedMethods = ["CASH", "UPI", "CARD", "ONLINE"];

    if (!allowedMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const payment = await createPaymentService(
      bookingId,
      method
    );

    return res.status(201).json({
      success: true,
      message: "Payment record created successfully",
      data: payment,
    });
  } catch (error) {
    const err = error as {
      message?: string;
      statusCode?: number;
    };

    return res.status(err.statusCode ?? 500).json({
      success: false,
      message: err.message ?? "Internal server error",
    });
  }
};


//gett all


export const getPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await getPaymentsService();

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

//get by ID
export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await getPaymentByIdService(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

//GET BY PAYMENT BOOKING ID
export const getPaymentsByBookingId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const payments = await getPaymentsByBookingIdService(bookingId);

    return res.status(200).json({
      success: true,
      message: "Booking payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PAYMENT METHOD
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
  const status = String(req.body.status ?? "").toUpperCase() as PaymentStatus;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const allowedStatuses = [
      "PENDING",
      "SUCCESS",
      "FAILED",
      "REFUNDED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const payment = await updatePaymentStatusService(id, status);

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// DELTE
export const deletePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await deletePaymentService(id);

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

//payment refund
// REFUND PAYMENT

export const refundPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await refundPaymentService(id);

    return res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

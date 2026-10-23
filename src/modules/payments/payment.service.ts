
import { prisma } from "../../config/prisma.js";
import type { PaymentMethod,PaymentStatus } from "../../../generated/prisma/enums.js";

export const createPaymentService = async (
  bookingId: number,
  method: PaymentMethod
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), {
      statusCode: 404,
    });
  }

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: booking.totalAmount,
      paymentMethod: method,
      status: "PENDING",
    },
  });

  return payment;
};

// Get all payments
export const getPaymentsService = async () => {
  const payments = await prisma.payment.findMany({
    include: {
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

// get by ID
export const getPaymentByIdService = async (id: number) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: {
      booking: true,
    },
  });
};

//GET BY BOOKING PAYMENT ID
export const getPaymentsByBookingIdService = async (
  bookingId: number
) => {
  return await prisma.payment.findMany({
    where: { bookingId },
    include: {
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// UPDATE


export const updatePaymentStatusService = async (
  id: number,
  status: PaymentStatus
) => {
  return await prisma.payment.update({
    where: { id },
    data: { status },
  });
};


// DELTE

  
// DELETE PAYMENT
export const deletePaymentService = async (id: number) => {
  return await prisma.payment.delete({
    where: { id },
  });
};


//payment refund 
// REFUND PAYMENT
export const refundPaymentService = async (id: number) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "SUCCESS") {
    throw new Error("Only successful payments can be refunded");
  }

  return await prisma.payment.update({
    where: { id },
    data: {
      status: "REFUNDED",
    },
  });
};

import { prisma } from "../../config/prisma.js";

type CreateBookingInput = {
  fullName: string;
  email: string;
  phone: string;
  specialRequest?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: number;
};

type UpdateBookingInput = {
  fullName?: string;
  email?: string;
  phone?: string;
  specialRequest?: string | null;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomId?: number;
};

// 1. Create booking
export const createBooking = async (input: CreateBookingInput) => {
  const {
    fullName,
    email,
    phone,
    specialRequest,
    checkIn,
    checkOut,
    guests,
    roomId,
  } = input;

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (
    !fullName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !checkIn ||
    !checkOut ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    !Number.isInteger(roomId) ||
    roomId < 1 ||
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    throw new Error("Please provide valid booking details.");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error("Room not found.");
  }

  if (guests > room.capacity) {
    throw new Error("Guest count exceeds room capacity.");
  }

  if (room.status !== "AVAILABLE") {
    throw new Error("Room is not available.");
  }

  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const totalAmount = Number(room.pricePerNight) * nights;

  return prisma.booking.create({
    data: {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialRequest: specialRequest?.trim() || null,
      checkIn: startDate,
      checkOut: endDate,
      guests,
      roomId,
      totalAmount,
    },
  });
};

// 2. Get all bookings
export const getBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { room: true },
  });
};

// 3. Get booking by ID
export const getBookingById = async (id: number) => {
  return prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
};

// 4. Update payment status
export const updateBookingPaymentStatus = async (
  id: number,
  paymentStatus: "PENDING" | "PAID" | "FAILED"
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (
    booking.status === "CANCELLED" &&
    paymentStatus === "PAID"
  ) {
    throw new Error("Cancelled booking cannot be paid.");
  }

  return prisma.booking.update({
    where: { id },
    data: {
      paymentStatus,
      ...(paymentStatus === "PAID"
        ? { status: "CONFIRMED" as const }
        : {}),
    },
    include: { room: true },
  });
};

// 5. Cancel booking
export const cancelBookingService = async (id: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Booking is already cancelled");
  }

  if (
    booking.status === "CHECKED_IN" ||
    booking.status === "CHECKED_OUT"
  ) {
    throw new Error(
      "Cannot cancel a checked-in or checked-out booking"
    );
  }

  return prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

// 6. Update booking status
export const updateBookingStatusService = async (
  id: number,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "CHECKED_IN"
    | "CHECKED_OUT"
    | "CANCELLED"
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return prisma.booking.update({
    where: { id },
    data: { status },
  });
};

// 7. Delete booking
export const deleteBookingService = async (id: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.paymentStatus === "PAID") {
    throw new Error(
      "Paid booking cannot be deleted. Handle refund and records first."
    );
  }

  return prisma.booking.delete({
    where: { id },
  });
};

// 8. Update booking details
export const updateBookingService = async (
  id: number,
  data: UpdateBookingInput
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const checkIn = data.checkIn !== undefined
    ? new Date(data.checkIn)
    : booking.checkIn;

  const checkOut = data.checkOut !== undefined
    ? new Date(data.checkOut)
    : booking.checkOut;

  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime()) ||
    checkOut <= checkIn
  ) {
    throw new Error("Check-out must be after check-in");
  }

  const updateData: {
    fullName?: string;
    email?: string;
    phone?: string;
    roomId?: number;
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
    specialRequest?: string | null;
  } = {};

  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.roomId !== undefined) updateData.roomId = data.roomId;
  if (data.guests !== undefined) updateData.guests = data.guests;

  if (data.specialRequest !== undefined) {
    updateData.specialRequest = data.specialRequest;
  }

  if (data.checkIn !== undefined) updateData.checkIn = checkIn;
  if (data.checkOut !== undefined) updateData.checkOut = checkOut;

  return prisma.booking.update({
    where: { id },
    data: updateData,
    include: { room: true },
  });
};

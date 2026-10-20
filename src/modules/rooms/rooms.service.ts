
import { prisma } from "../../config/prisma.js";

interface CreateRoomInput {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  capacity?: number;
}

export const createRoomService = async (input: CreateRoomInput) => {
  return prisma.room.create({
    data: {
      roomNumber: input.roomNumber.trim(),
      type: input.type.trim(),
      pricePerNight: input.pricePerNight,
      capacity: input.capacity ?? 2,
    },
  });
};

export const createManyRoomsService = async (
  rooms: CreateRoomInput[]
) => {
  const results = [];

  for (const input of rooms) {
    const roomNumber = input.roomNumber.trim();

    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber },
    });

    if (existingRoom) {
      results.push({
        roomNumber,
        status: "skipped",
        message: "Room number already exists",
        data: existingRoom,
      });
      continue;
    }

    const room = await prisma.room.create({
      data: {
        roomNumber,
        type: input.type.trim(),
        pricePerNight: input.pricePerNight,
        capacity: input.capacity ?? 2,
      },
    });

    results.push({
      roomNumber,
      status: "created",
      data: room,
    });
  }

  return results;
};

export const getRoomsService = async () => {
  return prisma.room.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};


// get by ID


export const getRoomByIdService = async (id: number) => {
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
};
//PATCH

export const updateRoomService = async (
  id: number,
  data: {
    roomNumber?: string;
    type?: string;
    pricePerNight?: number;
    capacity?: number;
    status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  }
) => {
  const existingRoom = await prisma.room.findUnique({
    where: { id },
  });

  if (!existingRoom) {
    throw new Error("Room not found");
  }

  return prisma.room.update({
    where: { id },
    data,
  });
};

// DELETE 
export const deleteRoomService = async (id: number) => {
  const existingRoom = await prisma.room.findUnique({
    where: { id },
  });

  if (!existingRoom) {
    throw new Error("Room not found");
  }

  // Check whether this room has any booking
  const existingBooking = await prisma.booking.findFirst({
    where: { roomId: id },
  });

  if (existingBooking) {
    throw new Error("Room has bookings and cannot be deleted");
  }

  // Delete room only if no booking exists
  return prisma.room.delete({
    where: { id },
  });
};
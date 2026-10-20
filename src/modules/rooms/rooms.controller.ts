
import type { Request, Response, NextFunction } from "express";
import { createRoomService ,getRoomsService,getRoomByIdService, updateRoomService, deleteRoomService} from "./rooms.service.js";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roomNumber, type, pricePerNight, capacity } = req.body;

    const room = await createRoomService({
      roomNumber,
      type,
      pricePerNight,
      capacity,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

  
//get 



// GET: Fetch all rooms
export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rooms = await getRoomsService();

    res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};



// GET BY ID
export const getRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
      return;
    }

    const room = await getRoomByIdService(id);

    res.status(200).json({
      success: true,
      message: "Room fetched successfully",
      data: room,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Room not found") {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });
      return;
    }

    next(error);
  }
};


//PATCH BY 



export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
      return;
    }

    const {
      roomNumber,
      type,
      pricePerNight,
      capacity,
      status,
    } = req.body;

    if (
      roomNumber === undefined &&
      type === undefined &&
      pricePerNight === undefined &&
      capacity === undefined &&
      status === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
      return;
    }

    if (
      pricePerNight !== undefined &&
      (!Number.isFinite(Number(pricePerNight)) ||
        Number(pricePerNight) <= 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Price must be greater than zero",
      });
      return;
    }

    if (
      capacity !== undefined &&
      (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Capacity must be a positive integer",
      });
      return;
    }

    if (
      status !== undefined &&
      !["AVAILABLE", "OCCUPIED", "MAINTENANCE"].includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid room status",
      });
      return;
    }

    const room = await updateRoomService(id, {
      ...(roomNumber !== undefined && { roomNumber }),
      ...(type !== undefined && { type }),
      ...(pricePerNight !== undefined && {
        pricePerNight: Number(pricePerNight),
      }),
      ...(capacity !== undefined && { capacity: Number(capacity) }),
      ...(status !== undefined && { status }),
    });

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Room not found") {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });
      return;
    }

    next(error);
  }
};

// DELTE 

export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    await deleteRoomService(id);

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
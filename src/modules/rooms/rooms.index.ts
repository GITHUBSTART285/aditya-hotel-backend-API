import { Router } from "express";
import roomsRouter from "./rooms.routes.js";

const router = Router();

router.use("/", roomsRouter);

export default router;
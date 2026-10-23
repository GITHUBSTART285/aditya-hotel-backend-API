import { Router } from "express";
import { createPayment,getPayments,getPaymentById,getPaymentsByBookingId
  ,updatePaymentStatus,deletePayment, refundPayment
 } from "./payment.controller.js";

const router = Router();

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.get("/booking/:bookingId", getPaymentsByBookingId);
router.patch("/:id/status", updatePaymentStatus);
router.delete("/:id", deletePayment);
router.post("/:id/refund", refundPayment);
export default router;
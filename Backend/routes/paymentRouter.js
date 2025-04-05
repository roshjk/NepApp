import express from "express";
import {
  initiatePayment,
  verifyPayment,
  releasePayment,
  getPaymentStatus,
} from "../controllers/paymentController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Business Pays Before Work Starts
router.post("/initiate", isAuthenticated, initiatePayment);

// ✅ Admin Verifies Payment
router.post("/verify/:transactionId", isAuthenticated, isAdmin, verifyPayment);

// ✅ Admin Releases Payment to Student
router.post("/release/:jobId", isAuthenticated, isAdmin, releasePayment);

// ✅ Get Payment Status
router.get("/status/:jobId", isAuthenticated, getPaymentStatus);

export default router;

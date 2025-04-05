import axios from "axios";
import { Payment } from "../models/paymentSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const KHALTI_SECRET_KEY = "your_khalti_secret_key"; // Store in .env

// ✅ Business Makes a Payment
export const initiatePayment = catchAsyncErrors(async (req, res, next) => {
  const { amount, jobId, studentId } = req.body;
  const businessId = req.user._id;

  if (!amount || !jobId || !studentId) {
    return next(new ErrorHandler("Amount, Job ID, and Student ID are required", 400));
  }

  const khaltiResponse = await axios.post(
    "https://khalti.com/api/v2/payment/initiate/",
    {
      return_url: "http://yourfrontend.com/payment-success",
      amount: amount * 100, // Khalti uses paisa (1 NPR = 100 paisa)
      purchase_order_id: jobId,
      purchase_order_name: "Job Payment",
    },
    {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const payment = await Payment.create({
    jobId,
    businessId,
    studentId,
    transactionId: khaltiResponse.data.idx,
    amount,
    status: "Pending Verification",
  });

  res.status(201).json({
    success: true,
    message: "Payment initiated, waiting for admin verification.",
    khaltiResponse: khaltiResponse.data,
  });
});

// ✅ Admin Verifies Payment
export const verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { transactionId } = req.params;
  const adminId = req.user._id;

  const payment = await Payment.findOne({ transactionId });
  if (!payment) return next(new ErrorHandler("Payment not found", 404));

  if (payment.status !== "Pending Verification") {
    return next(new ErrorHandler("Payment already processed", 400));
  }

  payment.status = "Verified";
  payment.verifiedBy = adminId;
  await payment.save();

  res.status(200).json({ success: true, message: "Payment verified by admin." });
});

// ✅ Release Payment to Student (After Job Completion)
export const releasePayment = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const adminId = req.user._id;

  const payment = await Payment.findOne({ jobId, status: "Verified" });
  if (!payment) return next(new ErrorHandler("Verified payment not found", 404));

  payment.status = "Released";
  payment.releasedBy = adminId;
  await payment.save();

  res.status(200).json({ success: true, message: "Payment released to student." });
});

// ✅ Get Payment Status (For Business and Admin)
export const getPaymentStatus = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const payment = await Payment.findOne({ jobId });

  if (!payment) return next(new ErrorHandler("Payment not found", 404));

  res.status(200).json({ success: true, payment });
});

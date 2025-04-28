import axios from "axios";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { io } from "../server.js";

// ✅ INITIATE payment with Khalti
export const callKhalti = catchAsyncErrors(async (req, res, next) => {
  const formData = req.body;

  try {
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      formData,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Khalti initiated",
      payment_method: "khalti",
      data: response.data,
    });
  } catch (err) {
    console.log("Khalti Init Error:", err.response?.data || err.message);
    return res.status(400).json({ error: err?.message || "Khalti init failed" });
  }
});

// ✅ VERIFY payment with Khalti
export const khaltiVerify = catchAsyncErrors(async (req, res, next) => {
  const { token, amount, applicationId } = req.body;

  const response = await axios.post(
    "https://dev.khalti.com/api/v2/payment/verify/",
    { token, amount },
    {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    }
  );

  if (response.data?.idx) {
    const application = await Application.findById(applicationId);
    if (!application) return next(new ErrorHandler("Application not found", 404));

    application.paymentStatus = "pending"; // payment verified, now waiting for student to submit work
    await application.save();

    return res.status(200).json({
      success: true,
      message: "✅ Payment verified successfully.",
      transaction_id: response.data.idx,
    });
  } else {
    return next(new ErrorHandler("Khalti verification failed", 400));
  }
});

// ✅ Handle Redirect from Khalti
export const handleKhaltiRedirect = catchAsyncErrors(async (req, res, next) => {
  const { pidx, status, purchase_order_id } = req.query;

  if (status !== "Completed") {
    return res.redirect(`http://localhost:5173/dashboard?payment=failed`);
  }

  // Verify payment from Khalti
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.status === "Completed") {
    const application = await Application.findById(purchase_order_id);
    if (!application) return next(new ErrorHandler("Application not found", 404));

    application.paymentStatus = "pending";
    await application.save();

    return res.redirect(`http://localhost:5173/dashboard?payment=success`);
  }

  return res.redirect(`http://localhost:5173/dashboard?payment=failed`);
});
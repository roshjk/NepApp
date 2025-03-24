import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const router = express.Router();

// 📌 Admin Login
router.post("/login", catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "Admin" }).select("+password");
    if (!admin) return next(new ErrorHandler("Admin not found", 404));

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return next(new ErrorHandler("Invalid credentials", 400));

    sendToken(admin, 200, res, "Admin logged in successfully.");
}));

export default router;

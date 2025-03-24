import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body;

        // Ensure required fields are provided
        if (!name || !email || !phone || !address || !password || !role) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        // If the user is a Student, ensure they provide niche interests
        if (role === "Student" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return next(new ErrorHandler("Please provide your interest niches.", 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler("This email is already registered.", 400));
        }

        const userData = {
            name,
            email,
            phone,
            address,
            password,
            role,
            niches: { firstNiche, secondNiche, thirdNiche },
            coverLetter,
        };

        // Handle resume upload if provided
        if (req.files?.resume) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
                    folder: "Student_Resume",
                });

                if (!cloudinaryResponse?.secure_url) {
                    return next(new ErrorHandler("Failed to upload resume to cloud.", 500));
                }

                userData.resume = {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                };
            } catch (error) {
                return next(new ErrorHandler("Failed to upload resume", 500));
            }
        }

        const user = await User.create(userData);
        sendToken(user, 201, res, "User registered successfully.");
    } catch (error) {
        next(error);
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Ensure required fields are provided
    if (!email || !password) {
        return next(new ErrorHandler("Email and password are required.", 400));
    }

    // Prevent Admins from using this login
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    sendToken(user, 200, res, "User logged in successfully.");
});

//admin here add

export const adminLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Find admin in the database
    const admin = await User.findOne({ email, role: "Admin" }).select("+password");

    if (!admin) {
        return next(new ErrorHandler("Admin not found or unauthorized!", 401));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password!", 401));
    }

    // Generate JWT Token with role
    const token = admin.getJWTToken();  // Ensure `getJWTToken()` includes role
    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    }).json({
        success: true,
        token,
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,  // Include role in response
        },
        message: "Admin logged in successfully."
    });
});


export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, address, coverLetter, firstNiche, secondNiche, thirdNiche } = req.body;

    const newUserData = {
        name,
        email,
        phone,
        address,
        coverLetter,
        niches: { firstNiche, secondNiche, thirdNiche },
    };

    // Ensure Student role has niches
    if (req.user.role === "Student" && (!firstNiche || !secondNiche || !thirdNiche)) {
        return next(new ErrorHandler("Please provide all preferred job niches.", 400));
    }

    // Handle resume upload
    if (req.files?.resume) {
        if (req.user.resume?.public_id) {
            await cloudinary.uploader.destroy(req.user.resume.public_id);
        }

        const newResume = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
            folder: "Student_Resume",
        });

        newUserData.resume = {
            public_id: newResume.public_id,
            url: newResume.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user,
        message: "Profile updated successfully.",
    });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect.", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New password and confirm password do not match.", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res, "Password updated successfully.");
});
